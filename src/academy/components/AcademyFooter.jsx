import React from 'react';
import { GraduationCap, Mail, Phone, ArrowLeft, BookOpen, Award, Shield } from 'lucide-react';

const AcademyFooter = ({ onNavigate, onBackToSports }) => {
  const currentYear = new Date().getFullYear();

  const linkStyle = {
    color: '#94A3B8',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.2s',
    textDecoration: 'none',
    display: 'block',
    paddingBottom: '6px',
  };

  const headingStyle = {
    color: '#d6bc66',
    fontSize: '0.72rem',
    fontWeight: '900',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(214, 188, 102, 0.2)',
    paddingBottom: '6px',
  };

  const handleNav = (view) => {
    if (onNavigate) onNavigate(view);
  };

  return (
    <footer style={{
      backgroundColor: '#000726',
      borderTop: '2px solid rgba(214, 188, 102, 0.35)',
      marginTop: 'auto',
    }}>
      {/* Main Footer Grid */}
      <div style={{
        maxWidth: '1340px',
        margin: '0 auto',
        padding: '3rem 1.5rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2.5rem',
      }}>

        {/* Brand Column */}
        <div style={{ gridColumn: 'span 1' }}>
          <div
            onClick={() => handleNav('LANDING')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', cursor: 'pointer' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #051454 0%, #000b3d 100%)',
              border: '2px solid #d6bc66',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <GraduationCap size={22} color="#d6bc66" />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#FFF', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                DX <span style={{ color: '#d6bc66' }}>ACADEMY</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '700', letterSpacing: '0.05em' }}>
                FOOTBALL EDUCATION LMS
              </div>
            </div>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.82rem', lineHeight: 1.7, margin: 0 }}>
            Empowering the next generation of football coaches, analysts, and professionals through world-class education and certification.
          </p>
          {/* Contact */}
          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a
              href="mailto:academy@dxsportz.com"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none' }}
            >
              <Mail size={14} color="#d6bc66" />
              academy@dxsportz.com
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '0.8rem' }}>
              <Phone size={14} color="#d6bc66" />
              +234 800 000 0000
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div style={headingStyle}>Quick Links</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { label: 'Academy Home', view: 'LANDING' },
              { label: 'All Programs', view: 'PROGRAMS' },
              { label: 'Student Login', view: 'LOGIN' },
              { label: 'Enroll Now', view: 'REGISTER' },
              { label: 'Verify Certificate', view: 'VERIFY_CERTIFICATE' },
            ].map(({ label, view }) => (
              <span
                key={view}
                onClick={() => handleNav(view)}
                style={linkStyle}
                onMouseOver={e => e.currentTarget.style.color = '#d6bc66'}
                onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Programs */}
        <div>
          <div style={headingStyle}>Programs</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { label: '🟢 Beginner — Grassroots Coaching', view: 'PROGRAMS' },
              { label: '🟡 Intermediate — Tactical Periodization', view: 'PROGRAMS' },
              { label: '🔴 Professional — Football Management', view: 'PROGRAMS' },
              { label: '🏆 Certification & Awards', view: 'CERTIFICATES' },
            ].map(({ label, view }, i) => (
              <span
                key={i}
                onClick={() => handleNav(view)}
                style={linkStyle}
                onMouseOver={e => e.currentTarget.style.color = '#d6bc66'}
                onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <div style={headingStyle}>Support</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <a href="mailto:academy@dxsportz.com" style={{ ...linkStyle, textDecoration: 'none' }}
              onMouseOver={e => e.currentTarget.style.color = '#d6bc66'}
              onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}
            >
              Contact Support
            </a>
            <span
              style={linkStyle}
              onClick={() => handleNav('LANDING')}
              onMouseOver={e => e.currentTarget.style.color = '#d6bc66'}
              onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}
            >
              How It Works
            </span>
            <span
              style={linkStyle}
              onClick={() => handleNav('LANDING')}
              onMouseOver={e => e.currentTarget.style.color = '#d6bc66'}
              onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}
            >
              FAQ
            </span>
            <a href="mailto:dxsportsofficial@gmail.com" style={{ ...linkStyle, textDecoration: 'none' }}
              onMouseOver={e => e.currentTarget.style.color = '#d6bc66'}
              onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}
            >
              General Enquiries
            </a>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <div style={headingStyle}>Legal</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {['Privacy Policy', 'Terms & Conditions', 'Student Terms', 'Certification Policy'].map(label => (
                <span
                  key={label}
                  style={linkStyle}
                  onMouseOver={e => e.currentTarget.style.color = '#d6bc66'}
                  onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        maxWidth: '1340px',
        margin: '0 auto',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Copyright */}
        <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>
          © {currentYear}{' '}
          <span style={{ color: '#d6bc66', fontWeight: '800' }}>DX Academy</span>
          {' '}· Football Education & Professional Development · All rights reserved.
        </div>

        {/* Return to Main Website */}
        <button
          onClick={onBackToSports}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            background: 'rgba(214, 188, 102, 0.1)',
            border: '1px solid rgba(214, 188, 102, 0.4)',
            borderRadius: '20px',
            color: '#d6bc66',
            fontSize: '0.8rem',
            fontWeight: '800',
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.03em',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#d6bc66';
            e.currentTarget.style.color = '#000b3d';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'rgba(214, 188, 102, 0.1)';
            e.currentTarget.style.color = '#d6bc66';
          }}
        >
          <ArrowLeft size={14} />
          ← Back to DX Sports &amp; News
        </button>
      </div>
    </footer>
  );
};

export default AcademyFooter;
