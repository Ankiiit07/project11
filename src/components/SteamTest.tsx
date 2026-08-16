import React from 'react';
import SteamEffect from './SteamEffect';

const SteamTest: React.FC = () => {
  return (
    <div className="p-8 bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="relative bg-amber-800 w-32 h-32 rounded-full flex items-center justify-center">
        <div className="text-white text-2xl">☕</div>
        
        {/* Test steam effect */}
        <SteamEffect 
          intensity="heavy" 
          size="large"
          color="rgba(255, 255, 255, 0.9)"
        />
      </div>
    </div>
  );
};

export default SteamTest; 