import React from 'react';
import dxLogo from '../assets/Untitled_design__2_-removebg-preview.png';

/**
 * DX Sport Logo Component
 * Uses the existing logo image from the assets folder.
 */
export const DXLogo = ({
  height = 250,
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
