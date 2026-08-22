import React from 'react';

/**
 * DX Logo component rendering metallic gold shield logo based on official prototype branding.
 */
export const DXLogo = ({ height = 44, className = '', showText = true }) => {
  return (
    <div className={`dx-brand-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg 
        width={height * 1.15} 
        height={height} 
        viewBox="0 0 400 360" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="dxGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5DF98" />
            <stop offset="40%" stopColor="#d6bc66" />
            <stop offset="80%" stopColor="#C4A74F" />
            <stop offset="100%" stopColor="#8C7328" />
          </linearGradient>
          <linearGradient id="dxShieldInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000b3d" />
            <stop offset="100%" stopColor="#00051F" />
          </linearGradient>
          <filter id="dxGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#d6bc66" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Outer Shield Boundary */}
        <path 
          d="M200 20 L330 65 V190 C330 265 200 330 200 330 C200 330 70 265 70 190 V65 L200 20 Z" 
          fill="url(#dxShieldInner)" 
          stroke="url(#dxGoldGrad)" 
          strokeWidth="14" 
          strokeLinejoin="round"
          filter="url(#dxGlow)"
        />

        {/* Speed Motion Lines (Left of 'D') */}
        <g stroke="url(#dxGoldGrad)" strokeWidth="7" strokeLinecap="round">
          <line x1="45" y1="125" x2="135" y2="125" />
          <line x1="30" y1="145" x2="130" y2="145" />
          <line x1="55" y1="165" x2="125" y2="165" />
          <line x1="25" y1="185" x2="120" y2="185" />
          <line x1="50" y1="205" x2="115" y2="205" />
        </g>

        {/* Letter 'D' */}
        <path 
          d="M125 110 H175 C215 110 235 130 235 165 C235 200 215 220 175 220 H125 L140 110 Z M160 135 L150 195 H175 C195 195 205 185 205 165 C205 145 195 135 175 135 H160 Z" 
          fill="url(#dxGoldGrad)"
        />

        {/* Letter 'X' */}
        <path 
          d="M225 220 L275 165 L250 110 H285 L300 145 L350 90 L320 135 L335 145 L290 220 H250 L270 185 L245 220 H225 Z" 
          fill="url(#dxGoldGrad)"
        />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
          <div style={{ 
            fontSize: height * 0.52 + 'px', 
            fontWeight: '900', 
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '0.04em',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ 
              background: 'linear-gradient(135deg, #FFF 30%, #d6bc66 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>DX</span>
            <span style={{ color: '#d6bc66', fontWeight: '800' }}>SPORTS</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DXLogo;
