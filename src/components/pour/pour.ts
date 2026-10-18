// "The Pour": the Latte tube tilts, presses and pours into a glass of iced milk,
// the coffee billows through it and settles into a caramel latte. Shared by the
// home page hero (light theme) and the Latte page (dark theme). Progress 0..1
// drives every part; callers decide what drives progress (scroll, a timed play,
// or a fixed final frame).

export type PourTheme = 'light' | 'dark';

const THEMES = {
  dark: {
    halo: '#1F5C4A', haloOpacity: '.55',
    shadow: '#000', shadowOpacity: '.5',
    glassFill: 'rgba(233,217,192,.05)', glassStroke: 'rgba(233,217,192,.5)', glassEdge: 'rgba(233,217,192,.22)',
    milkTop: '#FBF6EE', milkBottom: '#E3D6C2',
  },
  // On the cream shop background the glow is softer and the glass outline is coffee brown
  light: {
    halo: '#C9A27A', haloOpacity: '.32',
    shadow: '#6B4F35', shadowOpacity: '.28',
    glassFill: 'rgba(255,255,255,.1)', glassStroke: 'rgba(120,92,64,.65)', glassEdge: 'rgba(120,92,64,.25)',
    milkTop: '#FFFFFF', milkBottom: '#EFE6D8',
  },
};

// Glass geometry: rim at y=560 (x 290..510), base at y=948 (x 312..488)
const GLASS = 'M290 560 L510 560 L489 944 Q488 952 479 952 L321 952 Q312 952 311 944 Z';
const INSIDE = 'M297 566 L503 566 L484 934 L316 934 Z';
const SURFACE_Y = 614;

