import React, { useState } from 'react';
import { useAcademyAuth } from '../context/AcademyAuthContext';
import { GraduationCap, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export const Register = ({ onNavigate }) => {
  const { register } = useAcademyAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    country: 'Nigeria',
    state: '',
    footballExperience: '',
    coachingExperience: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await register(formData);
      setSuccess('Account created successfully! Redirecting to student dashboard...');
      setTimeout(() => {
        onNavigate('DASHBOARD');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '560px', margin: '2rem auto', padding: '0 1rem' }}>
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
            Student Enrollment Registration
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
            Create your profile to apply for certified coaching programs
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

        {success && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10B981',
            color: '#6EE7B7',
            fontSize: '0.82rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle size={16} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '6px' }}>
              FULL NAME *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Austin Eguavoen"
              className="form-control"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '6px' }}>
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="coach@example.com"
                className="form-control"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '6px' }}>
                PHONE NUMBER *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+234 801 234 5678"
                className="form-control"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '6px' }}>
                COUNTRY
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Nigeria"
                className="form-control"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '6px' }}>
                STATE / REGION
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Lagos, FCT, etc."
                className="form-control"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '6px' }}>
              FOOTBALL / COACHING BACKGROUND (OPTIONAL)
            </label>
            <input
              type="text"
              name="coachingExperience"
              value={formData.coachingExperience}
              onChange={handleChange}
              placeholder="e.g. Grassroots academy coach, PE teacher, former player"
              className="form-control"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '6px' }}>
                PASSWORD *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="form-control"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '6px' }}>
                CONFIRM PASSWORD *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="form-control"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-gold"
            style={{ width: '100%', padding: '13px', marginTop: '0.5rem', fontSize: '0.9rem' }}
          >
            <span>{submitting ? 'CREATING STUDENT ACCOUNT...' : 'COMPLETE REGISTRATION'}</span>
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
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('LOGIN')}
            style={{ color: '#d6bc66', fontWeight: '800', textDecoration: 'underline' }}
          >
            Log In Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
