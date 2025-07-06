import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark/light mode"
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 1000,
        background: 'var(--card-bg)',
        border: 'none',
        borderRadius: '50%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
    >
      {theme === 'dark' ? <Sun size={22} color="#fbbf24" /> : <Moon size={22} color="#6366f1" />}
    </button>
  );
};

export default ThemeToggle;
