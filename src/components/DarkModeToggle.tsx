import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative p-2 rounded-lg transition-all duration-300 ease-out group overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      style={{ color: '#8B7355' }}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <span className="relative z-10">
        {isDarkMode ? (
          <Sun className="h-5 w-5 transition-all duration-300 group-hover:scale-105 group-hover:text-[#F5F1EB]" />
        ) : (
          <Moon className="h-5 w-5 transition-all duration-300 group-hover:scale-105 group-hover:text-[#F5F1EB]" />
        )}
      </span>
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-all duration-300 ease-out rounded-lg"
        style={{
          backgroundColor: '#8B7355',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />
    </button>
  );
};

export default DarkModeToggle; 