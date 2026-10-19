import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '../components/icons';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useFeaturedProducts } from '../hooks/useProducts';
import PageWrapper from '../components/PageWrapper';
import SEO from '../components/SEO';
import { CountUp, Reveal, Stagger, StaggerItem } from '../components/motion';
import { Glitch, KineticHeading, KineticMarquee, KineticWord } from '../components/kinetic';
import { SameDayStrip } from '../components/SameDayBengaluru';
import CampaignBanner from '../components/CampaignBanner';
import { gsap, useGSAP } from '../lib/gsap';
import { createSeeker, loadVideoBlob, pickVideoSource } from '../utils/scrubVideo';
import { cld, cldSrcSet, cldVideo, cldVideoPoster } from '../utils/cloudinary';

const INSIGHTS_VIDEO =
  'https://res.cloudinary.com/dtcsms7zn/video/upload/v1751395895/526c3573288b46a0a85fec27d8630925.HD-1080p-7.2Mbps-15882571_1_lxeljd.mp4';

const STEPS = [
  {
    step: '01',
    title: 'Peel',
    description: 'Twist the cap off the tube.',
    image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751552822/Frame_26_3_bmmwov.png',
  },
  {
    step: '02',
    title: 'Press',
    description: 'Squeeze it into 150 to 300 ml of water or milk, hot or cold.',
    image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751552685/Frame_25_3_zjsnuy.png',
  },
  {
    step: '03',
    title: 'Stir',
    description: 'Stir once. That is the whole recipe.',
    image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751551122/Frame_27_1_ntpnxq.png',
  },
];

const REASONS = [
  { title: '5 seconds', description: 'No machine, no kettle, no fridge. Press and drink.' },
  { title: 'Nothing added', description: 'Brewed Arabica coffee. No sugar, no preservatives.' },
  { title: '12 months', description: 'Sealed with nitrogen, so it keeps on the shelf.' },
  { title: 'Carry-on friendly', description: 'A 16 g tube sits well under flight liquid limits.' },
];

const FACTS = ['Zero sugar', 'Zero additives', '100% Arabica', 'Carry-on friendly'];

const READS = [
  { to: '/blog/how-to-make-coffee-without-machine', label: 'How to make coffee without a machine' },
  { to: '/blog/instant-vs-brewed-coffee-difference', label: 'Instant vs brewed: what actually changes' },
  { to: '/blog/why-arabica-coffee-matters', label: 'Why Arabica matters' },
  { to: '/blog/best-portable-coffee-travellers-india', label: 'Portable coffee for travellers' },
];

// On phones these rows scroll sideways (with the next card peeking in);
// from `md`/`sm` up they become a normal grid.
const SWIPE_ROW = 'flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 -mx-4 px-4 pb-2';

