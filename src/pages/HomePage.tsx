import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Leaf, Award, Zap, Coffee, Package, Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useFeaturedProducts } from '../hooks/useProducts';
import PageWrapper from '../components/PageWrapper';
import SEO from '../components/SEO';
import { CountUp, Reveal, Stagger, StaggerItem, WordReveal } from '../components/motion';
import { cld, cldSrcSet, cldVideo, cldVideoPoster } from '../utils/cloudinary';

const HERO_IMAGE = 'https://customer-assets.emergentagent.com/job_codebase-updates/artifacts/lsivxbzw_Mask-group-70.png';
const INSIGHTS_VIDEO =
  'https://res.cloudinary.com/dtcsms7zn/video/upload/v1751395895/526c3573288b46a0a85fec27d8630925.HD-1080p-7.2Mbps-15882571_1_lxeljd.mp4';

const STEPS = [
  {
    step: '01',
    title: 'Peel',
    description: 'Open your premium coffee concentrate tube',
    image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751552822/Frame_26_3_bmmwov.png',
  },
  {
    step: '02',
    title: 'Press',
    description: 'Squeeze into hot or cold water',
    image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751552685/Frame_25_3_zjsnuy.png',
  },
  {
    step: '03',
    title: 'Enjoy',
    description: 'Perfect coffee, wherever you are',
    image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751551122/Frame_27_1_ntpnxq.png',
  },
];

