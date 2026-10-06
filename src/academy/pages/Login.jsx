import React, { useState } from 'react';
import { useAcademyAuth } from '../context/AcademyAuthContext';
import { GraduationCap, ArrowRight, Lock, Mail, AlertCircle, Shield } from 'lucide-react';

export const Login = ({ onNavigate }) => {
  const { login } = useAcademyAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await login(email, password);
      if (res.user?.role === 'admin') {
        onNavigate('ADMIN_DASHBOARD');
      } else {
        onNavigate('DASHBOARD');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto', padding: '0 1rem' }}>
      <div className="glass-panel" style={{
        padding: '2.5rem',
        borderRadius: '20px',
        border: '1px solid rgba(214, 188, 102, 0.35)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
      }}>
        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #051454 0%, #000b3d 100%)',
            border: '2px solid #d6bc66',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <GraduationCap size={30} color="#d6bc66" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#FFF', fontFamily: "'Outfit', sans-serif" }}>
            LMS Portal Login
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
            Access your football coaching curriculum & certificates
          </p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #EF4444',
            color: '#FCA5A5',
            fontSize: '0.82rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '6px' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coach@example.com"
                className="form-control"
                required
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#CBD5E1' }}>
                PASSWORD
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-control"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-gold"
            style={{ width: '100%', padding: '12px', marginTop: '0.5rem', fontSize: '0.88rem' }}
          >
            <span>{submitting ? 'AUTHENTICATING...' : 'SIGN IN TO PORTAL'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#94A3B8'
        }}>
          Don't have an academy student account yet?{' '}
          <button
            onClick={() => onNavigate('REGISTER')}
            style={{ color: '#d6bc66', fontWeight: '800', textDecoration: 'underline' }}
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