/** The scene's SVG markup. `p` prefixes gradient, filter and clip ids so two scenes never clash. */
export function pourSvg(theme: PourTheme, p = '', viewBox = '0 0 800 1000'): string {
  const t = THEMES[theme];
  return `
  <svg viewBox="${viewBox}" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="${p}halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${t.halo}" stop-opacity="${t.haloOpacity}"/><stop offset=".6" stop-color="${t.halo}" stop-opacity="${(+t.haloOpacity * 0.35).toFixed(2)}"/><stop offset="1" stop-color="${t.halo}" stop-opacity="0"/></radialGradient>
    <!-- tube: shaded across its thickness so it reads as a cylinder -->
    <linearGradient id="${p}tubeBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0D2A21"/><stop offset=".16" stop-color="#1B5242"/><stop offset=".34" stop-color="#2C7A62"/>
      <stop offset=".42" stop-color="#4FA088"/><stop offset=".5" stop-color="#2A7259"/><stop offset=".78" stop-color="#174536"/><stop offset="1" stop-color="#0B231C"/>
    </linearGradient>
    <linearGradient id="${p}seal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E2C23"/><stop offset=".45" stop-color="#2A6E58"/><stop offset="1" stop-color="#0C261E"/></linearGradient>
    <linearGradient id="${p}capG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2E8A66"/><stop offset=".28" stop-color="#6FD3A8"/><stop offset=".42" stop-color="#C4F5DF"/><stop offset=".58" stop-color="#76D8AE"/><stop offset="1" stop-color="#2A7F5E"/>
    </linearGradient>
    <linearGradient id="${p}milk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.milkTop}"/><stop offset="1" stop-color="${t.milkBottom}"/></linearGradient>
    <linearGradient id="${p}latte" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#D9B48A"/><stop offset=".35" stop-color="#C08F62"/><stop offset=".75" stop-color="#A06F45"/><stop offset="1" stop-color="#8A5C37"/>
    </linearGradient>
    <linearGradient id="${p}foam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8EC"/><stop offset="1" stop-color="#EAD3B4"/></linearGradient>
    <linearGradient id="${p}streamG" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2A160A"/><stop offset=".35" stop-color="#5C3519"/><stop offset=".5" stop-color="#9A6438"/><stop offset=".65" stop-color="#5C3519"/><stop offset="1" stop-color="#24130A"/>
    </linearGradient>
    <linearGradient id="${p}ice" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".5" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity=".45"/></linearGradient>
    <linearGradient id="${p}glassShine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".65"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <clipPath id="${p}glassClip"><path d="${INSIDE}"/></clipPath>
    <!-- coffee clouds get soft, organic edges -->
    <filter id="${p}plume" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency=".016" numOctaves="3" seed="7" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="38" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feGaussianBlur in="d" stdDeviation="6"/>
    </filter>
    <filter id="${p}blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
  </defs>

  <ellipse cx="400" cy="720" rx="330" ry="330" fill="url(#${p}halo)"/>
  <ellipse cx="402" cy="958" rx="150" ry="13" fill="${t.shadow}" opacity="${t.shadowOpacity}" filter="url(#${p}blur)"/>
  <ellipse data-p="tubeShadow" cx="640" cy="960" rx="52" ry="8" fill="${t.shadow}" opacity="0" filter="url(#${p}blur)"/>

  <!-- what's in the glass -->
  <g clip-path="url(#${p}glassClip)">
    <rect x="280" y="${SURFACE_Y}" width="240" height="340" fill="url(#${p}milk)"/>
    <rect data-p="tint" x="280" y="${SURFACE_Y}" width="240" height="340" fill="url(#${p}latte)" opacity="0"/>
    <g data-p="plume" filter="url(#${p}plume)">
      <path data-p="dive" d="M400 ${SURFACE_Y}" fill="none" stroke="#4A2814" stroke-width="16" stroke-linecap="round" opacity="0"/>
      <ellipse class="bl" cx="400" cy="${SURFACE_Y + 10}" rx="46" ry="34" fill="#5A3218" opacity="0"/>
      <ellipse class="bl" cx="400" cy="${SURFACE_Y + 10}" rx="40" ry="30" fill="#8A552C" opacity="0"/>
      <ellipse class="bl" cx="400" cy="${SURFACE_Y + 10}" rx="52" ry="26" fill="#6E4122" opacity="0"/>
      <ellipse class="bl" cx="400" cy="${SURFACE_Y + 10}" rx="34" ry="30" fill="#9C653A" opacity="0"/>
      <ellipse class="bl" cx="400" cy="${SURFACE_Y + 10}" rx="42" ry="22" fill="#5A3218" opacity="0"/>
    </g>
    <rect data-p="foam" x="280" y="${SURFACE_Y - 2}" width="240" height="26" fill="url(#${p}foam)" opacity="0"/>
    <g data-p="ice">
      <g transform="rotate(-14 344 628)"><rect x="316" y="600" width="56" height="54" rx="12" fill="url(#${p}ice)" stroke="rgba(255,255,255,.85)" stroke-width="2"/><path d="M326 612 h22" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/></g>
      <g transform="rotate(10 432 630)"><rect x="405" y="604" width="54" height="52" rx="12" fill="url(#${p}ice)" stroke="rgba(255,255,255,.85)" stroke-width="2"/><path d="M415 616 h20" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/></g>
      <g transform="rotate(4 383 676)"><rect x="358" y="652" width="50" height="48" rx="11" fill="url(#${p}ice)" stroke="rgba(255,255,255,.75)" stroke-width="2"/></g>
    </g>
  </g>

  <!-- ripples and drops where the pour lands -->
  <g data-p="splash" opacity="0">
    <ellipse class="rp" cx="400" cy="${SURFACE_Y}" rx="12" ry="3" fill="none" stroke="#5C3519" stroke-width="2.5"/>
    <ellipse class="rp" cx="400" cy="${SURFACE_Y}" rx="12" ry="3" fill="none" stroke="#5C3519" stroke-width="2"/>
    <ellipse cx="400" cy="${SURFACE_Y}" rx="14" ry="4.5" fill="#4A2814"/>
    <circle class="dp" cx="400" cy="${SURFACE_Y}" r="3.2" fill="#5C3519"/>
    <circle class="dp" cx="400" cy="${SURFACE_Y}" r="2.4" fill="#6E4122"/>
    <circle class="dp" cx="400" cy="${SURFACE_Y}" r="2.8" fill="#5C3519"/>
    <circle class="dp" cx="400" cy="${SURFACE_Y}" r="2" fill="#7A4A28"/>
  </g>

  <!-- the glass: body, thick base, rim and reflections -->
  <path d="${GLASS}" fill="${t.glassFill}" stroke="${t.glassStroke}" stroke-width="3"/>
  <path d="M316 934 L484 934" stroke="${t.glassEdge}" stroke-width="2"/>
  <path d="M313 936 L487 936 L486 946 Q485 950 478 950 L322 950 Q315 950 314 946 Z" fill="#fff" opacity=".28"/>
  <ellipse cx="400" cy="560" rx="110" ry="8" fill="none" stroke="${t.glassStroke}" stroke-width="2.5"/>
  <path d="M306 584 L322 918" stroke="url(#${p}glassShine)" stroke-width="10" stroke-linecap="round" opacity=".9"/>
  <path d="M330 590 L340 760" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"/>
  <path d="M494 600 L482 900" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/>
  <g data-p="drops" fill="rgba(255,255,255,.85)" opacity="0">
    <ellipse cx="470" cy="702" rx="2.6" ry="3.6"/><ellipse cx="458" cy="764" rx="2" ry="2.8"/><ellipse cx="476" cy="826" rx="2.4" ry="3.2"/>
    <ellipse cx="338" cy="842" rx="2" ry="2.8"/><ellipse cx="352" cy="700" rx="1.6" ry="2.2"/><ellipse cx="462" cy="880" rx="1.8" ry="2.4"/>
  </g>

  <!-- the stream (drawn from the nozzle down) and the first drop -->
  <path data-p="stream" d="M400 330" fill="url(#${p}streamG)" opacity="0"/>
  <path data-p="drop" d="M400 330 C 393 343, 391 352, 400 360 C 409 352, 407 343, 400 330 Z" fill="#4A2814" opacity="0"/>

  <!-- the Latte tube, drawn lying along +x with the nozzle at x=152 -->
  <g data-p="tube">
    <g data-p="tubeShape">
      <path d="M-156 -40 L-128 -35 L-128 35 L-156 40 Z" fill="url(#${p}seal)"/>
      <path d="M-151 -34 V34 M-145 -34 V34 M-139 -33 V33 M-133 -33 V33" stroke="#08201A" stroke-width="1.6" opacity=".7"/>
      <path d="M-130 -34 H86 Q108 -34 112 -18 L112 18 Q108 34 86 34 H-130 Z" fill="url(#${p}tubeBody)"/>
      <rect x="-122" y="-26" width="196" height="4" rx="2" fill="#fff" opacity=".2"/>
      <text x="-104" y="7" font-family="'Space Grotesk','Bricolage Grotesque',system-ui,sans-serif" font-weight="700" font-size="21" fill="#F4EFE6" letter-spacing=".5">COFFEE <tspan font-weight="800">@once</tspan><tspan font-size="11" dx="2" dy="-8">®</tspan><tspan font-size="15" font-weight="600" dx="5" dy="8">LATTE</tspan></text>
      <text x="-104" y="22" font-family="system-ui,sans-serif" font-size="6.5" font-weight="700" fill="#F4EFE6" opacity=".72" letter-spacing=".6">NITROGEN PRESERVATION &amp; NO ADDITIVE</text>
      <path d="M110 -24 L118 -27 L118 27 L110 24 Z" fill="#2A7F5E"/>
      <rect x="116" y="-28" width="38" height="56" rx="13" fill="url(#${p}capG)"/>
      <path d="M128 -27 V27 M137 -27 V27" stroke="#2E8A66" stroke-width="1.5" opacity=".55"/>
    </g>
  </g>
  </svg>`;
}