const HomePage: React.FC = () => {
  const { products: featuredProducts } = useFeaturedProducts();
  const pageRef = useRef<HTMLDivElement>(null);
  const pourVideoRef = useRef<HTMLVideoElement>(null);
  const pourStillRef = useRef<HTMLImageElement>(null);

  // Scroll-linked GSAP effects: the real hero pour (filmed) scrubs with scroll on desktop and
  // plays by itself on phones, the hero headline widens into place on load, the sale photo
  // drifts inside its frame and the insights video eases up to full size.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const video = pourVideoRef.current!;
      const still = pourStillRef.current!;
      // Show the real video once a frame is ready; until then (or if it fails) the still stays
      const reveal = () => gsap.to(video, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
      const reset = (stillSrc: string) => {
        video.pause();
        video.removeAttribute('src');
        video.load();
        gsap.set(video, { autoAlpha: 0 });
        still.src = stillSrc;
      };

      // Desktop: the hero holds for about 1.5 screens of scrolling while the pour scrubs with it
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const hero = document.querySelector<HTMLElement>('[data-hero]')!;
        const seek = createSeeker(video);
        const pour = { p: 0 };
        const ctrl = new AbortController();
        reset('/hero/pour-first.webp');
        loadVideoBlob(video, pickVideoSource(video, '/hero/pour-720'), ctrl.signal)
          .then(() => {
            seek(pour.p);
            reveal();
          })
          .catch(() => {});
        gsap.to(pour, {
          p: 1,
          ease: 'none',
          onUpdate: () => seek(pour.p),
          scrollTrigger: {
            trigger: hero,
            // below the 80px fixed header; a hero taller than the screen pins once its bottom is in view
            start: () => (hero.offsetHeight > innerHeight - 80 ? 'bottom bottom' : 'top 80px'),
            end: '+=150%',
            pin: true,
            scrub: 0.6,
            refreshPriority: 2, // the topmost pin measures first
            invalidateOnRefresh: true,
          },
        });
        gsap.to('[data-pour-cue]', { autoAlpha: 0, scrollTrigger: { trigger: hero, start: 'top 80px', end: '+=120', scrub: true } });
        return () => ctrl.abort();
      });
      // Phones and tablets: the page scrolls normally and the pour plays once, a little slowed
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const ctrl = new AbortController();
        reset('/hero/pour-first.webp');
        loadVideoBlob(video, pickVideoSource(video, '/hero/pour-480'), ctrl.signal)
          .then(() => {
            video.playbackRate = 0.6;
            reveal();
            return video.play();
          })
          // autoplay refused (e.g. low-power mode): show the finished glass instead
          .catch(() => {
            if (!ctrl.signal.aborted) still.src = '/hero/pour-last.webp';
          });
        return () => ctrl.abort();
      });
      // Reduced motion: the finished glass, no video downloaded
      mm.add('(prefers-reduced-motion: reduce)', () => reset('/hero/pour-last.webp'));

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Kinetic headline: each line widens from condensed to full width as the page opens.
        // Width only, so the text served in the page's HTML never blinks out while this runs.
        gsap.fromTo(
          '[data-k-line]',
          { '--wdth': 75 },
          { '--wdth': 100, duration: 1.1, stagger: 0.18, ease: 'expo.out', delay: 0.1 }
        );
        // The sale photo drifts slightly inside its frame
        gsap.fromTo(
          '[data-campaign-img]',
          { yPercent: -5 },
          { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '[data-campaign]', start: 'top bottom', end: 'bottom top', scrub: true } }
        );
        gsap.fromTo(
          '[data-insights-video]',
          { scale: 0.88 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-insights-video]', start: 'top bottom', end: 'center center', scrub: true },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: pageRef }
  );

  return (
    <div ref={pageRef}>
    <PageWrapper padding="none">
      <SEO
        title="Cafe at Once | Nitrogen-Preserved Arabica Coffee in a Press Tube | India"
        description="India's first nitrogen-preserved brewed Arabica coffee. Real coffee in 5 seconds: no machine, no fridge, no compromise. Just press and go."
        url="https://cafeatonce.com"
        breadcrumbs={[{ name: 'Home', url: 'https://cafeatonce.com' }]}
        howTo={{
          name: 'How to Use Cafe at Once Press Tube',
          description: 'Make premium brewed coffee anywhere in 5 seconds.',
          totalTime: 'PT5S',
          steps: [
            { name: 'Remove cap', text: 'Peel off the protective cap from the Cafe at Once tube' },
            { name: 'Position over cup', text: 'Hold the tube over your cup or mug' },
            { name: 'Press the tube', text: 'Press firmly to dispense the coffee concentrate' },
            { name: 'Add water and enjoy', text: 'Add 300ml of hot, cold, or room temperature water. Stir and drink.' },
          ],
        }}
      />

      <SameDayStrip />

      {/* Hero */}
      <section
        data-hero
        className="relative bg-background overflow-hidden lg:min-h-[85vh] flex items-center"
      >
        {/* Phones: headline, then the product, then the details. Desktop: text left, product right. */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 lg:py-16 grid lg:grid-cols-2 gap-x-12 gap-y-6 items-center">
          <div className="space-y-4 lg:col-start-1">
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-foreground/70">
              India's first nitrogen-preserved coffee
            </p>

            <h1
              className="font-heading text-5xl sm:text-7xl lg:text-[4.75rem] font-extrabold uppercase text-foreground leading-[0.9] tracking-[-0.02em]"
              style={{ fontVariationSettings: "'wdth' var(--wdth, 100)" }}
            >
              <span data-k-line className="block" style={{ fontVariationSettings: "'wdth' var(--wdth, 100)" }}>
                Real coffee.
              </span>
              <span data-k-line className="block text-primary" style={{ fontVariationSettings: "'wdth' var(--wdth, 100)" }}>
                No machine.
              </span>
              <span data-k-line className="block text-primary" style={{ fontVariationSettings: "'wdth' var(--wdth, 100)" }}>
                <Glitch text="No compromise." onLoadAfter={1.4} repeat />
              </span>
            </h1>
          </div>

          {/* The pour: real footage of a tube pressed into water (decorative; the copy carries the message) */}
          <motion.div
            className="relative flex flex-col items-center lg:col-start-2 lg:row-start-1 lg:row-span-2"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative h-[46vh] sm:h-[52vh] lg:h-[min(70vh,660px)] aspect-[720/1134] max-w-full overflow-hidden bg-secondary border border-foreground">
              <img
                ref={pourStillRef}
                src="/hero/pour-first.webp"
                alt=""
                aria-hidden="true"
                width={720}
                height={1134}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <video
                ref={pourVideoRef}
                muted
                playsInline
                preload="none"
                aria-hidden="true"
                tabIndex={-1}
                className="absolute inset-0 w-full h-full object-cover opacity-0 invisible [transform:translateZ(0)]"
              />
              <span className="absolute left-0 bottom-0 px-3 py-2 bg-foreground text-background font-mono text-[10px] sm:text-xs uppercase tracking-[0.14em]">
                Real pour · Americano<span className="hidden sm:inline">, pressed into water</span>
              </span>
            </div>
            <div data-pour-cue className="hidden lg:block mt-3 font-mono text-xs uppercase tracking-[0.2em] text-foreground/60" aria-hidden="true">
              Scroll to pour
            </div>
          </motion.div>

          <motion.div
            className="space-y-6 lg:col-start-1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="space-y-3">
              <p className="text-base sm:text-xl text-foreground/80 leading-relaxed max-w-xl">
                India's first{' '}
                <Link to="/blog/what-is-nitrogen-preserved-coffee" className="text-primary hover:underline">
                  nitrogen-preserved brewed Arabica coffee
                </Link>{' '}
                in a press tube. Squeeze it into water or milk and it is ready in 5 seconds. No machine, no fridge, nothing added.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground hover:bg-primary text-background font-heading font-bold uppercase tracking-wide"
                data-testid="hero-shop-now"
              >
                Shop the coffee
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 border border-foreground text-foreground hover:bg-foreground hover:text-background font-heading font-bold uppercase tracking-wide"
                data-testid="hero-learn-more"
              >
                How it works
              </a>
            </div>

            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-foreground/70">
              {FACTS.join('  /  ')}
            </p>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-foreground/20">
              {[
                { to: 5, unit: 's', label: 'Ready to Drink' },
                { to: 12, unit: 'mo', label: 'Shelf Life' },
                { to: 100, unit: '%', label: 'Arabica' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
                    <CountUp to={stat.to} />
                    <span className="text-primary">{stat.unit}</span>
                  </div>
                  <div className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.12em] text-foreground/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <KineticMarquee
        items={['Peel', 'Press', 'Pour', 'Real coffee in 5 seconds', 'No machine', 'No fridge']}
        className="border-y border-foreground bg-background text-foreground font-heading font-extrabold uppercase leading-none text-[clamp(2.75rem,9vw,8rem)] py-3 sm:py-4"
      />

      <CampaignBanner />

      {/* How it works: three steps as stacked rows, each verb widening as it crosses the screen */}
      <section id="how-it-works" className="bg-background py-16 lg:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-foreground/60 mb-3">How it works</p>
          <KineticHeading className="font-heading text-4xl sm:text-6xl font-extrabold uppercase text-foreground leading-[0.95] mb-10 sm:mb-14">
            Three moves. <span className="text-primary">Five seconds.</span>
          </KineticHeading>

          <ol className="border-b border-foreground">
            {STEPS.map((item) => (
              <li key={item.step} className="grid grid-cols-12 items-center gap-x-4 gap-y-2 border-t border-foreground py-6 sm:py-8">
                <span className="col-span-2 sm:col-span-1 font-mono text-sm text-foreground/60">{item.step}</span>
                <KineticWord
                  as="h3"
                  className="col-span-10 sm:col-span-6 font-heading font-extrabold uppercase leading-[0.85] text-[clamp(3.5rem,13vw,10rem)] text-foreground"
                >
                  {item.title}
                </KineticWord>
                <p className="col-span-8 col-start-3 sm:col-start-auto sm:col-span-3 text-base sm:text-lg text-foreground/80">{item.description}</p>
                <img
                  src={cld(item.image, 320)}
                  srcSet={cldSrcSet(item.image, [160, 320, 480])}
                  sizes="(min-width: 640px) 12vw, 25vw"
                  alt=""
                  loading="lazy"
                  className="col-span-2 w-full h-20 sm:h-28 object-contain"
                />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-background border-t border-foreground py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <KineticHeading className="font-heading text-4xl sm:text-6xl font-extrabold uppercase text-foreground leading-[0.95] mb-2 sm:mb-3">
                The <span className="text-primary">range</span>
              </KineticHeading>
              <p className="text-base sm:text-lg text-foreground/70">Concentrates, cold brew and tea, all in the same press tube.</p>
            </div>
            <Link
              to="/products"
              className="shrink-0 font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-foreground underline underline-offset-4 hover:text-primary"
            >
              View all
            </Link>
          </Reveal>

          <Stagger className={`${SWIPE_ROW} sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:mx-0 sm:px-0 sm:overflow-visible`}>
            {featuredProducts.slice(0, 4).map((product) => (
              <StaggerItem key={product.id} className="snap-start shrink-0 w-[44%] sm:w-auto">
                <ProductCard {...product} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why it's in your bag: an editorial list, no cards */}
      <section className="bg-secondary border-t border-foreground py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-foreground/60 mb-3">Why people carry it</p>
            <KineticHeading className="font-heading text-4xl sm:text-6xl font-extrabold uppercase text-foreground leading-[0.95]">
              Brewed first. <span className="text-primary">Sealed second.</span>
            </KineticHeading>
            <p className="mt-5 text-base sm:text-lg text-foreground/80 max-w-md">
              Real brewed Arabica, sealed with nitrogen the way it left the brewer. No powder, no machine.
            </p>
            <Link to="/faq" className="inline-block mt-6 font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-foreground underline underline-offset-4 hover:text-primary">
              Read the FAQ
            </Link>
          </div>
          <dl className="lg:col-span-7 border-b border-foreground">
            {REASONS.map((r, i) => (
              <div key={r.title} className="grid grid-cols-12 gap-4 border-t border-foreground py-5 sm:py-6">
                <span className="col-span-2 font-mono text-sm text-foreground/60">{String(i + 1).padStart(2, '0')}</span>
                <dt className="col-span-10 sm:col-span-4 font-heading text-2xl sm:text-3xl font-extrabold uppercase leading-none">{r.title}</dt>
                <dd className="col-span-10 col-start-3 sm:col-span-6 sm:col-start-auto text-base text-foreground/80">{r.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Coffee insights */}
      <section className="bg-foreground text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <Reveal className="space-y-5 sm:space-y-6">
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-white/60">Coffee notes</p>
            <KineticHeading className="font-heading text-4xl sm:text-6xl font-extrabold uppercase leading-[0.95]">
              Read before <span className="text-primary">you press.</span>
            </KineticHeading>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">Short reads on brewing, beans and taking good coffee with you.</p>
            <ul className="border-b border-white/30">
              {READS.map((r) => (
                <li key={r.to} className="border-t border-white/30">
                  <Link to={r.to} className="block py-3 text-white/90 hover:text-primary">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/insights"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-white hover:text-foreground text-white font-heading font-bold uppercase tracking-wide"
            >
              All coffee notes
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            {/* Loads nothing until played; a still frame is shown meanwhile */}
            <video
              src={cldVideo(INSIGHTS_VIDEO, 960)}
              poster={cldVideoPoster(INSIGHTS_VIDEO, 960)}
              controls
              playsInline
              preload="none"
              data-insights-video
              className="w-full bg-black/20 aspect-video border border-white/30"
            />
          </Reveal>
        </div>
      </section>
    </PageWrapper>
    </div>
  );
};

export default HomePage;
