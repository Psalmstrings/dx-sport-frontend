import React, { useState, useEffect } from 'react';
import ElearningAPI from '../../services/elearningApi';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle,
  Users,
  Shield,
  ArrowRight,
  Clock,
  QrCode,
  DollarSign,
  HelpCircle,
  Play
} from 'lucide-react';

export const Landing = ({ onNavigate, onSelectProgram }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bankInfo, setBankInfo] = useState(null);

  useEffect(() => {
    Promise.all([
      ElearningAPI.getPrograms({ status: 'published' }),
      ElearningAPI.getPublicSettings()
    ])
      .then(([progRes, setRes]) => {
        if (progRes.success) setPrograms(progRes.programs || []);
        if (setRes.success && setRes.payment) setBankInfo(setRes.payment);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '3rem' }}>
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(0, 11, 61, 0.95) 0%, rgba(0, 7, 38, 0.98) 100%)',
        borderRadius: '24px',
        padding: '3.5rem 2rem',
        border: '1px solid rgba(214, 188, 102, 0.3)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
        overflow: 'hidden'
      }}>
        {/* Glow circle background */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(214,188,102,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '850px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(214,188,102,0.15)',
            border: '1px solid #d6bc66',
            padding: '6px 14px',
            borderRadius: '20px',
            color: '#d6bc66',
            fontSize: '0.78rem',
            fontWeight: '900',
            letterSpacing: '0.06em',
            marginBottom: '1.25rem'
          }}>
            <Award size={16} />
            <span>ACCREDITED FOOTBALL COACHING & TECHNICAL EDUCATION</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: '900',
            color: '#FFF',
            lineHeight: 1.15,
            fontFamily: "'Outfit', sans-serif",
            marginBottom: '1rem'
          }}>
            Elevate Your Coaching Career in <span className="text-gold-gradient">Elite Football</span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: '#CBD5E1',
            lineHeight: 1.6,
            marginBottom: '2rem',
            maxWidth: '720px'
          }}>
            From grassroots development to tactical periodization and professional scouting.
            Join West Africa's dedicated online football LMS with structured 30-day curriculum,
            verifiable digital certifications, and direct industry coaching standards.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={() => onNavigate('PROGRAMS')}
              className="btn-gold"
              style={{ padding: '14px 28px', fontSize: '0.9rem' }}
            >
              <span>EXPLORE ACCREDITED PROGRAMS</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate('REGISTER')}
              className="btn-outline-gold"
              style={{ padding: '14px 28px', fontSize: '0.9rem' }}
            >
              <span>ENROLL AS A STUDENT</span>
            </button>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#d6bc66', fontFamily: "'Outfit', sans-serif" }}>
              30 DAYS
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '700' }}>
              Full Interactive Access Period
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF', fontFamily: "'Outfit', sans-serif" }}>
              3 TIERS
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '700' }}>
              Beginner, Intermediate, Professional
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#10B981', fontFamily: "'Outfit', sans-serif" }}>
              QR VERIFIED
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '700' }}>
              Official Board Authenticated Certificates
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF', fontFamily: "'Outfit', sans-serif" }}>
              100% ONLINE
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '700' }}>
              Learn from Any Mobile Device or PC
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROGRAMS SECTION */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ width: '36px', height: '4px', backgroundColor: '#d6bc66', borderRadius: '2px', marginBottom: '8px' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
              COACHING EDUCATION PROGRAMS
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '4px' }}>
              Select a tier that matches your current football experience and aspirations.
            </p>
          </div>

          <button
            onClick={() => onNavigate('PROGRAMS')}
            className="btn-outline-gold"
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
          >
            <span>VIEW ALL ({programs.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {programs.map(prog => (
            <div
              key={prog._id}
              className="glass-panel interactive-card"
              style={{
                padding: '2rem',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid rgba(214, 188, 102, 0.25)',
                position: 'relative'
              }}
            >
              {/* Level Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '900',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  letterSpacing: '0.05em',
                  background: prog.level === 'Professional' ? 'rgba(239, 68, 68, 0.2)' : prog.level === 'Intermediate' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: prog.level === 'Professional' ? '#F87171' : prog.level === 'Intermediate' ? '#FBBF24' : '#34D399',
                  border: '1px solid currentColor'
                }}>
                  {prog.level.toUpperCase()} LEVEL
                </span>

                <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} color="#d6bc66" />
                  <span>{prog.duration}</span>
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', lineHeight: 1.3, marginBottom: '0.75rem' }}>
                  {prog.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {prog.description.length > 130 ? `${prog.description.substring(0, 130)}...` : prog.description}
                </p>

                {/* Key Objectives Preview */}
                {prog.objectives && prog.objectives.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#d6bc66', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Key Competencies:
                    </div>
                    {prog.objectives.slice(0, 2).map((obj, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '4px' }}>
                        <CheckCircle size={14} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Action */}
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: '1rem',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700' }}>TUITION FEE</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#d6bc66', fontFamily: "'Outfit', sans-serif" }}>
                    {prog.currency} {prog.price.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => onSelectProgram(prog.slug)}
                  className="btn-gold"
                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  <span>VIEW CURRICULUM</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FOUR-STEP CERTIFICATION PATHWAY */}
      <section style={{
        background: 'rgba(5, 20, 84, 0.65)',
        borderRadius: '20px',
        padding: '2.5rem',
        border: '1px solid rgba(214, 188, 102, 0.2)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#FFF', fontFamily: "'Outfit', sans-serif" }}>
            HOW THE ACADEMY SYSTEM WORKS
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '6px' }}>
            A rigorous, transparent process from application to official board-reviewed certification.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            {
              step: '01',
              title: 'Select Program & Apply',
              desc: 'Choose your desired tier and submit your application. You receive a unique Application ID (e.g. APP-2026-000001).'
            },
            {
              step: '02',
              title: 'Bank Tuition & Receipt',
              desc: 'Make payment via manual bank transfer to our verified Zenith Bank account and upload your payment screenshot/receipt.'
            },
            {
              step: '03',
              title: '30-Day Course Access',
              desc: 'Upon administrative review, your 30-day course access period activates. Complete interactive modules, videos, and tactical drills.'
            },
            {
              step: '04',
              title: 'Official Board Certification',
              desc: 'After 100% completion and administrative approval, your landscape PDF certificate with a verifiable QR code is issued.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(0, 11, 61, 0.7)',
                padding: '1.75rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#d6bc66',
                fontFamily: "'Outfit', sans-serif",
                marginBottom: '0.5rem'
              }}>
                {item.step}
              </div>
              <h4 style={{ color: '#FFF', fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                {item.title}
              </h4>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BANK TRANSFER INSTRUCTIONS CARD */}
      {bankInfo && (
        <section style={{
          background: 'linear-gradient(135deg, rgba(5, 20, 84, 0.9) 0%, rgba(0, 11, 61, 0.95) 100%)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid #d6bc66',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <DollarSign size={24} color="#d6bc66" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFF', margin: 0 }}>
              OFFICIAL TUITION PAYMENT DETAILS
            </h3>
          </div>
          <p style={{ color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {bankInfo.instructions}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            background: 'rgba(0, 7, 38, 0.8)',
            padding: '1.25rem',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '700' }}>BANK NAME</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFF' }}>{bankInfo.bankName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '700' }}>ACCOUNT NAME</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFF' }}>{bankInfo.accountName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '700' }}>ACCOUNT NUMBER</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#d6bc66', fontFamily: 'monospace' }}>
                {bankInfo.accountNumber}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. CALL TO ACTION FOOTER BANNER */}
      <section style={{
        textAlign: 'center',
        padding: '3rem 1.5rem',
        borderRadius: '20px',
        background: 'rgba(0, 11, 61, 0.85)',
        border: '1px solid rgba(214,188,102,0.3)'
      }}>
        <GraduationCap size={44} color="#d6bc66" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF', fontFamily: "'Outfit', sans-serif" }}>
          Ready to Start Your Professional Journey?
        </h2>
        <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0.5rem auto 1.75rem auto', fontSize: '0.9rem' }}>
          Create your free student account today and apply for our next monthly coaching cohort.
        </p>
        <button
          onClick={() => onNavigate('REGISTER')}
          className="btn-gold"
          style={{ padding: '14px 32px', fontSize: '0.95rem' }}
        >
          <span>ENROLL IN DX ACADEMY TODAY</span>
          <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
};

export default Landing;