// Tube keyframes: [progress, x, y, rotation]
const TK = [
  [0, 600, 200, 28],
  [0.12, 470, 176, 74],
  [0.2, 400, 178, 90],
  [0.78, 400, 178, 90],
  [0.86, 600, 640, -60],
  [0.92, 640, 800, -93],
  [0.96, 640, 795, -89],
  [1, 640, 796, -90],
];
// Where each coffee cloud drifts to: [dx, dy, scale]
const BLOOM_TO = [
  [-34, 110, 1.35],
  [40, 170, 1.55],
  [-12, 240, 1.75],
  [28, 70, 1.15],
  [-46, 200, 1.4],
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const smooth = (p: number, e0: number, e1: number) => {
  const t = clamp((p - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function tubeAt(p: number) {
  for (let i = 1; i < TK.length; i++) {
    if (p <= TK[i][0]) {
      const A = TK[i - 1];
      const B = TK[i];
      const t = smooth(p, A[0], B[0]);
      return [lerp(A[1], B[1], t), lerp(A[2], B[2], t), lerp(A[3], B[3], t)];
    }
  }
  const L = TK[TK.length - 1];
  return [L[1], L[2], L[3]];
}

const NOZZLE_Y = 330; // the nozzle sits here while pouring (tube centre 178 + 152)

/** A tapered, gently wobbling liquid stream between two heights. */
function streamPath(top: number, bottom: number, p: number) {
  const n = 14;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const y = top + (bottom - top) * f;
    const fromNozzle = (y - NOZZLE_Y) / (SURFACE_Y - NOZZLE_Y);
    // widest at the nozzle, thinning as it falls, a touch wider where it lands
    const w = 16 - 6.5 * Math.min(1, fromNozzle * 1.6) + 3 * smooth(fromNozzle, 0.85, 1);
    const wob = Math.sin(p * 140 + fromNozzle * 9) * 1.6 * fromNozzle;
    left.push(`${(400 - w / 2 + wob).toFixed(1)} ${y.toFixed(1)}`);
    right.unshift(`${(400 + w / 2 + wob).toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M${left.join(' L')} L${right.join(' L')} Z`;
}

/** Returns draw(progress) for a scene rendered from pourSvg(). Only changed attributes are written. */
export function createPourDrawer(scope: ParentNode): (p: number) => void {
  const q = (name: string) => scope.querySelector<SVGElement>(`[data-p="${name}"]`)!;
  const S = {
    tube: q('tube'),
    shape: q('tubeShape'),
    tubeShadow: q('tubeShadow'),
    stream: q('stream'),
    drop: q('drop'),
    splash: q('splash'),
    ripples: [...scope.querySelectorAll<SVGElement>('[data-p="splash"] .rp')],
    droplets: [...scope.querySelectorAll<SVGElement>('[data-p="splash"] .dp')],
    tint: q('tint'),
    dive: q('dive'),
    blooms: [...scope.querySelectorAll<SVGElement>('[data-p="plume"] .bl')],
    foam: q('foam'),
    ice: q('ice'),
    drops: q('drops'),
  };
  const cache = new WeakMap<Element, Record<string, string>>();
  const set = (el: Element, name: string, val: string) => {
    let m = cache.get(el);
    if (!m) cache.set(el, (m = {}));
    if (m[name] !== val) {
      m[name] = val;
      el.setAttribute(name, val);
    }
  };

  return (p: number) => {
    // pouring: 0 before the stream starts, 1 while it runs, back to 0 once it stops
    const grow = smooth(p, 0.25, 0.32);
    const back = smooth(p, 0.66, 0.75);
    const pouring = grow * (1 - back);

    // the tube: tilts in, is pressed (thinner, with a small pulse) while pouring, then stands beside the glass
    const [x, y, r] = tubeAt(p);
    const press = smooth(p, 0.2, 0.3) * (1 - smooth(p, 0.72, 0.8));
    const sq = 1 - 0.12 * press + 0.025 * Math.sin(p * 90) * pouring;
    set(S.tube, 'transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(2)})`);
    set(S.shape, 'transform', `scale(${(1 - 0.03 * press).toFixed(3)} ${sq.toFixed(3)})`);
    set(S.tubeShadow, 'opacity', (smooth(p, 0.88, 0.95) * 0.22).toFixed(3));

    // the first drop forms at the nozzle and falls
    const dt = smooth(p, 0.15, 0.27);
    set(S.drop, 'opacity', p > 0.13 && p < 0.27 ? '1' : '0');
    set(S.drop, 'transform', `translate(0 ${(dt * (SURFACE_Y - 345)).toFixed(1)}) scale(1 ${(1 + dt * 0.4).toFixed(3)})`);

    // the stream: its bottom falls to the milk, then its top follows it down
    const top = NOZZLE_Y + back * (SURFACE_Y - NOZZLE_Y);
    const bottom = NOZZLE_Y + grow * (SURFACE_Y - NOZZLE_Y);
    const showStream = bottom - top > 1;
    set(S.stream, 'opacity', showStream ? '1' : '0');
    if (showStream) set(S.stream, 'd', streamPath(top, bottom, p));

    // ripples spread and drops jump where it lands
    set(S.splash, 'opacity', (smooth(p, 0.29, 0.33) * (1 - back)).toFixed(3));
    S.ripples.forEach((el, i) => {
      const phase = (p * 16 + i * 0.5) % 1;
      set(el, 'rx', (14 + phase * 46).toFixed(1));
      set(el, 'ry', (3.5 + phase * 9).toFixed(1));
      set(el, 'opacity', ((1 - phase) * 0.8).toFixed(3));
    });
    S.droplets.forEach((el, i) => {
      const phase = (p * 11 + i * 0.27) % 1;
      const dir = i % 2 ? 1 : -1;
      set(el, 'transform', `translate(${(dir * (10 + i * 6) * phase).toFixed(1)} ${(-Math.sin(phase * Math.PI) * (18 + i * 5)).toFixed(1)})`);
      set(el, 'opacity', (1 - phase * 0.6).toFixed(3));
    });

    // the coffee dives in, billows through the milk, swirls and blends into a latte
    const bloom = smooth(p, 0.29, 0.62);
    const mix = smooth(p, 0.58, 0.84);
    const depth = bloom * 230;
    set(S.dive, 'd', `M400 ${SURFACE_Y} C 404 ${(SURFACE_Y + depth * 0.4).toFixed(1)}, 380 ${(SURFACE_Y + depth * 0.7).toFixed(1)}, ${(392 + Math.sin(p * 20) * 8).toFixed(1)} ${(SURFACE_Y + depth).toFixed(1)}`);
    set(S.dive, 'opacity', (pouring * 0.85).toFixed(3));
    S.blooms.forEach((el, i) => {
      const [dx, dy, s] = BLOOM_TO[i];
      const ang = mix * (i % 2 ? -1 : 1) * (35 + i * 16);
      set(el, 'opacity', (bloom * (1 - mix * 0.95) * 0.85).toFixed(3));
      set(el, 'transform', `rotate(${ang.toFixed(1)} 400 780) translate(${(dx * bloom).toFixed(1)} ${(dy * bloom).toFixed(1)}) translate(400 ${SURFACE_Y + 10}) scale(${(0.15 + bloom * s).toFixed(3)}) translate(-400 -${SURFACE_Y + 10})`);
    });
    set(S.tint, 'opacity', smooth(p, 0.36, 0.86).toFixed(3));
    set(S.foam, 'opacity', smooth(p, 0.8, 0.92).toFixed(3));
    set(S.ice, 'transform', `translate(0 ${(Math.sin(p * 80) * 3.5 * pouring + smooth(p, 0.75, 0.9) * 4).toFixed(2)})`);
    set(S.drops, 'opacity', smooth(p, 0.86, 0.98).toFixed(3));
  };
}
