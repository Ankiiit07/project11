// Markup for the Latte page (/latte). Kept as one HTML string so the hand-built
// SVG scene stays exactly as designed; scene.ts brings it to life.
import type { Product } from '../../data/products';
import { cld } from '../../utils/cloudinary';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface LatteOffer {
  product: Product;
  label: string;
  tubes: number;
  best?: boolean;
}

const offerCard = ({ product, label, tubes, best }: LatteOffer) => `
          <div class="offer${best ? ' best' : ''}">
            ${best ? '<span class="tag">Best value</span>' : ''}
            <span class="lbl">${label}</span>
            <div class="price">₹${product.price} <s>₹${product.originalPrice}</s></div>
            <span class="per">₹${Math.round(product.price / tubes)} per tube</span>
            <span class="per"><b>Save ₹${product.originalPrice - product.price}</b></span>
            <button class="btn" type="button" data-add="${esc(product.id)}" aria-label="Add ${label.toLowerCase()} to cart">Add to cart</button>
            <a class="details" href="/products/${encodeURIComponent(product.id)}" data-route>Details</a>
          </div>`;

const exploreCard = (p: Product) => `
      <a class="pcard" href="/products/${encodeURIComponent(p.id)}" data-route>
        <span class="pimg"><img src="${esc(cld(p.image, 400))}" alt="${esc(p.name)}" loading="lazy" width="400" height="400"></span>
        <span class="pcat">${esc(p.isPreOrder ? 'Pre-order' : p.category.replace('-', ' '))}</span>
        <span class="pname">${esc(p.name)}</span>
        <span class="pprice">₹${p.price}${p.originalPrice > p.price ? ` <s>₹${p.originalPrice}</s>` : ''}</span>
      </a>`;

