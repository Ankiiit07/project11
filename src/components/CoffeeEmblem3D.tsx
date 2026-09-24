import React, { useEffect, useRef } from 'react';

interface CoffeeEmblem3DProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const CoffeeEmblem3D: React.FC<CoffeeEmblem3DProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const emblemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const emblem = emblemRef.current;
    if (!emblem) return;

    let animationId: number;
    let rotationX = 0;
    let rotationY = 0;

    const animate = () => {
      rotationX += 0.5;
      rotationY += 0.3;
      
      emblem.style.transform = `
        perspective(1000px) 
        rotateX(${rotationX}deg) 
        rotateY(${rotationY}deg)
        translateZ(0)
      `;
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!emblem) return;
      
      const rect = emblem.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / rect.height) * -20;
      const rotateY = (mouseX / rect.width) * 20;
      
      emblem.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
        translateZ(20px)
      `;
    };

    const handleMouseLeave = () => {
      if (!emblem) return;
      emblem.style.transform = `
        perspective(1000px) 
        rotateX(0deg) 
        rotateY(0deg)
        translateZ(0)
      `;
    };

    emblem.addEventListener('mousemove', handleMouseMove);
    emblem.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      emblem.removeEventListener('mousemove', handleMouseMove);
      emblem.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  return (
    <div 
      ref={emblemRef}
      className={`${sizeClasses[size]} ${className} relative transform-style-preserve-3d transition-transform duration-300 ease-out`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Modern coffee cup - minimalist design */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#8B7355] via-[#7a6449] to-[#6b5a3f] rounded-full shadow-2xl"
        style={{
          transform: 'translateZ(0px)',
          background: 'radial-gradient(circle at 30% 30%, #8B7355, #7a6449, #6b5a3f)',
          boxShadow: '0 8px 25px rgba(139, 115, 85, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.1)'
        }}
      />
      
      {/* Cup rim */}
      <div 
        className="absolute inset-2 bg-gradient-to-br from-[#9b8a6a] to-[#8B7355] rounded-full"
        style={{
          transform: 'translateZ(2px)',
          background: 'radial-gradient(circle at 40% 40%, #9b8a6a, #8B7355, #7a6449)',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
        }}
      />
      
      {/* Coffee liquid */}
      <div 
        className="absolute inset-3 bg-gradient-to-br from-[#5d4e3a] to-[#4a3f2f] rounded-full"
        style={{
          transform: 'translateZ(4px)',
          background: 'radial-gradient(circle at 35% 35%, #5d4e3a, #4a3f2f, #3a3125)',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)'
        }}
      />
      
      {/* Subtle steam effect */}
      <div 
        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-3 bg-gradient-to-t from-transparent via-white/20 to-transparent rounded-full"
        style={{
          transform: 'translateZ(6px) translateX(-50%)',
          animation: 'steam-rise-3d 3s ease-out infinite'
        }}
      />
      
      {/* Modern handle */}
      <div 
        className="absolute top-1/2 -right-1 w-2.5 h-6 bg-gradient-to-br from-[#8B7355] to-[#7a6449] rounded-l-full"
        style={{
          transform: 'translateZ(8px) translateY(-50%)',
          background: 'linear-gradient(90deg, #8B7355, #7a6449)',
          boxShadow: '1px 0 3px rgba(0, 0, 0, 0.1)'
        }}
      />
      
      {/* Coffee bean accent */}
      <div 
        className="absolute top-1/3 left-1/3 w-1.5 h-2 bg-gradient-to-br from-[#4a3f2f] to-[#3a3125] rounded-full"
        style={{
          transform: 'translateZ(10px) rotate(45deg)',
          background: 'radial-gradient(ellipse at 30% 30%, #4a3f2f, #3a3125)',
          boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.2)'
        }}
      />
      
      {/* Subtle shine */}
      <div 
        className="absolute top-1.5 left-1.5 w-3 h-3 bg-gradient-to-br from-white/30 to-transparent rounded-full"
        style={{
          transform: 'translateZ(12px)',
          filter: 'blur(0.5px)'
        }}
      />
      
      {/* Soft ambient glow */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/15 to-transparent rounded-full"
        style={{
          transform: 'translateZ(-2px)',
          filter: 'blur(6px)'
        }}
      />
      
      {/* "@once" brand overlay */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-white"
        style={{
          transform: 'translateZ(15px)',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}
      >
        <span className="text-[8px] font-bold tracking-wider">@once</span>
        <span className="text-[6px] font-medium opacity-80">COFFEE</span>
      </div>
    </div>
  );
};

export default CoffeeEmblem3D; 