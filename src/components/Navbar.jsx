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
    { id: 'FEATURES', label: 'FEATURES & TABLE' }
  ];

  const handleNavClick = (catId) => {
    setActiveCategory(catId);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
      {/* 1. TOP BRAND HEADER BAR (Dark Purple #000b3d as in PDF screenshot!) */}
      <div style={{
        backgroundColor: '#000b3d',
        borderBottom: '1px solid rgba(214, 188, 102, 0.25)',
        padding: '0.65rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left: DX SPORTS Logo */}
        <div 
          onClick={() => handleNavClick('HOME')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <DXLogo height={44} showText={true} />
        </div>

        {/* Center: Live Time / Search */}
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

        {/* Right: Search, User Profile, 3-dots Menu (Matching Prototype PDF!) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
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

          {/* Mobile Hamburger Toggle */}
          <button 
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              color: '#d6bc66',
              padding: '6px',
              display: 'none'
            }}
          >
            {mobileMenuOpen ? <X size={26} color="#d6bc66" /> : <Menu size={26} color="#d6bc66" />}
          </button>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION BAR (Gray Yellow #d6bc66 as in PDF screenshot!) */}
      <nav style={{
        backgroundColor: '#d6bc66',
        borderBottom: '3px solid #E63946',
        padding: '0 1.25rem',
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
                  padding: '10px 16px',
                  fontWeight: '900',
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em',
                  color: '#000b3d',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  background: isActive ? 'rgba(0, 11, 61, 0.12)' : 'transparent',
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
                    backgroundColor: '#E63946',
                    borderRadius: '2px 2px 0 0'
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '105px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 11, 61, 0.96)',
          backdropFilter: 'blur(10px)',
          zIndex: 999,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ position: 'relative', width: '100%', marginBottom: '0.5rem' }}>
            <input 
              type="text" 
              placeholder="Search news, NPFL, scores..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(214, 188, 102, 0.3)',
                borderRadius: '8px',
                color: '#FFF',
                fontSize: '1rem'
              }}
            />
            <Search size={18} color="#d6bc66" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleNavClick(cat.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 18px',
                  borderRadius: '8px',
                  fontWeight: '900',
                  fontSize: '1rem',
                  color: activeCategory === cat.id ? '#000b3d' : '#FFF',
                  background: activeCategory === cat.id ? 'var(--gold-gray-yellow)' : 'rgba(5, 20, 84, 0.8)',
                  border: activeCategory === cat.id ? 'none' : '1px solid rgba(255,255,255,0.08)'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {!user && (
            <button 
              onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
              className="btn-gold"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              <User size={18} />
              <span>LOGIN TO PORTAL</span>
            </button>
          )}
        </div>
      )}

      {/* Inline Responsive Rule */}
      <style>{`
        @media (max-width: 850px) {
          .desktop-header-center { display: none !important; }
          .mobile-hamburger-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
