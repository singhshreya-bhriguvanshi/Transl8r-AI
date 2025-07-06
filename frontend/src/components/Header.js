import React from 'react';

const Header = () => {
  return (
    <header style={{ width: '100%', padding: '2rem 0', textAlign: 'center' }}>
      <h1
        style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#a259ff',
          textShadow: '0 0 8pxrgb(95, 6, 210), 0 0 16px #a259ff99',
          letterSpacing: '1px',
          margin: 0,
        }}
      >
        Transl8r - AI Powered Translation
      </h1>
    </header>
  );
};

export default Header; 