// Brings the Latte page to life: the scroll-scrubbed pour, caption beats, section
// entrances, the pour line, press-and-hold and the FAQ. Everything is scoped to `root`
// and torn down by the returned cleanup, so leaving the page leaves nothing running.

interface Options {
  onAdd: (id: string) => void;
  onNavigate: (path: string) => void;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smooth = (p: number, e0: number, e1: number) => {
  const t = clamp((p - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Seeded so the "random" scatter is identical on every visit
function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

// Tube keyframes: [progress, x, y, rotation, squeeze]
const TK = [
  [0, 560, 210, 24, 1],
  [0.2, 400, 180, 90, 1],
  [0.34, 400, 180, 90, 0.8],
  [0.7, 400, 180, 90, 0.78],
  [0.78, 400, 180, 90, 1],
  [0.93, 640, 795, -90, 1],
  [1, 640, 795, -90, 1],
];
const BLOOM_TO = [
  [-40, 120, 1.3],
  [46, 190, 1.5],
  [-10, 250, 1.7],
  [30, 70, 1.1],
];

function tubeAt(p: number) {
  for (let i = 1; i < TK.length; i++) {
    if (p <= TK[i][0]) {
      const A = TK[i - 1];
      const B = TK[i];
      const t = smooth(p, A[0], B[0]);
      return [lerp(A[1], B[1], t), lerp(A[2], B[2], t), lerp(A[3], B[3], t), lerp(A[4], B[4], t)];
    }
  }
  const L = TK[TK.length - 1];
  return [L[1], L[2], L[3], L[4]];
}

export function initLattePage(root: HTMLElement, { onAdd, onNavigate }: Options): () => void {
  const $ = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = root) => [...r.querySelectorAll<T>(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const cleanups: Array<() => void> = [];
  const on = (t: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions) => {
    t.addEventListener(type, fn, opts);
    cleanups.push(() => t.removeEventListener(type, fn, opts));
  };
  const rafs = new Set<number>();
  const raf = (fn: FrameRequestCallback) => {
    const id = requestAnimationFrame((t) => {
      rafs.delete(id);
      fn(t);
    });
    rafs.add(id);
    return id;
  };

  // ---------- split the hero captions into words and characters ----------
  const rand = rng(7);
  $$('.band').forEach((band) => {
    if (band.dataset.split) return; // already split (React may run effects twice in development)
    band.dataset.split = '1';
    const spread = parseFloat(band.dataset.spread || '0.5');
    const words: HTMLElement[] = [];
    $$('.split', band).forEach((line) => {
      const text = line.textContent || '';
      line.textContent = '';
      const sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = text;
      const vis = document.createElement('span');
      vis.setAttribute('aria-hidden', 'true');
      text.split(' ').forEach((word, wi, arr) => {
        const w = document.createElement('span');
        w.className = 'w';
        [...word].forEach((ch) => {
          const c = document.createElement('span');
          c.className = 'c';
          c.textContent = ch;
          w.append(c);
        });
        vis.append(w);
        if (wi < arr.length - 1) vis.append(' ');
        words.push(w);
      });
      line.append(sr, vis);
    });
    words.forEach((w, i) => w.style.setProperty('--th', ((i / Math.max(1, words.length)) * 0.5).toFixed(3)));
    if (band.dataset.fx === 'scatter') {
      $$('.c', band).forEach((c) => {
        c.style.setProperty('--th', (rand() * spread).toFixed(3));
        c.style.setProperty('--jx', ((rand() - 0.5) * 120).toFixed(1) + 'px');
        c.style.setProperty('--jy', ((rand() - 0.5) * 90).toFixed(1) + 'px');
        c.style.setProperty('--jr', ((rand() - 0.5) * 70).toFixed(1) + 'deg');
      });
    }
  });

  // whisper-level dust
  const dust = $('.dust');
  dust.textContent = '';
  for (let i = 0; i < 18; i++) {
    const d = document.createElement('i');
    d.style.left = (rand() * 100).toFixed(1) + '%';
    d.style.top = (rand() * 100).toFixed(1) + '%';
    d.style.animationDelay = (-rand() * 26).toFixed(1) + 's';
    d.style.animationDuration = (22 + rand() * 16).toFixed(1) + 's';
    d.style.opacity = (0.3 + rand() * 0.7).toFixed(2);
    dust.append(d);
  }

  // ---------- the hero scene ----------
  const hero = $('#hero');
  const bands = $$('.band').map((el) => ({
    el,
    a: +(el.dataset.a || 0),
    b: +(el.dataset.b || 1),
    ramp: el.dataset.ramp ? +el.dataset.ramp : 0,
    op: -1,
    k: -1,
  }));
  const S = {
    tube: $<SVGElement>('#tube'),
    shape: $<SVGElement>('#tubeShape'),
    stream: $<SVGElement>('#stream'),
    drop: $<SVGElement>('#drop'),
    splash: $<SVGElement>('#splash'),
    tint: $<SVGElement>('#tint'),
    blooms: $$<SVGElement>('#blooms .bl'),
    swirl: $<SVGElement>('#swirl'),
    foam: $<SVGElement>('#foam'),
    ice: $<SVGElement>('#ice'),
    drops: $<SVGElement>('#drops'),
  };
  const attrCache = new WeakMap<Element, Record<string, string>>();
  const setAttr = (el: Element, name: string, val: string) => {
    let m = attrCache.get(el);
    if (!m) attrCache.set(el, (m = {}));
    if (m[name] !== val) {
      m[name] = val;
      el.setAttribute(name, val);
    }
  };

  function drawScene(p: number) {
    const [x, y, r, sq] = tubeAt(p);
    setAttr(S.tube, 'transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(2)})`);
    setAttr(S.shape, 'transform', `scale(1 ${sq.toFixed(3)})`);
    const dt = smooth(p, 0.13, 0.27);
    setAttr(S.drop, 'opacity', p > 0.12 && p < 0.27 ? '1' : '0');
    setAttr(S.drop, 'transform', `translate(0 ${(dt * 270).toFixed(1)})`);
    const grow = smooth(p, 0.25, 0.31);
    const back = smooth(p, 0.66, 0.74);
    const sy = Math.max(0.0001, grow * (1 - back));
    setAttr(S.stream, 'transform', `translate(0 ${(back * 300).toFixed(1)}) translate(400 330) scale(1 ${sy.toFixed(4)}) translate(-400 -330)`);
    setAttr(S.stream, 'opacity', grow > 0 && back < 1 ? '1' : '0');
    const pouring = grow * (1 - back);
    const wob = 1 + Math.sin(p * 160) * 0.12;
    setAttr(S.splash, 'opacity', (pouring * 0.85).toFixed(3));
    setAttr(S.splash, 'transform', `translate(400 622) scale(${(wob * (0.6 + pouring * 0.5)).toFixed(3)} 1) translate(-400 -622)`);
    const bloom = smooth(p, 0.3, 0.6);
    const mix = smooth(p, 0.56, 0.8);
    S.blooms.forEach((el, i) => {
      const [dx, dy, s] = BLOOM_TO[i];
      const ang = mix * (i % 2 ? -1 : 1) * (40 + i * 18);
      setAttr(el, 'opacity', (bloom * (1 - mix * 0.85) * 0.95).toFixed(3));
      setAttr(el, 'transform', `rotate(${ang.toFixed(1)} 400 780) translate(${(dx * bloom).toFixed(1)} ${(dy * bloom).toFixed(1)}) translate(400 630) scale(${(0.2 + bloom * s).toFixed(3)}) translate(-400 -630)`);
    });
    setAttr(S.swirl, 'opacity', (smooth(p, 0.52, 0.62) * (1 - smooth(p, 0.74, 0.84)) * 0.8).toFixed(3));
    setAttr(S.swirl, 'transform', `rotate(${(mix * 50).toFixed(1)} 400 780)`);
    setAttr(S.tint, 'opacity', (smooth(p, 0.32, 0.82) * 0.96).toFixed(3));
    setAttr(S.foam, 'opacity', smooth(p, 0.78, 0.9).toFixed(3));
    setAttr(S.ice, 'transform', `translate(0 ${(Math.sin(p * 90) * 3 * pouring).toFixed(2)})`);
    setAttr(S.drops, 'opacity', smooth(p, 0.86, 0.98).toFixed(3));
  }

  const heroProgress = () => {
    const range = hero.offsetHeight - innerHeight;
    return range > 0 ? clamp(-hero.getBoundingClientRect().top / range, 0, 1) : 1;
  };

  let loadK = 0;
  const loadStart = performance.now();
  function updateBands(p: number) {
    bands.forEach((B, i) => {
      const f = Math.min(0.02, (B.b - B.a) / 3);
      const inE = i === 0 ? (p >= B.a ? 1 : 0) : smooth(p, B.a, B.a + f);
      const outE = i === bands.length - 1 ? 1 : 1 - smooth(p, B.b - f, B.b);
      const op = inE * outE;
      let k = clamp((p - B.a) / (B.ramp || Math.min(0.025, (B.b - B.a) * 0.35)), 0, 1);
      if (i === 0) k = Math.max(k, loadK);
      if (Math.abs(op - B.op) > 0.004 || (op === 0) !== (B.op === 0)) {
        B.op = op;
        B.el.style.opacity = op.toFixed(3);
        B.el.classList.toggle('on', op > 0.5);
      }
      if (Math.abs(k - B.k) > 0.008 || (k === 1 && B.k !== 1)) {
        B.k = k;
        B.el.style.setProperty('--k', k.toFixed(3));
      }
    });
  }

  // Lerped display progress; the loop rests when converged or off-screen
  let target = 0;
  let shown = 0;
  let rafId: number | null = null;
  let lastTick = 0;
  let heroOn = true;
  let scrubOn = false;
  function tick(now: number) {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    loadK = smooth((now - loadStart) / 1100, 0, 1);
    shown += (target - shown) * (1 - Math.pow(1 - 0.14, dt / 16.667));
    const settled = Math.abs(target - shown) < 0.0005 && loadK >= 1;
    if (settled) shown = target;
    drawScene(shown);
    updateBands(shown);
    if (settled || !heroOn) {
      rafId = null;
      lastTick = 0;
    } else rafId = raf(tick);
  }
  const kick = () => {
    if (rafId === null && scrubOn) rafId = raf(tick);
  };
  const cue = $('.scrollcue');
  const onScroll = () => {
    target = heroProgress();
    cue.classList.toggle('gone', target > 0.03);
    kick();
  };
  const heroIO = new IntersectionObserver((es) => {
    heroOn = es[0].isIntersecting;
    if (heroOn) kick();
  });
  heroIO.observe(hero);
  cleanups.push(() => heroIO.disconnect());

  function pinToFinal() {
    shown = target = 1;
    loadK = 1;
    drawScene(1);
    bands.forEach((B, i) => {
      const last = i === bands.length - 1;
      B.el.style.opacity = last ? '1' : '0';
      B.el.style.setProperty('--k', '1');
      B.el.classList.toggle('on', last);
      B.op = last ? 1 : 0;
      B.k = 1;
    });
    hero.style.height = '100vh';
  }
  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    hero.style.height = '';
    bands.forEach((B) => {
      B.op = -1;
      B.k = -1;
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    shown = target;
    kick();
  }
  function disableScrub() {
    if (scrubOn) {
      scrubOn = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafs.delete(rafId);
        rafId = null;
      }
    }
    pinToFinal();
  }
  cleanups.push(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  });

  // ---------- section entrances, counters, living loops ----------
  const counters = $$('.count');
  function runCounter(el: HTMLElement) {
    const to = +(el.dataset.to || 0);
    if (RM.matches || to === 0) {
      el.textContent = String(to);
      return;
    }
    const t0 = performance.now();
    const step = (now: number) => {
      const t = clamp((now - t0) / 1300, 0, 1);
      const v = String(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (el.textContent !== v) el.textContent = v;
      if (t < 1) raf(step);
    };
    el.textContent = '0';
    raf(step);
  }
  const timers: number[] = [];
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        const t = e.target as HTMLElement;
        t.classList.toggle('live', e.isIntersecting);
        if (e.isIntersecting && !t.classList.contains('in')) {
          t.classList.add('in');
          $$('.count', t).forEach(runCounter);
          timers.push(window.setTimeout(() => t.classList.add('done'), 2200));
        }
      }),
    { rootMargin: '0px 0px -12% 0px' }
  );
  $$('.reveal').forEach((s) => io.observe(s));
  cleanups.push(() => io.disconnect());
  on(document, 'visibilitychange', () => root.classList.toggle('paused', document.hidden));

  // ---------- the pour line: continues the hero's pour down the page ----------
  const pl = $('.pourline');
  const main = $('#lp-main');
  const finalBtn = $('#finalcta');
  let plH = 0;
  let plQueued = false;
  function layoutPourline() {
    const mainTop = main.getBoundingClientRect().top + scrollY;
    const btnTop = finalBtn.getBoundingClientRect().top + scrollY;
    plH = Math.max(0, btnTop - mainTop - 40);
    pl.style.height = plH + 'px';
  }
  function drawPourline() {
    plQueued = false;
    if (!plH) return;
    const reach = clamp((innerHeight * 0.6 - main.getBoundingClientRect().top) / plH, 0, 1);
    pl.style.setProperty('--pl', reach.toFixed(4));
    pl.style.setProperty('--py', (reach * plH - 5).toFixed(1) + 'px');
  }
  const queuePourline = () => {
    if (!plQueued) {
      plQueued = true;
      raf(drawPourline);
    }
  };
  layoutPourline();
  drawPourline();
  on(window, 'scroll', queuePourline, { passive: true });
  on(window, 'resize', () => {
    layoutPourline();
    queuePourline();
  });
  on(window, 'load', () => {
    layoutPourline();
    queuePourline();
  });
  // images and fonts arriving change the page height
  const ro = new ResizeObserver(() => {
    layoutPourline();
    queuePourline();
  });
  ro.observe(main);
  cleanups.push(() => ro.disconnect());

  // ---------- press and hold to pour ----------
  const press = $('#press');
  const hold = $<HTMLButtonElement>('#hold');
  const holdLabel = hold.querySelector('span')!;
  const pFill = $<SVGElement>('#pFill');
  const pStream = $<SVGElement>('#pStream');
  let hp = 0;
  let holding = false;
  let holdRaf: number | null = null;
  let holdLast = 0;
  let complete = false;
  pStream.style.transition = 'transform .25s cubic-bezier(.22,1,.36,1)';
  function renderHold() {
    hold.style.setProperty('--hp', hp.toFixed(3));
    pFill.style.transform = `scaleY(${hp.toFixed(3)})`;
    pStream.style.transform = `scaleY(${holding && !complete ? 1 : 0})`;
  }
  function holdTick(now: number) {
    const dt = Math.min(64, now - (holdLast || now));
    holdLast = now;
    if (holding && !complete) hp = Math.min(1, hp + dt / 1600);
    else if (!complete) hp = Math.max(0, hp - dt / 900);
    if (hp >= 1 && !complete) {
      complete = true;
      holding = false;
      press.classList.add('complete');
      holdLabel.textContent = 'Poured. Press again to refill';
    }
    renderHold();
    if (holding || (!complete && hp > 0)) holdRaf = raf(holdTick);
    else {
      holdRaf = null;
      holdLast = 0;
    }
  }
  function startHold(e?: Event) {
    e?.preventDefault();
    if (complete) {
      complete = false;
      hp = 0;
      press.classList.remove('complete');
      holdLabel.textContent = 'Press and hold to pour';
    }
    holding = true;
    if (holdRaf === null) holdRaf = raf(holdTick);
  }
  function endHold() {
    holding = false;
    if (holdRaf === null) holdRaf = raf(holdTick);
  }
  on(hold, 'pointerdown', (e) => {
    hold.setPointerCapture((e as PointerEvent).pointerId);
    startHold(e);
  });
  on(hold, 'pointerup', endHold);
  on(hold, 'pointercancel', endHold);
  on(hold, 'keydown', (e) => {
    const k = e as KeyboardEvent;
    if ((k.key === ' ' || k.key === 'Enter') && !k.repeat) startHold(e);
  });
  on(hold, 'keyup', (e) => {
    const k = (e as KeyboardEvent).key;
    if (k === ' ' || k === 'Enter') endHold();
  });
  on(hold, 'contextmenu', (e) => e.preventDefault());
  function holdFinal() {
    hp = 1;
    complete = true;
    holding = false;
    press.classList.add('complete');
    renderHold();
  }

  // ---------- FAQ ----------
  $$<HTMLButtonElement>('.qa button').forEach((b) =>
    on(b, 'click', () => {
      const qa = b.parentElement!;
      const open = qa.hasAttribute('data-open');
      qa.toggleAttribute('data-open', !open);
      b.setAttribute('aria-expanded', String(!open));
    })
  );

  // ---------- shop links and add to cart ----------
  on(root, 'click', (e) => {
    const me = e as MouseEvent;
    const target = me.target as Element;
    const add = target.closest<HTMLButtonElement>('[data-add]');
    if (add) {
      if (add.classList.contains('added')) {
        onNavigate('/cart');
        return;
      }
      onAdd(add.dataset.add!);
      add.classList.add('added');
      add.textContent = 'Added · View cart';
      return;
    }
    const link = target.closest<HTMLAnchorElement>('a[data-route]');
    if (link && !me.metaKey && !me.ctrlKey && !me.shiftKey && me.button === 0) {
      e.preventDefault();
      onNavigate(link.getAttribute('href')!);
    }
  });

  // ---------- reduced motion, live in both directions ----------
  function applyMode() {
    if (RM.matches) {
      disableScrub();
      holdFinal();
      counters.forEach((c) => (c.textContent = c.dataset.to || ''));
    } else enableScrub();
    layoutPourline();
    queuePourline();
  }
  on(RM, 'change', applyMode);
  applyMode();

  return () => {
    cleanups.forEach((fn) => fn());
    rafs.forEach((id) => cancelAnimationFrame(id));
    timers.forEach((id) => clearTimeout(id));
  };
}
