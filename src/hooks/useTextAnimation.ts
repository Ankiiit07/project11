import { useEffect, useRef, useState } from 'react';

interface UseTextAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  animationType?: 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'typewriter' | 'reveal' | 'stagger' | 'float' | 'gradient' | 'glow' | 'bounce' | 'shake' | 'pulse' | 'wave' | 'flip';
  delay?: number;
  duration?: number;
}

export const useTextAnimation = <T extends HTMLElement = HTMLElement>(options: UseTextAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    animationType = 'fade-in',
    delay = 0,
    duration = 0.6
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setIsAnimating(true);
          
          // Reset animation after completion
          setTimeout(() => {
            setIsAnimating(false);
          }, duration * 1000 + delay * 1000);
          
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
          setIsAnimating(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
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
  }, [threshold, rootMargin, triggerOnce, delay, duration]);

  const getAnimationClass = () => {
    if (!isVisible) return '';
    
    const baseClasses = {
      'fade-in': 'fade-in-stagger',
      'slide-up': 'slide-in-up',
      'slide-left': 'slide-in-left',
      'slide-right': 'slide-in-right',
      'scale': 'scale-text',
      'typewriter': 'typewriter',
      'reveal': 'text-reveal',
      'stagger': 'text-reveal-stagger',
      'float': 'float-text',
      'gradient': 'gradient-text',
      'glow': 'glow-text',
      'bounce': 'bounce-text',
      'shake': 'shake-text',
      'pulse': 'pulse-text',
      'wave': 'wave-text',
      'flip': 'flip-text'
    };

    return baseClasses[animationType] || 'fade-in-stagger';
  };

  return { 
    elementRef, 
    isVisible, 
    isAnimating, 
    getAnimationClass,
    animationClass: getAnimationClass()
  };
};

// Specialized hooks for common text animations
export const useTypewriter = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  const reset = () => {
    setDisplayText('');
    setCurrentIndex(0);
  };

  return { displayText, isComplete: currentIndex === text.length, reset };
};

export const useStaggeredText = (texts: string[], staggerDelay: number = 200) => {
  const [visibleTexts, setVisibleTexts] = useState<boolean[]>(new Array(texts.length).fill(false));

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    texts.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleTexts(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * staggerDelay);
      
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [texts, staggerDelay]);

  return { visibleTexts };
};

export const useWaveText = (text: string) => {
  const [isWaving, setIsWaving] = useState(false);

  const startWave = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1500);
  };

  const getWaveText = () => {
    return text.split('').map((char, index) => ({
      char,
      index,
      className: isWaving ? 'wave-text' : '',
      style: { animationDelay: `${index * 0.1}s` }
    }));
  };

  return { getWaveText, startWave, isWaving };
};

export const useGradientText = (text: string, colors: string[] = ['#8B7355', '#b7e6b9', '#c9a876', '#d4b896']) => {
  const gradientStyle = {
    background: `linear-gradient(-45deg, ${colors.join(', ')})`,
    backgroundSize: '400% 400%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent' as const,
    backgroundClip: 'text' as const,
    animation: 'gradient-text 3s ease infinite'
  };

  return { gradientStyle };
};

export const useFloatingText = (text: string, floatIntensity: number = 15) => {
  const [isFloating, setIsFloating] = useState(false);

  const startFloat = () => {
    setIsFloating(true);
  };

  const stopFloat = () => {
    setIsFloating(false);
  };

  const floatStyle = isFloating ? {
    animation: `float-text 4s ease-in-out infinite`,
    transform: `translateY(-${floatIntensity}px)`
  } : {};

  return { floatStyle, startFloat, stopFloat, isFloating };
}; 