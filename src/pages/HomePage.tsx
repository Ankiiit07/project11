import React from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
// Assuming these components are provided elsewhere or are placeholders for demonstration
// import ProductCard from "../components/ProductCard";
// import { useFeaturedProducts } from "../hooks/useProducts";
// import SteamEffect from "../components/SteamEffect";
// import { useScrollAnimation } from "../hooks/useScrollAnimation";
// import {
//   GradientText,
//   RevealText,
//   TypewriterText,
// } from "../components/AnimatedText";

import ProductCard from "../components/ProductCard";

import { useFeaturedProducts } from "../hooks/useProducts";

// Placeholder for SteamEffect component
const SteamEffect: React.FC<{
  intensity: string;
  size: string;
  color: string;
}> = ({ intensity, size, color }) => {
  const getParticleStyles = () => {
    let baseWidth = 8;
    let baseHeight = 8;
    let animationDuration = 3;

    if (size === "small") {
      baseWidth = 5;
      baseHeight = 5;
    } else if (size === "large") {
      baseWidth = 12;
      baseHeight = 12;
    }

    if (intensity === "light") {
      animationDuration = 4;
    } else if (intensity === "heavy") {
      animationDuration = 2;
    }

    return {
      width: `${baseWidth}px`,
      height: `${baseHeight}px`,
      background: color,
      animation: `steam-rise ${animationDuration}s ease-out infinite`,
    };
  };

  const particlesCount =
    intensity === "heavy" ? 5 : intensity === "medium" ? 3 : 2;

  return (
    <div className="steam-container absolute -top-4 left-1/2 transform -translate-x-1/2">
      {[...Array(particlesCount)].map((_, i) => (
        <div
          key={i}
          className="steam-particle absolute opacity-0 rounded-full"
          style={{
            ...getParticleStyles(),
            animationDelay: `${i * 0.5}s`, // Stagger animation
            left: `${(Math.random() - 0.5) * 20}px`, // Slight horizontal variation
          }}
        ></div>
      ))}
      {/* Keyframes for steam-rise animation (should ideally be in CSS) */}
      <style jsx>{`
        @keyframes steam-rise {
          0% {
            transform: translate(0, 0) scale(0.5);
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: translate(calc(var(--steam-offset-x) * 1px), -50px)
              scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Placeholder for useScrollAnimation hook
const useScrollAnimation = ({ threshold = 0.1 } = {}) => {
  const elementRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  return { elementRef, isVisible };
};

// Placeholder for AnimatedText components
const GradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => (
  <span
    className={`${className} text-transparent bg-clip-text bg-gradient-to-r from-[#8B7355] to-[#7a6449]`}
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </span>
);

const RevealText: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => (
  <span
    className={`${className} animate-reveal-text`}
    style={{
      animationDelay: `${delay}s`,
      display: "inline-block",
      overflow: "hidden",
    }}
  >
    {children}
    <style jsx>{`
      @keyframes reveal-text {
        0% {
          transform: translateY(100%);
          opacity: 0;
        }
        100% {
          transform: translateY(0%);
          opacity: 1;
        }
      }
      .animate-reveal-text {
        animation-name: reveal-text;
        animation-duration: 0.8s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
      }
    `}</style>
  </span>
);

const TypewriterText: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  speed?: number;
}> = ({ children, className, delay = 0, speed = 100 }) => {
  const [displayedText, setDisplayedText] = React.useState("");
  const fullText = String(children);

  React.useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [fullText, speed, delay]);

  return (
    <span
      className={`${className} typewriter-text`}
      style={{ animationDelay: `${delay}s` }}
    >
      {displayedText}
    </span>
  );
};

const HomePage: React.FC = () => {
  const { products: featuredProducts, loading: productsLoading } =
    useFeaturedProducts();

  // Scroll animations
  const heroRef = useScrollAnimation({ threshold: 0.1 });
  const productsRef = useScrollAnimation({ threshold: 0.2 });
  const insightsRef = useScrollAnimation({ threshold: 0.2 });

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="space-y-8 sm:space-y-12 lg:space-y-16 page-container font-inter">
      {/* Custom CSS for animations and general styling */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        .page-container {
          min-height: calc(100vh - 100px); /* Adjust based on your header/footer height */
        }

        /* Hero section animations */
        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-gentle-bounce {
          animation: gentle-bounce 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px) translateX(5px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .hero-float-subtle {
            animation: float-subtle 6s ease-in-out infinite;
        }
        @keyframes float-subtle {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(5px, -5px); }
        }


        @keyframes hero-fade-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .hero-fade-in-left {
          animation: hero-fade-in-left 1s ease-out forwards;
        }

        @keyframes hero-fade-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .hero-fade-in-right {
          animation: hero-fade-in-right 1s ease-out forwards;
        }

        .hero-stagger-1 { animation-delay: 0.2s; }
        .hero-stagger-2 { animation-delay: 0.4s; }

        @keyframes hero-scale-in {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
        .hero-scale-in {
            animation: hero-scale-in 0.8s ease-out forwards;
            animation-delay: 0.6s; /* Ensure it appears after text */
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .hero-shine::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
          transform: rotate(45deg);
          transition: transform 0.7s ease-out;
          opacity: 0;
        }
        .hero-shine:hover::before {
          transform: rotate(45deg) translate(25%, 25%);
          opacity: 1;
          animation: shine-animation 0.7s forwards;
        }
        @keyframes shine-animation {
            from { transform: rotate(45deg) translate(-100%, -100%); opacity: 0; }
            to { transform: rotate(45deg) translate(0%, 0%); opacity: 1; }
        }

        .glow-text {
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.7), 0 0 15px rgba(255, 255, 255, 0.5);
        }

        /* Responsive Fade-in-up for scroll sections */
        .scroll-fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .scroll-fade-in-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Pulse text for badges */
        @keyframes pulse-text {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        .pulse-text {
          animation: pulse-text 2s infinite ease-in-out;
        }

        /* Steam effect for coffee cup - defined inline for placeholders as per instructions */
        .steam-container {
          pointer-events: none;
        }
        .steam-particle {
          animation: steam-rise 3s ease-out infinite;
        }

        /* Gradient Text (used directly in component with bg-clip-text) */
        .gradient-text {
          background-image: linear-gradient(45deg, #8B7355, #7a6449);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }

        .text-reveal {
            opacity: 0;
            animation: text-reveal 1s forwards;
            animation-delay: 0.5s;
        }
        @keyframes text-reveal {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Hero Section */}
      <section
        ref={heroRef.elementRef}
        // min-h-screen will make it fill the remaining viewport height below the pt-16
        className={`relative bg-gradient-to-br from-[#f8f6f3] via-[#f5f2ed] to-[#f0ebe4] overflow-hidden flex items-center py-2 sm:py-12 lg:py-24 will-change-transform transition-all duration-700 ease-out ${
          heroRef.isVisible ? "visible" : "opacity-0"
        }`}
      >
        {/* Decorative Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large decorative star - top left */}
          <div className="absolute top-20 left-16 text-[#d4b896] opacity-30 animate-gentle-bounce will-change-transform">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Medium star - top right */}
          <div
            className="absolute top-32 right-20 text-[#c9a876] opacity-40 animate-float will-change-transform"
            style={{ animationDelay: "1s" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Small sparkle stars */}
          <div className="absolute top-40 left-1/3 text-[#b7e6b9] opacity-50 will-change-transform">
            <Sparkles
              className="h-6 w-6 animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>

          <div className="absolute bottom-40 left-20 text-[#d4b896] opacity-40 will-change-transform">
            <Star
              className="h-8 w-8 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          <div className="absolute top-1/2 right-32 text-[#c9a876] opacity-30 will-change-transform">
            <Sparkles
              className="h-5 w-5 animate-bounce"
              style={{ animationDelay: "1.5s" }}
            />
          </div>

          {/* Additional decorative elements */}
          <div className="absolute bottom-32 right-16 text-[#e6d3b7] opacity-35 will-change-transform">
            <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-8 hero-fade-in-left hero-stagger-1 transform hover:scale-105 transition-all duration-500 will-change-transform">
              {/* Decorative star near text */}
              <div className="relative">
                <div className="absolute -top-4 -left-8 text-[#d4b896] opacity-40 hero-float-subtle">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-2 text-primary font-medium">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-[#b7e6b9] animate-pulse" />
                    <GradientText
                      className="font-bold text-sm sm:text-base"
                      delay={0.2}
                    >
                      Healthiest Coffee in India
                    </GradientText>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    <TypewriterText className="block" delay={0.2} speed={80}>
                      Your Personal Café
                    </TypewriterText>
                    <span className="block text-[#8B7355] relative float-text">
                      <RevealText className="inline" delay={0.4}>
                        On The Go!
                      </RevealText>
                      {/* Small decorative star next to text */}
                      <div className="absolute -right-4 top-0 md:-right-8 md:top-2 text-[#d4b896] opacity-50 hero-float-subtle">
                        <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 animate-pulse" />
                      </div>
                    </span>
                  </h1>
                  <RevealText
                    className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-lg"
                    delay={0.6}
                  >
                    Enjoy your barista-style coffee at your convenience whether
                    you are travelling or need the comfort of home with a good
                    cup of coffee.
                  </RevealText>

                  {/* Health Benefits Badges */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                    <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800 border border-green-200 hover:scale-105 transition-transform duration-300 pulse-text">
                      <Leaf className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-pulse" />
                      Sugar Free
                    </span>
                    <span
                      className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 hover:scale-105 transition-transform duration-300 pulse-text"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-pulse" />
                      Gluten Free
                    </span>
                    <span
                      className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200 hover:scale-105 transition-transform duration-300 pulse-text"
                      style={{ animationDelay: "0.4s" }}
                    >
                      <Coffee className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-pulse" />
                      100% Natural
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-[#8B7355] hover:bg-[#7a6449] text-white font-semibold rounded-full text-sm sm:text-base transition-all duration-300 group shadow-lg hover:shadow-2xl transform hover:scale-105 relative overflow-hidden will-change-transform hero-shine glow-text"
                  style={{
                    background:
                      "linear-gradient(45deg, #8B7355, #7a6449, #8B7355)",
                    backgroundSize: "200% 200%",
                    animation: "gradient 4s ease infinite",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
                <Link
                  to="/insights"
                  className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 border-2 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white font-semibold rounded-full text-sm sm:text-base transition-all duration-300 transform hover:scale-105 relative overflow-hidden group will-change-transform"
                >
                  <div className="absolute inset-0 bg-[#8B7355] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10">Coffee Insights</span>
                </Link>
              </div>
            </div>

            {/* Right side - Hand with Coffee Cup */}
            <div className="relative mt-8 lg:mt-0 hero-fade-in-right hero-stagger-2 transform transition-all duration-500 will-change-transform">
              <div className="relative max-w-sm sm:max-w-md mx-auto">
                {/* Background decorative circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#f5f2ed] to-[#e8dcc6] rounded-full transform scale-110 opacity-50 hero-float-subtle"></div>

                {/* Main image container */}
                <div className="relative bg-gradient-to-br from-[#f8f6f3] to-[#f0ebe4] rounded-3xl p-4 sm:p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 ease-out will-change-transform hero-scale-in">
                  {/* Hand holding coffee cup image */}
                  <div className="relative">
                    <img
                      src="https://res.cloudinary.com/dtcsms7zn/image/upload/v1751551560/Frame_21_1_1_wztli7.png"
                      alt="Hand holding coffee cup"
                      className="w-full h-auto rounded-2xl shadow-lg transition-transform duration-700 ease-out will-change-transform hover:scale-105 hero-float-subtle"
                      loading="eager"
                      decoding="async"
                      style={{
                        transform: "translateZ(0)",
                        backfaceVisibility: "hidden",
                        perspective: "1000px",
                      }}
                    />

                    {/* Steam effect rising from the coffee cup */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                      <SteamEffect
                        intensity="medium"
                        size="medium"
                        color="rgba(255, 255, 255, 0.9)"
                      />
                    </div>

                    {/* Simple inline steam test - kept for demonstration, though SteamEffect component is preferred */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 steam-container hidden md:block">
                      <div
                        className="steam-particle"
                        style={{
                          animation: "steam-rise 3s ease-out infinite",
                          background: "rgba(255, 255, 255, 0.9)",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <div
                        className="steam-particle"
                        style={{
                          animation: "steam-rise 3s ease-out infinite 0.5s",
                          background: "rgba(255, 255, 255, 0.9)",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <div
                        className="steam-particle"
                        style={{
                          animation: "steam-rise 3s ease-out infinite 1s",
                          background: "rgba(255, 255, 255, 0.9)",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                        }}
                      ></div>
                    </div>

                    {/* Additional steam from different parts of the cup */}
                    <div className="absolute top-2 left-1/3 transform -translate-x-1/2 -translate-y-2 hidden md:block">
                      <SteamEffect
                        intensity="light"
                        size="small"
                        color="rgba(255, 255, 255, 0.7)"
                      />
                    </div>

                    <div className="absolute top-1 right-1/3 transform translate-x-1/2 -translate-y-3 hidden md:block">
                      <SteamEffect
                        intensity="light"
                        size="small"
                        color="rgba(255, 255, 255, 0.6)"
                      />
                    </div>

                    {/* Floating "@once COFFEE" text overlay */}
                    <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 will-change-transform">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg border border-white/20 hover:scale-105 transition-all duration-500 ease-out">
                        <div className="text-center">
                          <div className="text-xs sm:text-sm text-[#8B7355] font-medium">
                            Cafe at Once
                          </div>
                          <div className="text-lg sm:text-2xl font-bold text-[#8B7355] tracking-wider">
                            COFFEE
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating decorative stars around the image */}
                  <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 text-[#d4b896] opacity-60 hero-float-subtle">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="sm:w-32 sm:h-32"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>

                  <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 text-[#c9a876] opacity-50 animate-pulse will-change-transform hero-float-subtle">
                    <Sparkles className="h-5 w-5 sm:h-7 sm:w-7" />
                  </div>

                  <div className="absolute top-1/4 -right-3 sm:-right-6 text-[#e6d3b7] opacity-40 hero-float-subtle">
                    <Star className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>

                  <div className="absolute bottom-1/4 -left-3 sm:-left-6 text-[#d4b896] opacity-45 hero-float-subtle">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="sm:w-28 sm:h-28"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                </div>

                {/* Additional floating elements */}
                <div className="absolute top-4 -left-4 sm:top-8 sm:-left-8 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-xl shadow-lg border border-white/30 hover:scale-105 transition-all duration-500 ease-out will-change-transform">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="relative">
                      <Coffee className="h-4 w-4 sm:h-5 sm:w-5 text-[#8B7355]" />
                      {/* Steam effect for the coffee icon */}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                        <SteamEffect
                          intensity="light"
                          size="small"
                          color="rgba(139, 115, 85, 0.4)"
                        />
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#8B7355]">
                      Premium Quality
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-6 -right-4 sm:bottom-12 sm:-right-8 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-xl shadow-lg border border-white/30 hover:scale-105 transition-all duration-500 ease-out will-change-transform">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#8B7355]" />
                    <span className="text-xs sm:text-sm font-semibold text-[#8B7355]">
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
            COFFEE IN 5 SECONDS
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-reveal">
            Our revolutionary concentrate system delivers barista-quality coffee
            in seconds. Just peel, press, and go!
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
                  backgroundColor: "#8B7355",
                  color: "#F5F1EB",
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
            style={{ animationDelay: "0.2s" }}
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
                  backgroundColor: "#8B7355",
                  color: "#F5F1EB",
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
            style={{ animationDelay: "0.4s" }}
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
                  backgroundColor: "#8B7355",
                  color: "#F5F1EB",
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
              Why Choose Cafe at Once?
            </h2>
            <p className="text-lg text-gray-600">
              <span className="text-green-600 font-semibold">
                India's Healthiest Coffee
              </span>{" "}
              - Premium quality meets ultimate convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#8B7355]"
                style={{
                  backgroundColor: "#C0B2A0",
                }}
              >
                <Clock
                  className="h-8 w-8 transition-all duration-300 group-hover:text-[#C0B2A0]"
                  style={{ color: "#8B7355" }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                5-Second Brewing
              </h3>
              <p className="text-gray-600">
                Perfect coffee in seconds, not minutes
              </p>
            </div>

            <div className="text-center group">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#8B7355]"
                style={{
                  backgroundColor: "#C0B2A0",
                }}
              >
                <Leaf
                  className="h-8 w-8 transition-all duration-300 group-hover:text-[#C0B2A0]"
                  style={{ color: "#8B7355" }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Additives
              </h3>
              <p className="text-gray-600">
                <span className="font-semibold text-green-600">
                  Sugar Free & Gluten Free
                </span>{" "}
                - Pure coffee with no artificial ingredients
              </p>
            </div>

            <div className="text-center group">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#8B7355]"
                style={{
                  backgroundColor: "#C0B2A0",
                }}
              >
                <Award
                  className="h-8 w-8 transition-all duration-300 group-hover:text-[#C0B2A0]"
                  style={{ color: "#8B7355" }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                100% Arabica beans sourced from top regions
              </p>
            </div>

            <div className="text-center group">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#8B7355]"
                style={{
                  backgroundColor: "#C0B2A0",
                }}
              >
                <Coffee
                  className="h-8 w-8 transition-all duration-300 group-hover:text-[#C0B2A0]"
                  style={{ color: "#8B7355" }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Portable
              </h3>
              <p className="text-gray-600">
                Take your favorite coffee anywhere you go
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        ref={productsRef.elementRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-container scroll-fade-in-up ${
          productsRef.isVisible ? "visible" : ""
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600">
            Discover our most popular coffee concentrates
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
        className={`bg-gradient-to-r from-primary to-primary-dark text-white py-16 scroll-container scroll-fade-in-up ${
          insightsRef.isVisible ? "visible" : ""
        }`}
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
  );
};

export default HomePage;
