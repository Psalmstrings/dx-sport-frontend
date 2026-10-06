import React, { useState, useEffect } from 'react';
import { useAcademyAuth } from '../context/AcademyAuthContext';
import ElearningAPI from '../../services/elearningApi';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Award,
  Shield,
  Bell,
  LogOut,
  User,
  Menu,
  X,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';

export const AcademyNavbar = ({ currentView, onNavigate, onBackToSports }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAcademyAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      ElearningAPI.getNotifications()
        .then(res => {
          if (res.success) {
            setNotifications(res.notifications || []);
            setUnreadCount(res.unreadCount || 0);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, currentView]);

  const handleMarkAllRead = async () => {
    try {
      await ElearningAPI.markAllNotificationsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const navItems = [
    { id: 'LANDING', label: 'ACADEMY HOME', icon: GraduationCap },
    { id: 'PROGRAMS', label: 'PROGRAMS', icon: BookOpen },
    ...(isAuthenticated ? [
      { id: 'DASHBOARD', label: 'MY LEARNING', icon: User },
      { id: 'APPLICATIONS', label: 'APPLICATIONS', icon: FileText },
      { id: 'CERTIFICATES', label: 'CERTIFICATES', icon: Award }
    ] : []),
    ...(isAdmin ? [
      { id: 'ADMIN_DASHBOARD', label: 'ADMIN PORTAL', icon: Shield, badge: 'STAFF' }
    ] : [])
  ];

  return (
    <header style={{
      width: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(0, 11, 61, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '2px solid rgba(214, 188, 102, 0.35)',
      boxShadow: '0 4px 25px rgba(0,0,0,0.7)'
    }}>
      {/* Top Banner Notice */}
      

      {/* Main Academy Header Bar */}
      <div style={{
        maxWidth: '1340px',
        margin: '0 auto',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo & Title */}
        <div
          onClick={() => onNavigate('LANDING')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #051454 0%, #000b3d 100%)',
            border: '2px solid #d6bc66',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(214,188,102,0.3)'
          }}>
            <GraduationCap size={24} color="#d6bc66" />
          </div>
          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '900',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.04em',
              color: '#FFF',
              lineHeight: 1.1
            }}>
              DX <span style={{ color: '#d6bc66' }}>ACADEMY</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: '700', letterSpacing: '0.05em' }}>
              FOOTBALL EDUCATION LMS
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '6px' }} className="desktop-nav-items">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'ADMIN_DASHBOARD' && currentView.startsWith('ADMIN_'));
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: isActive ? '#000b3d' : '#CBD5E1',
                  background: isActive ? '#d6bc66' : 'transparent',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <Icon size={16} color={isActive ? '#000b3d' : '#d6bc66'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.62rem',
                    background: '#EF4444',
                    color: '#FFF',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontWeight: '900'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Auth & Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    position: 'relative',
                    padding: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bell size={18} color="#d6bc66" />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#EF4444',
                      color: '#FFF',
                      fontSize: '0.65rem',
                      fontWeight: '900',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: '45px',
                    right: 0,
                    width: '320px',
                    maxHeight: '380px',
                    overflowY: 'auto',
                    background: '#051454',
                    border: '1px solid #d6bc66',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                    zIndex: 2000,
                    padding: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: '900', fontSize: '0.85rem', color: '#FFF' }}>NOTIFICATIONS</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          style={{ fontSize: '0.72rem', color: '#d6bc66', fontWeight: '700' }}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ color: '#94A3B8', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
                        No notifications yet.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {notifications.map(n => (
                          <div
                            key={n._id}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '6px',
                              background: n.isRead ? 'rgba(255,255,255,0.03)' : 'rgba(214,188,102,0.12)',
                              borderLeft: n.isRead ? '2px solid transparent' : '3px solid #d6bc66'
                            }}
                          >
                            <div style={{ fontWeight: '800', fontSize: '0.78rem', color: '#FFF' }}>{n.title}</div>
                            <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '2px' }}>{n.message}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Avatar & Menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: 'rgba(5, 20, 84, 0.8)',
                    border: '1px solid rgba(214, 188, 102, 0.3)',
                    borderRadius: '8px',
                    color: '#FFF'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#d6bc66',
                    color: '#000b3d',
                    fontWeight: '900',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem'
                  }}>
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '800', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown size={14} color="#d6bc66" />
                </button>

                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '45px',
                    right: 0,
                    width: '180px',
                    background: '#051454',
                    border: '1px solid rgba(214, 188, 102, 0.4)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.8)',
                    padding: '6px',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <button
                      onClick={() => { setShowUserMenu(false); onNavigate('DASHBOARD'); }}
                      style={{ padding: '8px', textAlign: 'left', fontSize: '0.8rem', color: '#FFF', fontWeight: '700', borderRadius: '4px' }}
                    >
                      Student Portal
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { setShowUserMenu(false); onNavigate('ADMIN_DASHBOARD'); }}
                        style={{ padding: '8px', textAlign: 'left', fontSize: '0.8rem', color: '#d6bc66', fontWeight: '800', borderRadius: '4px' }}
                      >
                        Admin Control
                      </button>
                    )}
                    <button
                      onClick={() => { setShowUserMenu(false); logout(); onNavigate('LANDING'); }}
                      style={{ padding: '8px', textAlign: 'left', fontSize: '0.8rem', color: '#EF4444', fontWeight: '700', borderRadius: '4px', borderTop: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => onNavigate('LOGIN')}
                className="btn-outline-gold"
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              >
                LOGIN
              </button>
              <button
                onClick={() => onNavigate('REGISTER')}
                className="btn-gold"
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              >
                ENROLL
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'flex', color: '#FFF', padding: '6px' }}
            className="mobile-hamburger"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: '#000726',
          borderTop: '1px solid rgba(214, 188, 102, 0.25)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setMobileMenuOpen(false); onNavigate(item.id); }}
              style={{
                padding: '10px 14px',
                textAlign: 'left',
                borderRadius: '6px',
                fontWeight: '800',
                fontSize: '0.9rem',
                color: currentView === item.id ? '#000b3d' : '#FFF',
                background: currentView === item.id ? '#d6bc66' : 'rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: '0.65rem', background: '#EF4444', color: '#FFF', padding: '1px 6px', borderRadius: '4px' }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => { setMobileMenuOpen(false); onBackToSports(); }}
            style={{
              padding: '10px 14px',
              textAlign: 'left',
              borderRadius: '6px',
              fontWeight: '800',
              fontSize: '0.85rem',
              color: '#d6bc66',
              background: 'rgba(5, 20, 84, 0.8)',
              marginTop: '8px'
            }}
          >
            ← Back to DX Sports News & Live Scores
          </button>
        </div>
      )}

      {/* Inline CSS for desktop / mobile view toggling */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-items { display: flex !important; }
          .mobile-hamburger { display: none !important; }
        }
        @media (max-width: 899px) {
          .desktop-nav-items { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default AcademyNavbar;
