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
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useFeaturedProducts } from '../hooks/useProducts';
import SteamEffect from '../components/SteamEffect';
import PageWrapper from '../components/PageWrapper';

import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { GradientText, RevealText, TypewriterText } from '../components/AnimatedText';

const HomePage: React.FC = () => {
  const { products: featuredProducts, loading: productsLoading } = useFeaturedProducts();

  // Scroll animations
  const heroRef = useScrollAnimation({ threshold: 0.1 });
  const productsRef = useScrollAnimation({ threshold: 0.2 });
  const insightsRef = useScrollAnimation({ threshold: 0.2 });



  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <PageWrapper padding="none">
      <div className="space-y-16">
        {/* Hero Section */}
        <section 
          ref={heroRef.elementRef}
          className={`relative bg-gradient-to-br from-[#f8f6f3] via-[#f5f2ed] to-[#f0ebe4] overflow-hidden min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center will-change-transform scroll-container scroll-fade-in-up ${heroRef.isVisible ? 'visible' : ''}`}
        >
          {/* Decorative Stars - Mobile Optimized */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Large decorative star - top left - Hidden on mobile */}
            <div className="hidden sm:block absolute top-20 left-16 text-[#d4b896] opacity-30 animate-gentle-bounce will-change-transform">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>

            {/* Medium star - top right - Hidden on mobile */}
            <div
              className="hidden sm:block absolute top-32 right-20 text-[#c9a876] opacity-40 animate-float will-change-transform"
              style={{ animationDelay: '1s' }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>

            {/* Small sparkle stars - Mobile optimized positioning */}
            <div className="absolute top-20 sm:top-40 left-1/4 sm:left-1/3 text-[#b7e6b9] opacity-50 will-change-transform">
              <Sparkles
                className="h-4 w-4 sm:h-6 sm:w-6 animate-pulse"
                style={{ animationDelay: '2s' }}
              />
            </div>

            <div className="absolute bottom-20 sm:bottom-40 left-10 sm:left-20 text-[#d4b896] opacity-40 will-change-transform">
              <Star
                className="h-6 w-6 sm:h-8 sm:w-8 animate-pulse"
                style={{ animationDelay: '0.5s' }}
              />
            </div>

            <div className="absolute top-1/2 right-16 sm:right-32 text-[#c9a876] opacity-30 will-change-transform">
              <Sparkles
                className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce"
                style={{ animationDelay: '1.5s' }}
              />
            </div>

            {/* Additional decorative elements - Hidden on mobile */}
            <div className="hidden sm:block absolute bottom-32 right-16 text-[#e6d3b7] opacity-35 will-change-transform">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div className="space-y-6 sm:space-y-8 hero-fade-in-left hero-stagger-1 transform hover:scale-105 transition-all duration-500 will-change-transform">
                {/* Decorative star near text - Mobile optimized */}
                <div className="relative">
                  <div className="absolute -top-2 sm:-top-4 -left-4 sm:-left-8 text-[#d4b896] opacity-40 hero-float-subtle">
                    <svg
                      width="20"
                      height="20"
                      className="sm:w-6 sm:h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center space-x-2 text-primary font-medium">
                      <Zap className="h-4 w-4 sm:h-5 sm:h-5 text-[#b7e6b9] animate-pulse"/>
                      <GradientText 
                        className="font-bold text-sm sm:text-base"
                        delay={0.2}
                      >
                        India's Premium Coffee Concentrate Brand
                      </GradientText>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                      <TypewriterText 
                        className="block"
                        delay={0.2}
                        speed={80}
                      >
                        Your Personal Café
                      </TypewriterText>
                      <span className="block text-[#8B7355] relative float-text">
                        <RevealText 
                          className="inline"
                          delay={0.4}
                        >
                          On The Go!
                        </RevealText>
                        {/* Small decorative star next to text - Mobile optimized */}
                        <div className="absolute -right-4 sm:-right-8 top-1 sm:top-2 text-[#d4b896] opacity-50 hero-float-subtle">
                          <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 animate-pulse" />
                        </div>
                      </span>
                    </h1>
                    <RevealText 
                      className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg"
                      delay={0.6}
                    >
                      Experience the convenience of premium instant coffee concentrate that delivers barista-quality coffee in seconds. Whether you're traveling or need the comfort of home, enjoy your favorite flavored coffee anytime, anywhere.
                    </RevealText>

                    {/* Health Benefits Badges - Mobile optimized */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800 border border-green-200 hover:scale-105 transition-transform duration-300 pulse-text">
                        <Leaf className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-pulse" />
                        Sugar Free
                      </span>
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 hover:scale-105 transition-transform duration-300 pulse-text" style={{ animationDelay: '0.2s' }}>
                        <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-pulse" />
                        Gluten Free
                      </span>
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200 hover:scale-105 transition-transform duration-300 pulse-text" style={{ animationDelay: '0.4s' }}>
                        <Coffee className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-pulse" />
                        100% Natural
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons - Mobile optimized */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#8B7355] hover:bg-[#7a6449] text-white font-semibold rounded-full transition-all duration-300 group shadow-lg hover:shadow-2xl transform hover:scale-105 relative overflow-hidden will-change-transform hero-shine glow-text text-sm sm:text-base"
                    style={{
                      background:
                        'linear-gradient(45deg, #8B7355, #7a6449, #8B7355)',
                      backgroundSize: '200% 200%',
                      animation: 'gradient 4s ease infinite',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                  <Link
                    to="/insights"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 relative overflow-hidden group will-change-transform text-sm sm:text-base"
                  >
                    <div className="absolute inset-0 bg-[#8B7355] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <span className="relative z-10">Coffee Insights</span>
                  </Link>
                </div>
              </div>

              {/* Right side - Hand with Coffee Cup - Mobile optimized */}
              <div className="relative hero-fade-in-right hero-stagger-2 transform hover:scale-105 transition-all duration-500 will-change-transform mt-8 lg:mt-0">
                <div className="relative max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
                  {/* Background decorative circle - Hidden on mobile */}
                  <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-[#f5f2ed] to-[#e8dcc6] rounded-full transform scale-110 opacity-50 hero-float-subtle"></div>

                  {/* Main image container - Mobile optimized padding */}
                  <div className="relative bg-gradient-to-br from-[#f8f6f3] to-[#f0ebe4] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 ease-out will-change-transform hero-scale-in">
                    {/* Hand holding coffee cup image */}
                    <div className="relative">
                      <img
                        src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751551560/Frame_21_1_1_wztli7.png"
                        alt="Hand holding coffee cup"
                        className="w-full h-auto rounded-xl sm:rounded-2xl shadow-lg transition-transform duration-700 ease-out will-change-transform hover:scale-105 hero-float-subtle"
                        loading="eager"
                        decoding="async"
                        style={{
                          transform: 'translateZ(0)',
                          backfaceVisibility: 'hidden',
                          perspective: '1000px',
                        }}
                      />
                      
                      {/* Steam effect rising from the coffee cup - Mobile optimized */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 sm:-translate-y-4">
                        <SteamEffect 
                          intensity="medium" 
                          size="medium"
                          color="rgba(255, 255, 255, 0.9)"
                        />
                      </div>
                      
                      {/* Simple inline steam test - Mobile optimized */}
                      <div className="absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2 steam-container">
                        <div 
                          className="steam-particle" 
                          style={{ 
                            animation: 'steam-rise 3s ease-out infinite',
                            background: 'rgba(255, 255, 255, 0.9)',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%'
                          }}
                        ></div>
                        <div 
                          className="steam-particle" 
                          style={{ 
                            animation: 'steam-rise 3s ease-out infinite 0.5s',
                            background: 'rgba(255, 255, 255, 0.9)',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%'
                          }}
                        ></div>
                        <div 
                          className="steam-particle" 
                          style={{ 
                            animation: 'steam-rise 3s ease-out infinite 1s',
                            background: 'rgba(255, 255, 255, 0.9)',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%'
                          }}
                        ></div>
                      </div>
                      
                      {/* Additional steam from different parts of the cup - Hidden on mobile */}
                      <div className="hidden sm:block absolute top-2 left-1/3 transform -translate-x-1/2 -translate-y-2">
                        <SteamEffect 
                          intensity="light" 
                          size="small"
                          color="rgba(255, 255, 255, 0.7)"
                        />
                      </div>
                      
                      <div className="hidden sm:block absolute top-1 right-1/3 transform translate-x-1/2 -translate-y-3">
                        <SteamEffect 
                          intensity="light" 
                          size="small"
                          color="rgba(255, 255, 255, 0.6)"
                        />
                      </div>

                      {/* Floating "@once COFFEE" text overlay - Mobile optimized */}
                      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 will-change-transform">
                        <div className="bg-white/90 backdrop-blur-sm px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full shadow-lg border border-white/20 hover:scale-105 transition-all duration-500 ease-out">
                          <div className="text-center">
                            <div className="text-xs sm:text-sm text-[#8B7355] font-medium">
                              Cafe at Once
                            </div>
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#8B7355] tracking-wider">
                              COFFEE
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating decorative stars around the image - Hidden on mobile */}
                    <div className="hidden sm:block absolute -top-4 -right-4 text-[#d4b896] opacity-60 hero-float-subtle">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>

                    <div className="absolute -bottom-2 -left-2 text-[#c9a876] opacity-50 animate-pulse will-change-transform hero-float-subtle">
                      <Sparkles className="h-7 w-7" />
                    </div>

                    <div className="absolute top-1/4 -right-6 text-[#e6d3b7] opacity-40 hero-float-subtle">
                      <Star className="h-6 w-6" />
                    </div>

                    <div className="absolute bottom-1/4 -left-6 text-[#d4b896] opacity-45 hero-float-subtle">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Additional floating elements */}
                  <div className="absolute top-8 -left-8 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/30 hover:scale-105 transition-all duration-500 ease-out will-change-transform">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Coffee className="h-5 w-5 text-[#8B7355]" />
                        {/* Steam effect for the coffee icon */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <SteamEffect
                            intensity="light"
                            size="small"
                            color="rgba(139, 115, 85, 0.4)"
                          />
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#8B7355]">
                        Premium Quality
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-12 -right-8 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/30 hover:scale-105 transition-all duration-500 ease-out will-change-transform">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-[#8B7355]" />
                      <span className="text-sm font-semibold text-[#8B7355]">
                        5 Seconds
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coffee in 5 Seconds Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 gradient-text">
              INSTANT COFFEE IN 5 SECONDS
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-reveal">
              Our revolutionary coffee concentrate system delivers barista-quality coffee
              in seconds. Just peel, press, and enjoy your perfect cup of coffee anywhere!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1: Peel */}
            <div className="text-center group transform hover:scale-105 transition-all duration-300 will-change-transform">
              <div className="relative mb-6">
                <div>
                  <img
                    src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751552822/Frame_26_3_bmmwov.png"
                    alt="Peel the concentrate"
                    className="w-30 h-30 object-contain rounded-lg mx-auto group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div
                  className="absolute -top-2 -right-2 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                  style={{
                    backgroundColor: '#8B7355',
                    color: '#F5F1EB',
                  }}
                >
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Peel</h3>
              <p className="text-gray-600">
                Open your coffee concentrate tube in seconds
              </p>
            </div>

            {/* Step 2: Press */}
            <div
              className="text-center group transform hover:scale-105 transition-all duration-300 will-change-transform"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="relative mb-6">
                <div>
                  <img
                    src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751552685/Frame_25_3_zjsnuy.png"
                    alt="Press into water"
                    className="w-30 h-30 object-contain rounded-lg mx-auto group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div
                  className="absolute -top-2 -right-2 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                  style={{
                    backgroundColor: '#8B7355',
                    color: '#F5F1EB',
                  }}
                >
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Press</h3>
              <p className="text-gray-600">
                Squeeze concentrate into hot or cold water
              </p>
            </div>

            {/* Step 3: Go */}
            <div
              className="text-center group transform hover:scale-105 transition-all duration-300 will-change-transform"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="relative mb-6">
                <div>
                  <img
                    src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751551122/Frame_27_1_ntpnxq.png"
                    alt="Enjoy your coffee"
                    className="w-30 h-30 object-contain rounded-lg mx-auto group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div
                  className="absolute -top-2 -right-2 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                  style={{
                    backgroundColor: '#8B7355',
                    color: '#F5F1EB',
                  }}
                >
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Go</h3>
              <p className="text-gray-600">
                Enjoy perfect coffee wherever you are
              </p>
            </div>
          </div>
        </section>

            {/* Features Section */}
      <section className="bg-white py-16 scroll-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Cafe at Once Coffee?
            </h2>
            <p className="text-lg text-gray-600">
              <span className="text-green-600 font-semibold">
                India's Premium Coffee Concentrate Brand
              </span>{' '}
              - Premium quality coffee meets ultimate convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#8B7355]"
                style={{
                  backgroundColor: '#C0B2A0',
                }}
              >
                <Clock
                  className="h-8 w-8 transition-all duration-300 group-hover:text-[#C0B2A0]"
                  style={{ color: '#8B7355' }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Instant Coffee in 5 Seconds
              </h3>
              <p className="text-gray-600">
                Perfect barista-quality coffee in seconds, not minutes
              </p>
            </div>

            <div className="text-center group">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#8B7355]"
                style={{
                  backgroundColor: '#C0B2A0',
                }}
              >
                <Leaf
                  className="h-8 w-8 transition-all duration-300 group-hover:text-[#C0B2A0]"
                  style={{ color: '#8B7355' }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pure Coffee Concentrate
              </h3>
              <p className="text-gray-600">
                <span className="font-semibold text-green-600">
                  Sugar Free & Gluten Free
                </span>{' '}
                - Pure coffee with no artificial ingredients
              </p>
            </div>

            <div className="text-center group">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#8B7355]"
                style={{
                  backgroundColor: '#C0B2A0',
                }}
              >
                <Award
                  className="h-8 w-8 transition-all duration-300 group-hover:text-[#C0B2A0]"
                  style={{ color: '#8B7355' }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Premium Coffee Quality
              </h3>
              <p className="text-gray-600">
                100% Arabica coffee beans sourced from top regions for the best coffee experience
              </p>
            </div>

            <div className="text-center group">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#8B7355]"
                style={{
                  backgroundColor: '#C0B2A0',
                }}
              >
                <Coffee
                  className="h-8 w-8 transition-all duration-300 group-hover:text-[#C0B2A0]"
                  style={{ color: '#8B7355' }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Portable Coffee Solution
              </h3>
              <p className="text-gray-600">
                Take your favorite flavored coffee anywhere you go - perfect for travel and gym
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section 
        ref={productsRef.elementRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-container scroll-fade-in-up ${productsRef.isVisible ? 'visible' : ''}`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Coffee Products
          </h2>
          <p className="text-lg text-gray-600">
            Discover our most popular coffee concentrates and flavored coffee options
          </p>
        </div>

        {productsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white font-medium rounded-lg transition-colors"
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Coffee Insights Section */}
      <section 
        ref={insightsRef.elementRef}
        className={`bg-gradient-to-r from-primary to-primary-dark text-white py-16 scroll-container scroll-fade-in-up ${insightsRef.isVisible ? 'visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <GradientText className="text-3xl sm:text-4xl font-bold">
                Discover Coffee Insights
              </GradientText>
              <RevealText className="text-lg text-primary-light">
                Explore the fascinating world of coffee with our curated
                collection of insights, brewing techniques, and coffee culture
                from around the globe.
              </RevealText>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Coffee brewing techniques</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Origin stories and culture</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Health benefits and facts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Expert tips and tricks</span>
                </div>
              </div>

              <Link
                to="/insights"
                className="inline-flex items-center px-8 py-4 bg-white text-primary hover:bg-cream-dark font-semibold rounded-lg transition-colors"
              >
                Explore Insights
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <div className="relative">
              <video
                src="https://res.cloudinary.com/dtcsms7zn/video/upload/v1751395895/526c3573288b46a0a85fec27d8630925.HD-1080p-7.2Mbps-15882571_1_lxeljd.mp4"
                controls
                autoPlay={false}
                loop
                muted
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* WhatsApp removed */}
    </div>
  </PageWrapper>
  );
};

export default HomePage;
