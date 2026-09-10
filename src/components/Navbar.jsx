import React, { useState, useEffect } from 'react';
import DXLogo from '../assets/DXLogo';
import { Search, Menu, X, User, LogOut, MoreVertical, Calendar } from 'lucide-react';

export const Navbar = ({ activeCategory, setActiveCategory, onOpenLogin, user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navCategories = [
    { id: 'HOME', label: 'HOME' },
    { id: 'NEWS', label: 'NEWS PAGE' },
    { id: 'MEDIA', label: 'MEDIA PAGE' },
    { id: 'FEATURES', label: 'FIXTURES & TABLE' }
  ];

  const handleNavClick = (catId) => {
    setActiveCategory(catId);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
      {/* 1. TOP BRAND HEADER BAR */}
      <div style={{
        backgroundColor: '#000b3d',
        borderBottom: '1px solid rgba(214, 188, 102, 0.25)',
        padding: '0.6rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '60px'
      }}>
        {/* Left: DX SPORTS Logo */}
        <div 
          onClick={() => handleNavClick('HOME')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <DXLogo height={70} showText={true} />
        </div>

        {/* Center: Live Time & Search (Desktop Only) */}
        <div className="desktop-header-center" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(5, 20, 84, 0.8)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(214, 188, 102, 0.3)',
            color: '#d6bc66',
            fontSize: '0.825rem',
            fontWeight: '700'
          }}>
            <Calendar size={14} color="#d6bc66" />
            <span>{currentTime || 'LIVE SPORTS'}</span>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <input 
              type="text" 
              placeholder="Search news, teams, scores..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 34px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(214, 188, 102, 0.25)',
                borderRadius: '20px',
                color: '#FFF',
                fontSize: '0.85rem'
              }}
            />
            <Search size={16} color="#d6bc66" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {/* Right Controls (Desktop Only) */}
        <div className="desktop-header-right" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'var(--gold-gray-yellow)',
                color: '#000b3d',
                fontWeight: '900',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <User size={14} />
                <span>{user.name || 'Admin'}</span>
              </div>
              <button 
                onClick={onLogout}
                title="Logout"
                style={{
                  color: '#d6bc66',
                  padding: '6px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenLogin}
              style={{
                background: 'transparent',
                color: '#FFF',
                border: '1px solid #d6bc66',
                padding: '6px 16px',
                borderRadius: '20px',
                fontWeight: '800',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <User size={15} color="#d6bc66" />
              <span>LOGIN</span>
            </button>
          )}

          <button title="More" style={{ color: '#d6bc66', padding: '4px' }}>
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button (Displayed ONLY on mobile) */}
        <button 
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            color: '#d6bc66',
            padding: '8px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(214, 188, 102, 0.3)',
            minHeight: '44px',
            minWidth: '44px'
          }}
        >
          {mobileMenuOpen ? <X size={26} color="#d6bc66" /> : <Menu size={26} color="#d6bc66" />}
        </button>
      </div>

      {/* 2. SUB-NAVIGATION BAR (Desktop Only) */}
      <nav className="desktop-subnav" style={{
        backgroundColor: '#d6bc66',
        borderBottom: '3px solid #FFFFFF',
        padding: '0 1rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <div className="subnav-container" style={{
          maxWidth: '1340px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto'
        }}>
          {navCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleNavClick(cat.id)}
                style={{
                  padding: '12px 18px',
                  minHeight: '44px',
                  fontWeight: '900',
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em',
                  color: '#000b3d',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  background: isActive ? 'rgba(0, 11, 61, 0.14)' : 'transparent',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {cat.label}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '2px 2px 0 0'
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. MOBILE MENU DRAWER (Opened via Hamburger) */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 11, 61, 0.98)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: 999,
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          overflowY: 'auto'
        }}>
          {/* Live Clock / Date Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(5, 20, 84, 0.8)',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(214, 188, 102, 0.3)',
            color: '#d6bc66',
            fontSize: '0.85rem',
            fontWeight: '800'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#d6bc66" />
              <span>LIVE SPORTS CENTER</span>
            </div>
            <span>{currentTime}</span>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              type="text" 
              placeholder="Search news, NPFL, scores..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(214, 188, 102, 0.3)',
                borderRadius: '10px',
                color: '#FFF',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <Search size={18} color="#d6bc66" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Navigation Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              NAVIGATION MENU
            </div>
            {navCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleNavClick(cat.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 18px',
                  minHeight: '48px',
                  borderRadius: '10px',
                  fontWeight: '900',
                  fontSize: '1.05rem',
                  color: activeCategory === cat.id ? '#000b3d' : '#FFF',
                  background: activeCategory === cat.id ? 'var(--gold-gray-yellow)' : 'rgba(5, 20, 84, 0.8)',
                  border: activeCategory === cat.id ? 'none' : '1px solid rgba(255,255,255,0.08)'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* User Account / Login Section */}
          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {user ? (
              <div style={{
                background: 'rgba(5, 20, 84, 0.8)',
                border: '1px solid rgba(214, 188, 102, 0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    background: 'var(--gold-gray-yellow)',
                    color: '#000b3d',
                    fontWeight: '900',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', color: '#FFF', fontSize: '0.9rem' }}>{user.name || 'Admin'}</div>
                    <div style={{ color: '#d6bc66', fontSize: '0.75rem', fontWeight: '700' }}>{user.role?.toUpperCase()}</div>
                  </div>
                </div>

                <button 
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  style={{
                    color: '#FFF',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid #EF4444',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <LogOut size={16} />
                  <span>LOGOUT</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                className="btn-gold"
                style={{ width: '100%', minHeight: '48px' }}
              >
                <User size={18} />
                <span>LOGIN TO PORTAL</span>
              </button>
            )}
          </div>

          {/* Social Media Shortcuts */}
          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#d6bc66', marginBottom: '10px', textTransform: 'uppercase' }}>
              CONNECT WITH DX SPORT
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href="https://www.facebook.com/DXSportsbr/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#FFF',
                  padding: '10px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  minHeight: '44px'
                }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>

              <a
                href="https://x.com/DXSportsbr"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#FFF',
                  padding: '10px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  minHeight: '44px'
                }}
              >
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X</span>
              </a>

              <a
                href="https://www.youtube.com/channel/UCKTdgZGovXp1D2pdu-G7taQ"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#FFF',
                  padding: '10px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  minHeight: '44px'
                }}
              >
                <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Inline Mobile Responsive Rules */}
      <style>{`
        @media (max-width: 850px) {
          .desktop-header-center,
          .desktop-header-right,
          .desktop-subnav {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
