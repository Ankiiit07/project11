// Adapted from React Bits (reactbits.dev) — ShinyText.
// A soft light sweeps across the text every few seconds (CSS only).
import React from 'react';

const ShinyText: React.FC<{ text: string; className?: string; speed?: number }> = ({ text, className = '', speed = 4 }) => (
  <span className={`shiny-text ${className}`} style={{ animationDuration: `${speed}s` }}>
    {text}
  </span>
);

export default ShinyText;
