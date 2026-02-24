import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  Leaf,
  Award,
  ShoppingCart,
  Zap,
  Coffee,
  Star,
  Sparkles,
  Package,
  TrendingUp,
} from 'lucide-react';
import ProductCardTechForward from '../components/ProductCardTechForward';
import { useFeaturedProducts } from '../hooks/useProducts';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';

const HomePageTechForward: React.FC = () => {
  const { products: featuredProducts, loading: productsLoading } = useFeaturedProducts();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <PageWrapper padding="none">
      <div className="space-y-0">
        {/* Hero Section - Bento Grid Style */}
        <section className="relative bg-gradient-to-b from-background via-background to-white overflow-hidden min-h-screen flex items-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '40px 40px',
              color: '#8B7355'
            }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            {/* Bento Grid Layout */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Content */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">India's #1 Coffee Concentrate Brand</span>
                </motion.div>

                {/* Heading */}
                <div className="space-y-4">
                  <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                    Your Personal
                    <span className="block text-primary mt-2">Café at Once</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed max-w-xl">
                    Experience premium barista-quality coffee in just 5 seconds. 
                    No machines, no mess—just pure coffee perfection, anytime, anywhere.
                  </p>
                </div>

                {/* Health Benefits Pills */}
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-full text-sm font-medium">
                    <Leaf className="h-4 w-4" />
                    Sugar Free
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm font-medium">
                    <Award className="h-4 w-4" />
                    Gluten Free
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-full text-sm font-medium">
                    <Coffee className="h-4 w-4" />
                    100% Natural
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/products"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-heading font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    data-testid="hero-shop-now"
                  >
                    Shop Now
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/insights"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-border hover:border-primary text-foreground hover:text-primary font-heading font-bold rounded-full transition-all duration-300"
                    data-testid="hero-learn-more"
                  >
                    Coffee Insights
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="space-y-1">
                    <div className="font-heading text-3xl font-bold text-foreground">5<span className="text-primary">s</span></div>
                    <div className="text-sm text-foreground/60">Brew Time</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-heading text-3xl font-bold text-foreground">100<span className="text-primary">%</span></div>
                    <div className="text-sm text-foreground/60">Natural</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-heading text-3xl font-bold text-foreground">4.9<span className="text-primary">★</span></div>
                    <div className="text-sm text-foreground/60">Rating</div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Product Showcase */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Main Product Image */}
                <div className="relative bg-white border border-border rounded-3xl p-8 shadow-soft hover:shadow-hover transition-all duration-500">
                  <img
                    src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751551560/Frame_21_1_1_wztli7.png"
                    alt="Hand holding premium coffee"
                    className="w-full h-auto rounded-2xl"
                    loading="eager"
                  />
                  
                  {/* Floating Card - Premium Quality */}
                  <motion.div
                    className="absolute -left-4 top-1/4 bg-white border border-border rounded-2xl p-4 shadow-lg"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground">Premium</div>
                        <div className="text-xs text-foreground/60">Arabica Beans</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating Card - Instant */}
                  <motion.div
                    className="absolute -right-4 bottom-1/4 bg-white border border-border rounded-2xl p-4 shadow-lg"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground">Just 5s</div>
                        <div className="text-xs text-foreground/60">Ready to Drink</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works - 3 Steps */}
        <section className="bg-white py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Coffee in <span className="text-primary">5 Seconds</span>
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Revolutionary coffee concentrate technology that delivers barista-quality coffee instantly
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[
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
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <div className="relative bg-secondary border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-hover">
                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-heading font-bold text-lg shadow-lg">
                      {item.step}
                    </div>
                    
                    {/* Image */}
                    <div className="mb-6">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-contain"
                      />
                    </div>
                    
                    {/* Content */}
                    <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-foreground/70">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-gradient-to-b from-white to-background py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  Featured <span className="text-primary">Products</span>
                </h2>
                <p className="text-lg text-foreground/70">
                  Discover our most popular coffee concentrates
                </p>
              </div>
              <Link
                to="/products"
                className="hidden sm:inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View All
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {productsLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product: any) => (
                  <ProductCardTechForward key={product.id} {...product} />
                ))}
              </div>
            )}

            <div className="text-center mt-12 sm:hidden">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors"
              >
                View All Products
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Cafe at Once - Features Grid */}
        <section className="bg-background py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Why Choose <span className="text-primary">Cafe at Once</span>
              </h2>
              <p className="text-lg text-foreground/70">
                Premium quality meets ultimate convenience
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Clock,
                  title: 'Instant Coffee',
                  description: 'Barista-quality in 5 seconds',
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-50',
                },
                {
                  icon: Leaf,
                  title: 'Pure Concentrate',
                  description: 'Sugar free & gluten free',
                  color: 'text-green-600',
                  bgColor: 'bg-green-50',
                },
                {
                  icon: Award,
                  title: 'Premium Quality',
                  description: '100% Arabica beans',
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-50',
                },
                {
                  icon: Package,
                  title: 'Portable',
                  description: 'Perfect for travel & gym',
                  color: 'text-orange-600',
                  bgColor: 'bg-orange-50',
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="bg-white border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-hover"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-foreground/70">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Coffee Insights CTA */}
        <section className="bg-foreground text-white py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-heading text-4xl sm:text-5xl font-bold">
                  Discover Coffee <span className="text-primary">Insights</span>
                </h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  Explore the fascinating world of coffee with our curated collection of brewing techniques, 
                  culture insights, and expert tips.
                </p>

                <ul className="space-y-3">
                  {[
                    'Professional brewing techniques',
                    'Coffee origin stories & culture',
                    'Health benefits & nutrition facts',
                    'Expert tips & recommendations',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/insights"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-heading font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Explore Insights
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <video
                    src="https://res.cloudinary.com/dtcsms7zn/video/upload/v1751395895/526c3573288b46a0a85fec27d8630925.HD-1080p-7.2Mbps-15882571_1_lxeljd.mp4"
                    controls
                    autoPlay={false}
                    loop
                    muted
                    className="w-full rounded-3xl"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default HomePageTechForward;
