/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // darkMode disabled
  theme: {
    extend: {
      colors: {
        // Tech-Forward Design System - keeping coffee theme but modernized
        primary: '#8B7355', // Main coffee brown
        'primary-foreground': '#FFFFFF',
        secondary: '#F0E4D3', // Cream
        'secondary-foreground': '#2A2118', // Dark roast
        background: '#F5F1EB', // Light cream background
        foreground: '#2A2118', // Main text color (not pure black)
        card: '#FFFFFF',
        'card-foreground': '#2A2118',
        accent: '#D4C5B0', // Muted accent
        'accent-foreground': '#2A2118',
        destructive: '#EF4444',
        'destructive-foreground': '#FFFFFF',
        border: '#E6DCC9', // Subtle borders
        input: '#E6DCC9',
        ring: '#8B7355',
        
        // Legacy support (gradually migrate away from these)
        'primary-light': '#D4C5B0',
        'primary-dark': '#2A2118',
        cream: '#F0E4D3',
        'cream-dark': '#D4C5B0',
        coffee: '#8B7355',
        'coffee-light': '#D4C5B0',
        'custom-cream': '#F0E4D3',
        brown: {
          500: '#8B7355',
          600: '#2A2118',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'], // Body text
        heading: ['Space Grotesk', 'sans-serif'], // Headings - tech feel
        accent: ['Playfair Display', 'serif'], // Testimonials, premium badges
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-light': 'bounceLight 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 4s ease-in-out infinite alternate',
        'gradient': 'gradient 6s ease infinite',
        'wiggle': 'wiggle 3s ease-in-out infinite',
        'shake': 'shake 1s ease-in-out infinite',
        'smooth-spin': 'smoothSpin 12s linear infinite',
        'gentle-bounce': 'gentleBounce 6s ease-in-out infinite',
        'hover-bounce': 'hoverBounce 0.6s ease-in-out',
        'icon-wiggle': 'iconWiggle 0.5s ease-in-out',
        'mobile-scroll': 'mobileScroll 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceLight: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-8px)' },
          '60%': { transform: 'translateY(-4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(139, 115, 85, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(139, 115, 85, 0.6)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-0.5deg)' },
          '50%': { transform: 'rotate(0.5deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-0.5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(0.5px)' },
        },
        smoothSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        gentleBounce: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        hoverBounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        iconWiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        mobileScroll: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      perspective: {
        '1000': '1000px',
      },
      scale: {
        '102': '1.02',
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
};