export const latteMarkup = (offers: LatteOffer[], others: Product[]): string => {
  const year = new Date().getFullYear();
  const offersHtml = offers.map(offerCard).join('');
  const exploreHtml = others.map(exploreCard).join('');
  return `
<div class="env" aria-hidden="true"></div>
<div class="grain" aria-hidden="true"></div>
<div class="dust" aria-hidden="true" id="dust"></div>

<nav aria-label="Main">
  <a class="brand" href="/" data-route aria-label="Cafe at Once shop home">
    <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 24h28v14a12 12 0 0 1-12 12h-4a12 12 0 0 1-12-12z" fill="none" stroke="#6FD3A8" stroke-width="4"/><path d="M42 28h4a6 6 0 0 1 0 12h-4" fill="none" stroke="#6FD3A8" stroke-width="4"/><path d="M22 12v6M28 12v6M34 12v6" stroke="#6FD3A8" stroke-width="3" stroke-linecap="round"/></svg>
    Cafe at Once
  </a>
  <ul class="navlinks">
    <li><a href="#how">How it works</a></li>
    <li><a href="#taste">Taste</a></li>
    <li><a href="#sale">Latte Sale</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ul>
  <div class="navright">
    <a class="cartlink" href="/cart" data-route aria-label="Cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg><span class="count" data-cart-count hidden>0</span></a>
    <a class="btn small" href="#sale">Shop the Latte Sale</a>
  </div>
</nav>

<div id="top">
  <section id="hero" aria-label="Cafe at Once, the pour">
    <div class="stage">
      <div class="scene" aria-hidden="true">
        <svg id="scene" viewBox="0 0 800 1000" role="presentation">
          <defs>
            <radialGradient id="halo" cx="50%" cy="62%" r="50%"><stop offset="0" stop-color="#1F5C4A" stop-opacity=".55"/><stop offset="1" stop-color="#1F5C4A" stop-opacity="0"/></radialGradient>
            <linearGradient id="tubeBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E7A62"/><stop offset=".45" stop-color="#1F5C4A"/><stop offset="1" stop-color="#123A2F"/></linearGradient>
            <linearGradient id="capG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9BEAC6"/><stop offset=".5" stop-color="#6FD3A8"/><stop offset="1" stop-color="#3FA57D"/></linearGradient>
            <linearGradient id="milk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4ECDF"/><stop offset="1" stop-color="#DCCDB6"/></linearGradient>
            <linearGradient id="latte" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9A57E"/><stop offset=".5" stop-color="#A97D55"/><stop offset="1" stop-color="#8C6440"/></linearGradient>
            <linearGradient id="streamG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3B2414"/><stop offset=".45" stop-color="#6B4428"/><stop offset="1" stop-color="#2E1C10"/></linearGradient>
            <clipPath id="glassClip"><path d="M296 566 L504 566 L486 940 Q485 948 476 948 L324 948 Q315 948 314 940 Z"/></clipPath>
            <filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>
          </defs>
          <ellipse cx="400" cy="640" rx="380" ry="330" fill="url(#halo)"/>
          <ellipse cx="470" cy="958" rx="260" ry="20" fill="#000" opacity=".45"/>
          <!-- glass contents -->
          <g clip-path="url(#glassClip)">
            <rect x="280" y="618" width="240" height="340" fill="url(#milk)"/>
            <rect id="tint" x="280" y="618" width="240" height="340" fill="url(#latte)" opacity="0"/>
            <g id="blooms" filter="url(#soft)">
              <ellipse class="bl" cx="400" cy="630" rx="70" ry="44" fill="#5A3A22" opacity="0"/>
              <ellipse class="bl" cx="400" cy="630" rx="56" ry="38" fill="#6B4428" opacity="0"/>
              <ellipse class="bl" cx="400" cy="630" rx="64" ry="30" fill="#4A2E1A" opacity="0"/>
              <ellipse class="bl" cx="400" cy="630" rx="48" ry="40" fill="#7A5232" opacity="0"/>
            </g>
            <path id="swirl" d="M330 700 C 380 660, 440 740, 470 700 S 430 800, 360 780 S 340 860, 430 870" fill="none" stroke="#5A3A22" stroke-width="16" stroke-linecap="round" opacity="0" filter="url(#soft)"/>
            <rect id="foam" x="280" y="616" width="240" height="22" fill="#EFE2CC" opacity="0"/>
            <g id="ice" fill="rgba(255,255,255,.22)" stroke="rgba(255,255,255,.55)" stroke-width="2">
              <rect x="318" y="600" width="58" height="52" rx="10" transform="rotate(-12 347 626)"/>
              <rect x="400" y="606" width="54" height="50" rx="10" transform="rotate(9 427 631)"/>
              <rect x="356" y="650" width="50" height="46" rx="9" transform="rotate(4 381 673)"/>
            </g>
          </g>
          <!-- splash where the pour lands -->
          <ellipse id="splash" cx="400" cy="622" rx="34" ry="7" fill="#6B4428" opacity="0"/>
          <!-- glass -->
          <path d="M296 566 L504 566 L486 940 Q485 948 476 948 L324 948 Q315 948 314 940 Z" fill="rgba(233,217,192,.05)" stroke="rgba(233,217,192,.45)" stroke-width="3"/>
          <path d="M312 590 L326 900" stroke="rgba(255,255,255,.28)" stroke-width="6" stroke-linecap="round"/>
          <g id="drops" fill="rgba(255,255,255,.5)" opacity="0"><circle cx="470" cy="700" r="3"/><circle cx="462" cy="760" r="2.2"/><circle cx="476" cy="820" r="2.6"/><circle cx="336" cy="840" r="2"/></g>
          <!-- stream and first drop -->
          <rect id="stream" x="392" y="330" width="16" height="300" rx="8" fill="url(#streamG)"/>
          <path id="drop" d="M400 330 C 392 344, 390 352, 400 360 C 410 352, 408 344, 400 330 Z" fill="#5A3A22" opacity="0"/>
          <!-- the tube: drawn lying along +x, nozzle at x=150 -->
          <g id="tube">
            <g id="tubeShape">
              <rect x="-152" y="-36" width="16" height="72" rx="3" fill="#123A2F"/>
              <path d="M-150 -30 h4 M-150 -18 h4 M-150 -6 h4 M-150 6 h4 M-150 18 h4 M-150 30 h4" stroke="#0C110F" stroke-width="2"/>
              <rect x="-138" y="-35" width="252" height="70" rx="26" fill="url(#tubeBody)"/>
              <rect x="-130" y="-30" width="236" height="10" rx="5" fill="rgba(255,255,255,.12)"/>
              <text x="-104" y="7" font-family="DM Mono, monospace" font-size="15" fill="#E9D9C0" letter-spacing="1">COFFEE @once LATTE</text>
              <rect x="108" y="-30" width="44" height="60" rx="18" fill="url(#capG)"/>
            </g>
          </g>
        </svg>
      </div>

      <div class="bands">
        <div class="band" data-a="0" data-b="0.24" data-fx="rise">
          <span class="mono kicker">Brewed Arabica latte, in a press tube</span>
          <h1><span class="line split">Real coffee.</span><span class="line split mint">In your pocket.</span></h1>
        </div>
        <div class="band" data-a="0.28" data-b="0.52" data-fx="drift">
          <h2><span class="line split">One press.</span><span class="line split mint">That's the whole recipe.</span></h2>
        </div>
        <div class="band" data-a="0.56" data-b="0.78" data-fx="scatter" data-spread="0.55">
          <h2><span class="line split">100% Arabica.</span><span class="line split">Sealed with nitrogen.</span><span class="line split mint">Nothing added.</span></h2>
        </div>
        <div class="band" data-a="0.82" data-b="1" data-fx="rise" data-ramp="0.06">
          <h2><span class="line split">Better than the</span><span class="line split mint">hotel sachet.</span></h2>
          <p class="sub">Barista-style latte in 5 seconds. No machine, no fridge.</p>
          <div class="cta"><a class="btn" href="#sale">Shop the Latte Sale <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>
        </div>
      </div>
      <div class="scrollcue mono" id="cue" aria-hidden="true">Scroll to pour<span></span></div>
    </div>
  </section>
</div>

<div id="lp-main">
  <div class="pourline" id="pourline" aria-hidden="true"><i></i><b></b></div>

  <section class="block reveal" id="problem" aria-labelledby="problem-h">
    <div class="problem">
      <div>
        <span class="mono kicker rv">The hotel room problem</span>
        <h2 class="big rv" id="problem-h" style="--i:1">Sachets taste burnt. Your Aeropress stayed home.</h2>
      </div>
      <div>
        <p class="lede rv" style="--i:2">Most travel coffee is bitter powder or a kit you have to carry. We brewed the coffee first, sealed it in a tube, and left the gear behind.</p>
        <ul class="pains">
          <li class="rv" style="--i:3"><span class="x"></span><b>Bitter hotel sachet</b><span class="strike" style="--i:0"></span></li>
          <li class="rv" style="--i:4"><span class="x"></span><b>The brewer you forgot to pack</b><span class="strike" style="--i:1"></span></li>
          <li class="rv" style="--i:5"><span class="x"></span><b>No kettle in the room</b><span class="strike" style="--i:2"></span></li>
        </ul>
        <p class="answer rv" style="--i:6">One tube. One press. <span class="mint">Real coffee.</span></p>
      </div>
    </div>
  </section>

  <section class="block reveal" id="how" aria-labelledby="how-h">
    <span class="mono kicker rv">How it works</span>
    <h2 class="big rv" id="how-h" style="--i:1">Three moves. <span class="mint">Five seconds.</span></h2>
    <div class="steps">
      <article class="step rv" style="--i:2">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <g class="bob"><rect x="40" y="88" width="104" height="30" rx="12" fill="#1F5C4A"/><rect x="34" y="86" width="10" height="34" rx="2" fill="#123A2F"/></g>
          <g class="bob" style="animation-delay:-2.4s"><rect x="150" y="70" width="22" height="30" rx="9" fill="#6FD3A8" transform="rotate(-24 161 85)"/></g>
          <path class="draw" style="--len:90;--i:0" d="M150 118 C 172 118, 184 100, 176 74" fill="none" stroke="#6FD3A8" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="4 6"/>
        </svg>
        <div class="st"><span class="num">01</span><h3>Peel</h3><p>Open the tube.</p></div>
      </article>
      <article class="step rv" style="--i:3">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <g transform="rotate(90 100 50)"><rect x="52" y="34" width="92" height="30" rx="12" fill="#1F5C4A"/><rect x="140" y="36" width="18" height="26" rx="8" fill="#6FD3A8"/></g>
          <path d="M86 40 l-8 -8 M114 40 l8 -8" stroke="#E9D9C0" stroke-width="2.5" stroke-linecap="round"/>
          <path class="draw" style="--len:60;--i:1" d="M100 112 V 150" stroke="#6B4428" stroke-width="7" stroke-linecap="round"/>
          <path d="M66 140 L134 140 L128 190 L72 190 Z" fill="rgba(244,236,223,.9)" stroke="rgba(233,217,192,.6)" stroke-width="2"/>
        </svg>
        <div class="st"><span class="num">02</span><h3>Press</h3><p>Squeeze it into 150 to 300 ml of milk or water, hot or cold.</p></div>
      </article>
      <article class="step rv" style="--i:4">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <path class="steam" d="M84 66 C 76 54, 92 46, 84 32" fill="none" stroke="#E9D9C0" stroke-width="2.5" stroke-linecap="round"/>
          <path class="steam" style="animation-delay:-3.6s" d="M110 64 C 102 50, 118 44, 110 28" fill="none" stroke="#E9D9C0" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M58 84 L142 84 L134 176 L66 176 Z" fill="#A97D55" stroke="rgba(233,217,192,.6)" stroke-width="2"/>
          <rect x="58" y="84" width="84" height="12" fill="#EFE2CC"/>
          <path class="draw" style="--len:160;--i:2" d="M76 120 C 100 100, 124 140, 100 150 S 80 130, 104 124" fill="none" stroke="#5A3A22" stroke-width="4" stroke-linecap="round"/>
          <path d="M120 40 L104 126" stroke="#B9B2A4" stroke-width="5" stroke-linecap="round"/>
        </svg>
        <div class="st"><span class="num">03</span><h3>Stir</h3><p>That's it. Your latte is ready.</p></div>
      </article>
    </div>
  </section>

  <section class="block reveal" id="try" aria-labelledby="try-h">
    <div class="press" id="press">
      <div class="pressviz rv">
        <svg viewBox="0 0 400 500" aria-hidden="true">
          <defs><clipPath id="pg"><path d="M120 250 L280 250 L266 470 L134 470 Z"/></clipPath></defs>
          <rect x="164" y="40" width="72" height="150" rx="24" fill="#1F5C4A"/>
          <rect x="178" y="186" width="44" height="30" rx="12" fill="#6FD3A8"/>
          <rect id="pStream" x="194" y="214" width="12" height="40" rx="6" fill="#5A3A22" style="transform-origin:200px 214px;transform:scaleY(0)"/>
          <g clip-path="url(#pg)">
            <rect x="110" y="250" width="180" height="230" fill="#F4ECDF"/>
            <rect id="pFill" x="110" y="250" width="180" height="230" fill="url(#latte)" style="transform-origin:200px 470px;transform:scaleY(0)"/>
          </g>
          <path d="M120 250 L280 250 L266 470 L134 470 Z" fill="none" stroke="rgba(233,217,192,.5)" stroke-width="3"/>
          <path d="M134 266 L144 450" stroke="rgba(255,255,255,.35)" stroke-width="5" stroke-linecap="round"/>
        </svg>
      </div>
      <div>
        <span class="mono kicker rv">The one move</span>
        <h2 class="big rv" id="try-h" style="--i:1">Try it. <span class="mint">Press and hold.</span></h2>
        <p class="lede rv" style="--i:2">This is the whole recipe. Hold the button and pour your latte.</p>
        <button class="btn holdbtn rv" style="--i:3" id="hold" type="button" aria-describedby="hold-status"><i class="fill" aria-hidden="true"></i><span>Press and hold to pour</span></button>
        <p class="done-copy" id="hold-status" aria-live="polite">Five seconds. That's your latte.</p>
        <p class="after">No machine. No kettle. Just a press.</p>
      </div>
    </div>
  </section>

  <section class="block reveal" id="taste" aria-labelledby="taste-h">
    <span class="mono kicker rv">Why it tastes real</span>
    <h2 class="big rv" id="taste-h" style="--i:1">Brewed first. <span class="mint">Sealed second.</span></h2>
    <div class="facts">
      <div class="fact rv" style="--i:2"><div class="n"><span class="count" data-to="100">100</span><small>%</small></div><p>Arabica coffee. Not powder.</p></div>
      <div class="fact rv" style="--i:3"><div class="n"><span class="count" data-to="0">0</span><small>g</small></div><p>Sugar. Sweeten it yourself if you like.</p></div>
      <div class="fact rv" style="--i:4"><div class="n"><span class="count" data-to="12">12</span><small>mo</small></div><p>On the shelf. No fridge needed.</p></div>
      <div class="fact rv" style="--i:5"><div class="n"><span class="count" data-to="16">16</span><small>g</small></div><p>Per tube. One to two cups.</p></div>
    </div>
    <p class="facts-note rv" style="--i:6">Small enough for your carry-on. Nitrogen keeps it fresh until you press.</p>
  </section>

  <section class="block reveal" id="sale" aria-labelledby="sale-h">
    <div class="sale rv">
      <div class="photo"><img src="/campaign/latte-sale-800.webp" srcset="/campaign/latte-sale-800.webp 800w, /campaign/latte-sale-1200.webp 1200w" sizes="(min-width:960px) 45vw, 100vw" alt="Cafe at Once Latte tubes and 6-pack boxes on roasted coffee beans" loading="lazy" width="800" height="1200"></div>
      <div class="copy">
        <span class="mono kicker">Latte Sale · Limited time</span>
        <h2 class="big" id="sale-h">Stock up on <span class="mint">Latte.</span></h2>
        <p class="lede" style="margin-top:16px">The more you take, the less each cup costs.</p>
        <div class="offers">${offersHtml}</div>
      </div>
    </div>
  </section>

  <section class="block reveal" id="explore" aria-labelledby="explore-h">
    <div class="explore-head">
      <div>
        <span class="mono kicker rv">More from Cafe at Once</span>
        <h2 class="big rv" id="explore-h" style="--i:1">Not a latte person? <span class="mint">Press something else.</span></h2>
      </div>
      <a class="btn ghost rv" style="--i:2" href="/products" data-route>See all coffee</a>
    </div>
    <div class="explore rv" style="--i:3">${exploreHtml}</div>
  </section>

  <section class="block reveal" id="faq" aria-labelledby="faq-h">
    <div class="faq">
      <div>
        <span class="mono kicker rv">Questions</span>
        <h2 class="big rv" id="faq-h" style="--i:1">Before you <span class="mint">press.</span></h2>
      </div>
      <div class="rv" style="--i:2">
        <div class="qa"><button type="button" aria-expanded="false">Does it taste like real coffee?<span class="plus" aria-hidden="true"></span></button><div class="a" role="region"><div><p>Yes. It's brewed Arabica, not powder. Press it into milk and it tastes like a café latte.</p></div></div></div>
        <div class="qa"><button type="button" aria-expanded="false">Is there sugar in it?<span class="plus" aria-hidden="true"></span></button><div class="a" role="region"><div><p>No. Zero sugar and no additives. Sweeten it yourself if you like.</p></div></div></div>
        <div class="qa"><button type="button" aria-expanded="false">Do I need a fridge?<span class="plus" aria-hidden="true"></span></button><div class="a" role="region"><div><p>No. Each tube is nitrogen-sealed and keeps for 12 months at room temperature.</p></div></div></div>
        <div class="qa"><button type="button" aria-expanded="false">Can I take it on a flight?<span class="plus" aria-hidden="true"></span></button><div class="a" role="region"><div><p>Yes. A 16 g tube sits well under carry-on liquid limits.</p></div></div></div>
        <div class="qa"><button type="button" aria-expanded="false">How many cups is one tube?<span class="plus" aria-hidden="true"></span></button><div class="a" role="region"><div><p>One to two, depending on how strong you like it.</p></div></div></div>
      </div>
    </div>
  </section>

  <section class="block reveal final" id="final" aria-labelledby="final-h">
    <h2 class="big rv" id="final-h">Your next good coffee <span class="mint">fits in your bag.</span></h2>
    <div class="btnwrap rv" style="--i:1">
      <span class="drop" aria-hidden="true"></span>
      <span class="ripple" aria-hidden="true"></span>
      <a class="btn" id="finalcta" href="#sale">Shop the Latte Sale <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    </div>
  </section>
</div>

<footer>
  <div class="about">
    <a class="brand" href="/" data-route>Cafe at Once</a>
    <p style="margin-top:12px;max-width:36ch">Real brewed Arabica in a press tube. Made for travel, office days and hotel rooms.</p>
  </div>
  <div>
    <h3>Shop</h3>
    <ul>
      <li><a href="/products" data-route>All coffee</a></li>
      <li><a href="/shipping-policy" data-route>Shipping</a></li>
      <li><a href="/return-policy" data-route>Returns</a></li>
    </ul>
  </div>
  <div>
    <h3>Talk to us</h3>
    <ul>
      <li><a href="mailto:cafeatonce@gmail.com">cafeatonce@gmail.com</a></li>
      <li><a href="tel:+917979837079">+91 7979837079</a></li>
      <li>Mumbai, India</li>
    </ul>
  </div>
  <p class="legal">© ${year} Cafe at Once.</p>
</footer>
`;
};
