// "The Pour": the Latte tube tilts, presses and pours into a glass of milk, which
// blooms into an iced latte. Shared by the home page hero (light theme) and the
// Latte page (dark theme). Progress 0..1 drives every part; callers decide what
// drives progress (scroll, a timed play, or a fixed final frame).

export type PourTheme = 'light' | 'dark';

const THEMES = {
  dark: { halo: '#1F5C4A', haloOpacity: '.55', shadow: '#000', shadowOpacity: '.45', glassFill: 'rgba(233,217,192,.05)', glassStroke: 'rgba(233,217,192,.45)', milkTop: '#F4ECDF', milkBottom: '#DCCDB6' },
  // on the cream shop background the milk is whiter and the glow warmer, so the glass still reads
  light: { halo: '#B08A62', haloOpacity: '.5', shadow: '#8B7355', shadowOpacity: '.25', glassFill: 'rgba(255,255,255,.4)', glassStroke: 'rgba(139,115,85,.7)', milkTop: '#FFFFFF', milkBottom: '#EDE3D2' },
};

/** The scene's SVG markup. `p` prefixes gradient and clip ids so two scenes never clash. */
export function pourSvg(theme: PourTheme, p = '', viewBox = '0 0 800 1000'): string {
  const t = THEMES[theme];
  return `
  <svg viewBox="${viewBox}" aria-hidden="true" focusable="false">
  <defs>
  <radialGradient id="${p}halo" cx="50%" cy="62%" r="50%"><stop offset="0" stop-color="${t.halo}" stop-opacity="${t.haloOpacity}"/><stop offset="1" stop-color="${t.halo}" stop-opacity="0"/></radialGradient>
  <linearGradient id="${p}tubeBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E7A62"/><stop offset=".45" stop-color="#1F5C4A"/><stop offset="1" stop-color="#123A2F"/></linearGradient>
  <linearGradient id="${p}capG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9BEAC6"/><stop offset=".5" stop-color="#6FD3A8"/><stop offset="1" stop-color="#3FA57D"/></linearGradient>
  <linearGradient id="${p}milk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.milkTop}"/><stop offset="1" stop-color="${t.milkBottom}"/></linearGradient>
  <linearGradient id="${p}latte" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9A57E"/><stop offset=".5" stop-color="#A97D55"/><stop offset="1" stop-color="#8C6440"/></linearGradient>
  <linearGradient id="${p}streamG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3B2414"/><stop offset=".45" stop-color="#6B4428"/><stop offset="1" stop-color="#2E1C10"/></linearGradient>
  <clipPath id="${p}glassClip"><path d="M296 566 L504 566 L486 940 Q485 948 476 948 L324 948 Q315 948 314 940 Z"/></clipPath>
  <filter id="${p}soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>
  </defs>
  <ellipse cx="400" cy="640" rx="380" ry="330" fill="url(#${p}halo)"/>
  <ellipse cx="470" cy="958" rx="260" ry="20" fill="${t.shadow}" opacity="${t.shadowOpacity}"/>
  <!-- glass contents -->
  <g clip-path="url(#${p}glassClip)">
  <rect x="280" y="618" width="240" height="340" fill="url(#${p}milk)"/>
  <rect data-p="tint" x="280" y="618" width="240" height="340" fill="url(#${p}latte)" opacity="0"/>
  <g data-p="blooms" filter="url(#${p}soft)">
  <ellipse class="bl" cx="400" cy="630" rx="70" ry="44" fill="#5A3A22" opacity="0"/>
  <ellipse class="bl" cx="400" cy="630" rx="56" ry="38" fill="#6B4428" opacity="0"/>
  <ellipse class="bl" cx="400" cy="630" rx="64" ry="30" fill="#4A2E1A" opacity="0"/>
  <ellipse class="bl" cx="400" cy="630" rx="48" ry="40" fill="#7A5232" opacity="0"/>
  </g>
  <path data-p="swirl" d="M330 700 C 380 660, 440 740, 470 700 S 430 800, 360 780 S 340 860, 430 870" fill="none" stroke="#5A3A22" stroke-width="16" stroke-linecap="round" opacity="0" filter="url(#${p}soft)"/>
  <rect data-p="foam" x="280" y="616" width="240" height="22" fill="#EFE2CC" opacity="0"/>
  <g data-p="ice" fill="rgba(255,255,255,.22)" stroke="rgba(255,255,255,.55)" stroke-width="2">
  <rect x="318" y="600" width="58" height="52" rx="10" transform="rotate(-12 347 626)"/>
  <rect x="400" y="606" width="54" height="50" rx="10" transform="rotate(9 427 631)"/>
  <rect x="356" y="650" width="50" height="46" rx="9" transform="rotate(4 381 673)"/>
  </g>
  </g>
  <!-- splash where the pour lands -->
  <ellipse data-p="splash" cx="400" cy="622" rx="34" ry="7" fill="#6B4428" opacity="0"/>
  <!-- glass -->
  <path d="M296 566 L504 566 L486 940 Q485 948 476 948 L324 948 Q315 948 314 940 Z" fill="${t.glassFill}" stroke="${t.glassStroke}" stroke-width="3"/>
  <path d="M312 590 L326 900" stroke="rgba(255,255,255,.28)" stroke-width="6" stroke-linecap="round"/>
  <g data-p="drops" fill="rgba(255,255,255,.5)" opacity="0"><circle cx="470" cy="700" r="3"/><circle cx="462" cy="760" r="2.2"/><circle cx="476" cy="820" r="2.6"/><circle cx="336" cy="840" r="2"/></g>
  <!-- stream and first drop -->
  <rect data-p="stream" x="392" y="330" width="16" height="300" rx="8" fill="url(#${p}streamG)"/>
  <path data-p="drop" d="M400 330 C 392 344, 390 352, 400 360 C 410 352, 408 344, 400 330 Z" fill="#5A3A22" opacity="0"/>
  <!-- the tube: drawn lying along +x, nozzle at x=150 -->
  <g data-p="tube">
  <g data-p="tubeShape">
  <rect x="-152" y="-36" width="16" height="72" rx="3" fill="#123A2F"/>
  <path d="M-150 -30 h4 M-150 -18 h4 M-150 -6 h4 M-150 6 h4 M-150 18 h4 M-150 30 h4" stroke="#0C110F" stroke-width="2"/>
  <rect x="-138" y="-35" width="252" height="70" rx="26" fill="url(#${p}tubeBody)"/>
  <rect x="-130" y="-30" width="236" height="10" rx="5" fill="rgba(255,255,255,.12)"/>
  <text x="-104" y="7" font-family="DM Mono, monospace" font-size="15" fill="#E9D9C0" letter-spacing="1">COFFEE @once LATTE</text>
  <rect x="108" y="-30" width="44" height="60" rx="18" fill="url(#${p}capG)"/>
  </g>
  </g>
  </svg>`;
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
      return [lerp(A[1], B[1], t), lerp(A[2], B[2], t), lerp(A[3], B[3], t), lerp(A[4], B[4], t)];
    }
  }
  const L = TK[TK.length - 1];
  return [L[1], L[2], L[3], L[4]];
}

