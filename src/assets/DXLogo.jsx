import React from 'react';
import dxLogo from '../assets/WhatsApp Image 2026-09-12 at 1.50.36 AM.jpeg';

/**
 * DX Sport Logo Component
 * Uses the existing logo image from the assets folder.
 */
export const DXLogo = ({
  height = 150,
  className = '',
  showText = false,
}) => {
  return (
    <div
      className={`dx-brand-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <img
        src={dxLogo}
        alt="DX Sport Logo"
        style={{
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          marginLeft: '100px',
        }}
      />

      {showText && (
        <span
          style={{
            marginLeft: '10px',
            fontSize: `${height * 0.45}px`,
            fontWeight: '900',
            fontFamily: "'Outfit', sans-serif",
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
          }}
        >
          DX Sport
        </span>
      )}
    </div>
  );
};

export default DXLogo;
