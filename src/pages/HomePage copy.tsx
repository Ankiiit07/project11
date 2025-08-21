import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Leaf, Award, ShoppingCart, Zap, Coffee, Star, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const HomePage: React.FC = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16 pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#f8f6f3] via-[#f5f2ed] to-[#f0ebe4] overflow-hidden min-h-[90vh] flex items-center">
        {/* Decorative Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large decorative star - top left */}
          <div className="absolute top-20 left-16 text-[#d4b896] opacity-30 animate-pulse">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          
          {/* Medium star - top right */}
          <div className="absolute top-32 right-20 text-[#c9a876] opacity-40 animate-bounce" style={{ animationDelay: '1s' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          
          {/* Small sparkle stars */}
          <div className="absolute top-40 left-1/3 text-[#e6d3b7] opacity-50">
            <Sparkles className="h-6 w-6 animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="absolute bottom-40 left-20 text-[#d4b896] opacity-40">
            <Star className="h-8 w-8 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <div className="absolute top-1/2 right-32 text-[#c9a876] opacity-30">
            <Sparkles className="h-5 w-5 animate-bounce" style={{ animationDelay: '1.5s' }} />
          </div>
          
          {/* Additional decorative elements */}
          <div className="absolute bottom-32 right-16 text-[#e6d3b7] opacity-35">
            <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              {/* Decorative star near text */}
              <div className="relative">
                <div className="absolute -top-4 -left-8 text-[#d4b896] opacity-40">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-primary font-medium">
                    <Zap className="h-5 w-5" />
                    <span>Instant Coffee Revolution</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Your Personal Café
                    <span className="block text-[#8B7355] relative">
                      On The Go!
                      {/* Small decorative star next to text */}
                      <div className="absolute -right-8 top-2 text-[#d4b896] opacity-50">
                        <Sparkles className="h-6 w-6 animate-pulse" />
                      </div>
                    </span>
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                    Enjoy your barista-style coffee at your convenience whether you are travelling 
                    or need the comfort of home with a good cup of coffee.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#8B7355] hover:bg-[#7a6449] text-white font-semibold rounded-full transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/subscription"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white font-semibold rounded-full transition-all duration-300"
                >
                  Coffee Insights
                </Link>
              </div>
            </div>

            {/* Right side - Hand with Coffee Cup */}
            <div className="relative animate-fade-in">
              <div className="relative max-w-lg mx-auto">
                {/* Background decorative circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#f5f2ed] to-[#e8dcc6] rounded-full transform scale-110 opacity-50"></div>
                
                {/* Main image container */}
                <div className="relative bg-gradient-to-br from-[#f8f6f3] to-[#f0ebe4] rounded-3xl p-8 shadow-2xl">
                  {/* Hand holding coffee cup image */}
                  <div className="relative">
                    <img 
                      src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751551560/Frame_21_1_1_wztli7.png"
                      alt="Hand holding coffee cup"
                      className="w-full h-auto rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Floating "@once COFFEE" text overlay */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                      <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20">
                        <div className="text-center">
                          <div className="text-sm text-[#8B7355] font-medium">Cafe at once</div>
                          <div className="text-2xl font-bold text-[#8B7355] tracking-wider">COFFEE</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating decorative stars around the image */}
                  <div className="absolute -top-4 -right-4 text-[#d4b896] opacity-60 animate-bounce">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  
                  <div className="absolute -bottom-2 -left-2 text-[#c9a876] opacity-50 animate-pulse">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  
                  <div className="absolute top-1/4 -right-6 text-[#e6d3b7] opacity-40 animate-pulse" style={{ animationDelay: '1s' }}>
                    <Star className="h-6 w-6" />
                  </div>
                  
                  <div className="absolute bottom-1/4 -left-6 text-[#d4b896] opacity-45 animate-bounce" style={{ animationDelay: '2s' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Additional floating elements */}
                <div className="absolute top-8 -left-8 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/30">
                  <div className="flex items-center space-x-2">
                    <Coffee className="h-5 w-5 text-[#8B7355]" />
                    <span className="text-sm font-semibold text-[#8B7355]">Premium Quality</span>
                  </div>
                </div>
                
                <div className="absolute bottom-12 -right-8 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/30">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-[#8B7355]" />
                    <span className="text-sm font-semibold text-[#8B7355]">5 Seconds</span>
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
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            COFFEE IN 5 SECONDS
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our revolutionary concentrate system delivers barista-quality coffee in seconds. 
            Just peel, press, and go!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Step 1: Peel */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div 
              >
                <img 
                  src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751552822/Frame_26_3_bmmwov.png"
                  alt="Peel the concentrate"
                  className="w-30 h-30 object-contain rounded-lg"
                />
              </div>
              <div 
               className="absolute -top-2 -right-2 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: '#8B7355',
                  color: '#F5F1EB'}}
              >
                1
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Peel</h3>
            <p className="text-gray-600">Open your coffee concentrate tube in seconds</p>
          </div>

          {/* Step 2: Press */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div 
              >
                <img 
                  src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751552685/Frame_25_3_zjsnuy.png"
                  alt="Press into water"
                  className="w-30 h-30 object-contain rounded-lg"
                />
              </div>
              <div 
                className="absolute -top-2 -right-2 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: '#8B7355',
                  color: '#F5F1EB'
                }}
              >
                2
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Press</h3>
            <p className="text-gray-600">Squeeze concentrate into hot or cold water</p>
          </div>

          {/* Step 3: Go */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div 
                
              >
                <img 
                  src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751551122/Frame_27_1_ntpnxq.png"
                  alt="Enjoy your coffee"
                  className="w-30 h-30 object-contain rounded-lg"
                />
              </div>
              <div 
                className="absolute -top-2 -right-2 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: '#8B7355',
                  color: '#F5F1EB'
                }}
              >
                3
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Go</h3>
            <p className="text-gray-600">Enjoy perfect coffee wherever you are</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Cafe at once?</h2>
            <p className="text-lg text-gray-600">Premium quality meets ultimate convenience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ 
                  backgroundColor: '#C0B2A0'
                }}
              >
                <Clock 
                  className="h-8 w-8 transition-all duration-300"
                  style={{ color: '#8B7355' }}
                />
                <style jsx>{`
                  .group:hover div {
                    background-color: #8B7355 !important;
                  }
                  .group:hover svg {
                    color: #C0B2A0 !important;
                  }
                `}</style>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5-Second Brewing</h3>
              <p className="text-gray-600">Perfect coffee in seconds, not minutes</p>
            </div>

            <div className="text-center group">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ 
                  backgroundColor: '#C0B2A0'
                }}
              >
                <Leaf 
                  className="h-8 w-8 transition-all duration-300"
                  style={{ color: '#8B7355' }}
                />
                <style jsx>{
                
                  }
                `</style>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Additives</h3>
              <p className="text-gray-600">Pure coffee with no sugar or artificial ingredients</p>
            </div>

            <div className="text-center group">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ 
                  backgroundColor: '#C0B2A0'
                }}
              >
                <Award 
                  className="h-8 w-8 transition-all duration-300"
                  style={{ color: '#8B7355' }}
                />
                <style jsx>{`
                  .group:hover div {
                    background-color: #8B7355 !important;
                  }
                  .group:hover svg {
                    color: #C0B2A0 !important;
                  }
                `}</style>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">100% Arabica beans sourced from top regions</p>
            </div>

            <div className="text-center group">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ 
                  backgroundColor: '#C0B2A0'
                }}
              >
                <Coffee 
                  className="h-8 w-8 transition-all duration-300"
                  style={{ color: '#8B7355' }}
                />
                <style jsx>{`
                  .group:hover div {
                    background-color: #8B7355 !important;
                  }
                  .group:hover svg {
                    color: #C0B2A0 !important;
                  }
                `}</style>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Portable</h3>
              <p className="text-gray-600">Take your favorite coffee anywhere you go</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600">Discover our most popular coffee concentrates</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

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

      {/* Never Run Out Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">Never Run Out</h2>
              <p className="text-lg text-primary-light">
                Subscribe and save 15% on every delivery. Flexible scheduling, 
                skip anytime, and cancel whenever you want.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>15% off every order</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Free shipping on all deliveries</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Flexible delivery schedule</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Cancel anytime</span>
                </div>
              </div>

              <Link
                to="/subscription"
                className="inline-flex items-center px-8 py-4 bg-white text-primary hover:bg-cream-dark font-semibold rounded-lg transition-colors"
              >
                Coffee Insights
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
  className=""
/>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;