const FEATURES = [
  { icon: Clock, title: '5-Second Coffee', description: 'Real brewed coffee, ready in 5 seconds flat', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { icon: Leaf, title: 'Zero Additives', description: 'Just Arabica coffee. No sugar, no preservatives', color: 'text-green-600', bgColor: 'bg-green-50' },
  { icon: Package, title: '12-Month Shelf Life', description: 'Nitrogen-preserved freshness, no refrigeration needed', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { icon: Plane, title: 'TSA Safe', description: 'Carry-on compliant. Perfect for frequent travellers', color: 'text-orange-600', bgColor: 'bg-orange-50' },
];

const PILLS = [
  { icon: Leaf, label: 'Zero Sugar', className: 'bg-green-50 border-green-200 text-green-700' },
  { icon: Award, label: 'Zero Additives', className: 'bg-blue-50 border-blue-200 text-blue-700' },
  { icon: Coffee, label: '100% Arabica', className: 'bg-purple-50 border-purple-200 text-purple-700' },
  { icon: Plane, label: 'TSA Safe', className: 'bg-orange-50 border-orange-200 text-orange-700' },
];

// On phones these rows scroll sideways (with the next card peeking in);
// from `md`/`sm` up they become a normal grid.
const SWIPE_ROW = 'flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 -mx-4 px-4 pb-2';

const HomePage: React.FC = () => {
  const { products: featuredProducts } = useFeaturedProducts();

  return (
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

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-background via-background to-white overflow-hidden lg:min-h-[85vh] flex items-center">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #8B7355 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Phones: headline, then the product, then the details. Desktop: text left, product right. */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 lg:py-12 grid lg:grid-cols-2 gap-x-12 gap-y-6 items-center">
          <div className="space-y-4 lg:col-start-1">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 border border-primary/20 rounded-full"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">India's First Nitrogen-Preserved Coffee</span>
            </motion.div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
              <WordReveal text="Real Coffee." className="block" delay={0.1} />
              <WordReveal text="No Machine. No Compromise." className="block text-primary mt-1 sm:mt-2" delay={0.35} />
            </h1>
          </div>

          {/* Product: gently floats, with soft steam */}
          <motion.div
            className="relative flex justify-center lg:col-start-2 lg:row-start-1 lg:row-span-2"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute top-[6%] left-1/2 -translate-x-1/2 h-16 w-24 pointer-events-none" aria-hidden="true">
              <span className="steam-wisp left-2" style={{ animationDelay: '0s' }} />
              <span className="steam-wisp left-9" style={{ animationDelay: '1.2s' }} />
              <span className="steam-wisp left-16" style={{ animationDelay: '2.4s' }} />
            </div>
            <motion.img
              src={HERO_IMAGE}
              alt="Cafe at Once coffee being poured from press tube into glass"
              className="w-full max-w-[20rem] sm:max-w-md lg:max-w-xl max-h-[42vh] lg:max-h-none object-contain drop-shadow-2xl rounded-2xl"
              loading="eager"
              {...{ fetchpriority: 'high' }} // load the hero image first (lowercase: React 18 passes it through)
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          <motion.div
            className="space-y-6 lg:col-start-1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="space-y-3">
              <p className="text-lg sm:text-xl font-semibold text-foreground/90">Just Press.</p>
              <p className="text-base sm:text-xl text-foreground/70 leading-relaxed max-w-xl">
                India's first{' '}
                <Link to="/blog/what-is-nitrogen-preserved-coffee" className="text-primary hover:underline">
                  nitrogen-preserved brewed Arabica coffee
                </Link>{' '}
                in a portable press tube. Real coffee in 5 seconds: no machine, no fridge, no additives. TSA-safe and ready
                for wherever life takes you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-heading font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                data-testid="hero-shop-now"
              >
                Shop Cafe at Once
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-border hover:border-primary text-foreground hover:text-primary font-heading font-bold rounded-full transition-all duration-300"
                data-testid="hero-learn-more"
              >
                How It Works
              </a>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {PILLS.map(({ icon: Icon, label, className }) => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 border rounded-full text-xs sm:text-sm font-medium ${className}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-2 sm:pt-4">
              {[
                { to: 5, unit: 's', label: 'Ready to Drink' },
                { to: 12, unit: 'mo', label: 'Shelf Life' },
                { to: 100, unit: '%', label: 'Arabica' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    <CountUp to={stat.to} />
                    <span className="text-primary">{stat.unit}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-foreground/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-12 lg:py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Coffee in <span className="text-primary">5 Seconds</span>
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              Revolutionary coffee concentrate technology that delivers barista-quality coffee instantly
            </p>
          </Reveal>

          <Stagger className={`${SWIPE_ROW} md:grid md:grid-cols-3 md:gap-8 lg:gap-12 md:mx-0 md:px-0 md:overflow-visible`}>
            {STEPS.map((item) => (
              <StaggerItem key={item.step} className="snap-center shrink-0 w-[78%] md:w-auto">
                <div className="relative h-full bg-secondary border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-hover">
                  <div className="absolute top-4 right-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-heading font-bold shadow-lg">
                    {item.step}
                  </div>
                  <img
                    src={cld(item.image, 480)}
                    srcSet={cldSrcSet(item.image, [320, 480, 640])}
                    sizes="(min-width: 768px) 33vw, 78vw"
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-36 sm:h-48 object-contain mb-4 sm:mb-6"
                  />
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-foreground/70">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-gradient-to-b from-white to-background py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-foreground mb-2 sm:mb-4">
                Featured <span className="text-primary">Products</span>
              </h2>
              <p className="text-base sm:text-lg text-foreground/70">Discover our most popular coffee concentrates</p>
            </div>
            <Link
              to="/products"
              className="shrink-0 inline-flex items-center gap-1 sm:gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View all
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Reveal>

          <Stagger className={`${SWIPE_ROW} sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:mx-0 sm:px-0 sm:overflow-visible`}>
            {featuredProducts.slice(0, 4).map((product) => (
              <StaggerItem key={product.id} className="snap-start shrink-0 w-[75%] sm:w-auto">
                <ProductCard {...product} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why Cafe at Once */}
      <section className="bg-background py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Why Choose <span className="text-primary">Cafe at Once</span>
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              The only coffee that combines real brewed Arabica taste with true portability. No machine. No fridge. No
              compromise.
            </p>
          </Reveal>

          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {FEATURES.map(({ icon: Icon, title, description, color, bgColor }) => (
              <StaggerItem
                key={title}
                className="bg-white border border-border rounded-2xl p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-hover"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${bgColor} rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${color}`} />
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">{title}</h3>
                <p className="text-xs sm:text-sm text-foreground/70">{description}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="text-center mt-8">
            <Link to="/faq" className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2">
              Have questions? Read our FAQ
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Coffee insights */}
      <section className="bg-foreground text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <Reveal className="space-y-5 sm:space-y-6">
            <h2 className="font-heading text-3xl sm:text-5xl font-bold">
              Discover Coffee <span className="text-primary">Insights</span>
            </h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              Explore the fascinating world of coffee with our curated collection of brewing techniques, culture insights,
              and expert tips.
            </p>
            <ul className="space-y-3">
              {['Professional brewing techniques', 'Coffee origin stories & culture', 'Health benefits & nutrition facts', 'Expert tips & recommendations'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-white/90">{item}</span>
                  </li>
                )
              )}
            </ul>
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-heading font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Explore Insights
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
              className="w-full rounded-3xl shadow-2xl bg-black/20 aspect-video"
            />
          </Reveal>
        </div>
      </section>
    </PageWrapper>
  );
};

export default HomePage;
