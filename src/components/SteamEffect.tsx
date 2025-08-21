import React from 'react';
import { useDevice } from '../hooks/useDevice';

interface SteamEffectProps {
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

const SteamEffect: React.FC<SteamEffectProps> = ({
  className = '',
  intensity = 'medium',
  color = 'rgba(255, 255, 255, 0.8)',
  size = 'medium'
}) => {
  const { isMobile } = useDevice();
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On mobile or reduced motion, tone down or skip heavy effect
  const effectiveIntensity: 'light' | 'medium' = isMobile ? 'light' : (intensity === 'heavy' ? 'medium' : intensity);

  if (isMobile && prefersReducedMotion) {
    return null;
  }

  const getParticleCount = () => {
    switch (effectiveIntensity) {
      case 'light': return 2;
      case 'medium': return 4;
      default: return 4;
    }
  };

  const particles = Array.from({ length: getParticleCount() }, (_, i) => i);

  return (
    <div className={`steam-container ${className}`}>
      {particles.map((_, index) => (
        <div
          key={index}
          className="steam-particle"
          style={{
            background: `radial-gradient(circle, ${color} 0%, ${color.replace('0.8', '0.4')} 50%, transparent 100%)`,
            left: `${Math.random() * 60 + 20}%`,
            animationDelay: `${index * 0.2}s`,
            animationDuration: `${2.5 + Math.random() * 1}s`
          }}
        />
      ))}
    </div>
  );
};

export default SteamEffect; 