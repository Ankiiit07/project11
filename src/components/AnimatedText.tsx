import React from 'react';
import { useTextAnimation, useTypewriter, useWaveText, useGradientText } from '../hooks/useTextAnimation';

interface AnimatedTextProps {
  children: string;
  animationType?: 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'typewriter' | 'reveal' | 'stagger' | 'float' | 'gradient' | 'glow' | 'bounce' | 'shake' | 'pulse' | 'wave' | 'flip';
  delay?: number;
  duration?: number;
  className?: string;
  typewriterSpeed?: number;
  gradientColors?: string[];
  waveTrigger?: boolean;
  onAnimationComplete?: () => void;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  animationType = 'fade-in',
  delay = 0,
  duration = 0.6,
  className = '',
  typewriterSpeed = 80,
  gradientColors = ['#8B7355', '#b7e6b9', '#c9a876', '#d4b896'],
  waveTrigger = false,
  onAnimationComplete
}) => {
  const textAnimation = useTextAnimation<HTMLDivElement>({
    animationType,
    delay,
    duration,
    triggerOnce: true
  });

  const { displayText: typewriterText, isComplete } = useTypewriter(children, typewriterSpeed);
  const { getWaveText, startWave } = useWaveText(children);
  const { gradientStyle } = useGradientText(children, gradientColors);

  React.useEffect(() => {
    if (waveTrigger) {
      startWave();
    }
  }, [waveTrigger, startWave]);

  React.useEffect(() => {
    if (isComplete && onAnimationComplete) {
      onAnimationComplete();
    }
  }, [isComplete, onAnimationComplete]);

  const getContent = () => {
    switch (animationType) {
      case 'typewriter':
        return typewriterText;
      case 'wave':
        return getWaveText().map((item, index) => (
          <span
            key={index}
            className={item.className}
            style={item.style}
          >
            {item.char}
          </span>
        ));
      case 'gradient':
        return <span style={gradientStyle}>{children}</span>;
      default:
        return children;
    }
  };

  const getAnimationClasses = () => {
    const baseClasses = [className];
    
    if (textAnimation.isVisible) {
      baseClasses.push(textAnimation.animationClass);
    }

    // Add specific animation classes
    switch (animationType) {
      case 'glow':
        baseClasses.push('glow-text');
        break;
      case 'pulse':
        baseClasses.push('pulse-text');
        break;
      case 'bounce':
        baseClasses.push('bounce-text');
        break;
      case 'shake':
        baseClasses.push('shake-text');
        break;
      case 'float':
        baseClasses.push('float-text');
        break;
      case 'reveal':
        baseClasses.push('text-reveal');
        break;
    }

    return baseClasses.filter(Boolean).join(' ');
  };

  return (
    <div
      ref={textAnimation.elementRef}
      className={getAnimationClasses()}
      style={{
        // Mobile-specific fixes for typewriter effect
        wordBreak: animationType === 'typewriter' ? 'break-word' : 'normal',
        overflowWrap: animationType === 'typewriter' ? 'break-word' : 'normal',
        hyphens: animationType === 'typewriter' ? 'auto' : 'manual',
        // Prevent horizontal overflow on mobile
        maxWidth: '100%',
        overflow: 'hidden'
      }}
    >
      {getContent()}
    </div>
  );
};

// Specialized components for common use cases
export const TypewriterText: React.FC<Omit<AnimatedTextProps, 'animationType'> & { speed?: number }> = ({ speed = 80, ...props }) => (
  <AnimatedText {...props} animationType="typewriter" typewriterSpeed={speed} />
);

export const GradientText: React.FC<Omit<AnimatedTextProps, 'animationType'> & { colors?: string[] }> = ({ colors, ...props }) => (
  <AnimatedText {...props} animationType="gradient" gradientColors={colors} />
);

export const GlowText: React.FC<Omit<AnimatedTextProps, 'animationType'>> = (props) => (
  <AnimatedText {...props} animationType="glow" />
);

export const PulseText: React.FC<Omit<AnimatedTextProps, 'animationType'>> = (props) => (
  <AnimatedText {...props} animationType="pulse" />
);

export const FloatText: React.FC<Omit<AnimatedTextProps, 'animationType'>> = (props) => (
  <AnimatedText {...props} animationType="float" />
);

export const RevealText: React.FC<Omit<AnimatedTextProps, 'animationType'>> = (props) => (
  <AnimatedText {...props} animationType="reveal" />
);

export const WaveText: React.FC<Omit<AnimatedTextProps, 'animationType'> & { trigger?: boolean }> = ({ trigger = false, ...props }) => (
  <AnimatedText {...props} animationType="wave" waveTrigger={trigger} />
);

export default AnimatedText; 