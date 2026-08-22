import React, { useState } from 'react';
import DXLogo from '../assets/DXLogo';
import { Mail, Lock, LogIn, X, Shield, AlertCircle } from 'lucide-react';
import { API } from '../services/api';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@elitesport.ng');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await API.login(email, password);
    setLoading(false);

    if (res.success) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 12, 27, 0.92)',
      backdropFilter: 'blur(10px)',
      zIndex: 3000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(230, 198, 87, 0.3)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: '#FFF',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '50%',
            padding: '6px',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* 1. TOP HEADER SECTION (Dark Navy with Logo & Welcome Text) */}
        <div style={{
          backgroundColor: '#0E223D',
          padding: '2.5rem 2rem 2rem 2rem',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <DXLogo height={56} showText={false} />
          </div>

          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#FFF',
            marginBottom: '0.35rem'
          }}>
            Welcome Back
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>
            Login to access your dashboard
          </p>
        </div>

        {/* 2. FORM BODY SECTION (Sleek Clean White/Dark Container) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '2rem',
          color: '#0B1A3A'
        }}>
          {error && (
            <div style={{
              background: '#FEE2E2',
              border: '1px solid #F87171',
              color: '#991B1B',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Address */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#1E293B',
                marginBottom: '0.5rem'
              }}>
                ✉ Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@elitesport.ng"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    color: '#0F172A',
                    outline: 'none',
                    fontWeight: '500'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#1E293B',
                marginBottom: '0.5rem'
              }}>
                🔒 Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    color: '#0F172A',
                    outline: 'none',
                    fontWeight: '500'
                  }}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#0B1A3A',
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(11, 26, 58, 0.4)',
                transition: 'all 0.2s'
              }}
            >
              <LogIn size={20} />
              <span>{loading ? 'Logging in...' : '➔] Login'}</span>
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div style={{
            marginTop: '1.25rem',
            textAlign: 'center',
            fontSize: '0.78rem',
            color: '#64748B',
            borderTop: '1px solid #E2E8F0',
            paddingTop: '1rem'
          }}>
            Demo Admin: <b>admin@elitesport.ng</b> | Password: <b>admin123</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