/** Returns draw(progress) for a scene rendered from pourSvg(). Only changed attributes are written. */
export function createPourDrawer(scope: ParentNode): (p: number) => void {
  const q = (name: string) => scope.querySelector<SVGElement>(`[data-p="${name}"]`)!;
  const S = {
    tube: q('tube'),
    shape: q('tubeShape'),
    stream: q('stream'),
    drop: q('drop'),
    splash: q('splash'),
    tint: q('tint'),
    blooms: [...scope.querySelectorAll<SVGElement>('[data-p="blooms"] .bl')],
    swirl: q('swirl'),
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
    const [x, y, r, sq] = tubeAt(p);
    set(S.tube, 'transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(2)})`);
    set(S.shape, 'transform', `scale(1 ${sq.toFixed(3)})`);
    // the first drop falls
    set(S.drop, 'opacity', p > 0.12 && p < 0.27 ? '1' : '0');
    set(S.drop, 'transform', `translate(0 ${(smooth(p, 0.13, 0.27) * 270).toFixed(1)})`);
    // the stream grows, holds, then retracts downward
    const grow = smooth(p, 0.25, 0.31);
    const back = smooth(p, 0.66, 0.74);
    const sy = Math.max(0.0001, grow * (1 - back));
    set(S.stream, 'transform', `translate(0 ${(back * 300).toFixed(1)}) translate(400 330) scale(1 ${sy.toFixed(4)}) translate(-400 -330)`);
    set(S.stream, 'opacity', grow > 0 && back < 1 ? '1' : '0');
    // the splash pulses while pouring
    const pouring = grow * (1 - back);
    const wob = 1 + Math.sin(p * 160) * 0.12;
    set(S.splash, 'opacity', (pouring * 0.85).toFixed(3));
    set(S.splash, 'transform', `translate(400 622) scale(${(wob * (0.6 + pouring * 0.5)).toFixed(3)} 1) translate(-400 -622)`);
    // coffee blooms through the milk, then swirls and blends
    const bloom = smooth(p, 0.3, 0.6);
    const mix = smooth(p, 0.56, 0.8);
    S.blooms.forEach((el, i) => {
      const [dx, dy, s] = BLOOM_TO[i];
      const ang = mix * (i % 2 ? -1 : 1) * (40 + i * 18);
      set(el, 'opacity', (bloom * (1 - mix * 0.85) * 0.95).toFixed(3));
      set(el, 'transform', `rotate(${ang.toFixed(1)} 400 780) translate(${(dx * bloom).toFixed(1)} ${(dy * bloom).toFixed(1)}) translate(400 630) scale(${(0.2 + bloom * s).toFixed(3)}) translate(-400 -630)`);
    });
    set(S.swirl, 'opacity', (smooth(p, 0.52, 0.62) * (1 - smooth(p, 0.74, 0.84)) * 0.8).toFixed(3));
    set(S.swirl, 'transform', `rotate(${(mix * 50).toFixed(1)} 400 780)`);
    set(S.tint, 'opacity', (smooth(p, 0.32, 0.82) * 0.96).toFixed(3));
    set(S.foam, 'opacity', smooth(p, 0.78, 0.9).toFixed(3));
    set(S.ice, 'transform', `translate(0 ${(Math.sin(p * 90) * 3 * pouring).toFixed(2)})`);
    set(S.drops, 'opacity', smooth(p, 0.86, 0.98).toFixed(3));
  };
}
