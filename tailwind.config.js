/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // darkMode disabled
  theme: {
    // Crisp corners everywhere (no soft rounding); `full` stays round only for true circles
    borderRadius: { none: '0', sm: '2px', DEFAULT: '2px', md: '2px', lg: '2px', xl: '2px', '2xl': '2px', '3xl': '2px', full: '9999px' },
    // No drop shadows anywhere: depth comes from borders and colour blocks
    boxShadow: { sm: 'none', DEFAULT: 'none', md: 'none', lg: 'none', xl: 'none', '2xl': 'none', inner: 'none', none: 'none' },
    dropShadow: { sm: 'none', DEFAULT: 'none', md: 'none', lg: 'none', xl: 'none', '2xl': 'none', none: 'none' },
    extend: {
      colors: {
        // Tech-Forward Design System - keeping coffee theme but modernized
        primary: '#765F45', // Main coffee brown (a shade deeper than #8B7355 so text on cream passes WCAG AA)
        // Paper, not pure white
        white: '#FBF8F3',
        // The stock rainbow (blue, purple, pink, orange...) is folded into three brand families:
        // roast browns, the packaging's bottle green, and caramel. Red becomes a muted brick.
        ...(() => {
          const roast = { 50: '#F6F1EA', 100: '#EDE3D6', 200: '#DCCBB6', 300: '#C6AE92', 400: '#A88C6C', 500: '#8B7355', 600: '#725C43', 700: '#5A4834', 800: '#433527', 900: '#2A2118' };
          const bottle = { 50: '#EEF4F1', 100: '#D8E6DF', 200: '#B3CDC1', 300: '#86AE9C', 400: '#568C76', 500: '#2F6E57', 600: '#245A47', 700: '#1D4A3B', 800: '#163A2E', 900: '#0E2A21' };
          const caramel = { 50: '#FAF2E8', 100: '#F2E2CC', 200: '#E6C9A4', 300: '#D6AB78', 400: '#C38E52', 500: '#A8733B', 600: '#8A5D30', 700: '#6D4926', 800: '#50361D', 900: '#352414' };
          const brick = { 50: '#F8EDEA', 100: '#F0D8D2', 200: '#E0B1A7', 300: '#CC8678', 400: '#B86353', 500: '#A4473A', 600: '#8C3B30', 700: '#722F27', 800: '#57241E', 900: '#3D1915' };
          return {
            blue: roast, purple: roast, indigo: roast, violet: roast, pink: roast, rose: roast, sky: roast, cyan: roast, fuchsia: roast,
            green: bottle, emerald: bottle, teal: bottle, lime: bottle,
            orange: caramel, amber: caramel, yellow: caramel,
            red: brick,
          };
        })(),
        // Latte Sale campaign: deep green and mint from the Latte packaging
        campaign: { ink: '#0C110F', mint: '#9CC4AE' },
        'primary-foreground': '#FBF8F3',
        secondary: '#F0E4D3', // Cream
        'secondary-foreground': '#2A2118', // Dark roast
        background: '#F5F1EB', // Light cream background
        foreground: '#2A2118', // Main text color (not pure black)
        card: '#FBF8F3',
        'card-foreground': '#2A2118',
        accent: '#D4C5B0', // Muted accent
        'accent-foreground': '#2A2118',
        destructive: '#A4473A',
        'destructive-foreground': '#FBF8F3',
        border: '#E6DCC9', // Subtle borders
        input: '#E6DCC9',
        ring: '#765F45',
        
        // Legacy support (gradually migrate away from these)
        'primary-light': '#D4C5B0',
        'primary-dark': '#2A2118',
        cream: '#F0E4D3',
        'cream-dark': '#D4C5B0',
        coffee: '#765F45',
        'coffee-light': '#D4C5B0',
        'custom-cream': '#F0E4D3',
        brown: {
          500: '#765F45',
          600: '#2A2118',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'], // Body text
        // Condensed grotesque with a width axis, used for the kinetic headlines
        heading: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        accent: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-light': 'bounceLight 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'wiggle': 'wiggle 3s ease-in-out infinite',
        'shake': 'shake 1s ease-in-out infinite',
        'smooth-spin': 'smoothSpin 12s linear infinite',
        'gentle-bounce': 'gentleBounce 6s ease-in-out infinite',
        'hover-bounce': 'hoverBounce 0.6s ease-in-out',
        'icon-wiggle': 'iconWiggle 0.5s ease-in-out',
        'mobile-scroll': 'mobileScroll 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out', // New smooth scale animation
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
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
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
      perspective: {
        '1000': '1000px',
      },
      scale: {
        '102': '1.02',
      },
      boxShadow: { '3xl': 'none', soft: 'none', card: 'none', hover: 'none' },
      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
};