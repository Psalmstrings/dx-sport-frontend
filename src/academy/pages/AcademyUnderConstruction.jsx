import React, { useState } from 'react';
import {
  GraduationCap,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  X
} from 'lucide-react';
import ElearningAPI from '../../services/elearningApi';

export const AcademyUnderConstruction = ({ onBackToSports, onAccessGranted }) => {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenAdminModal = () => {
    setAccessCode('');
    setErrorMessage('');
    setShowCode(false);
    setIsAdminModalOpen(true);
  };

  const handleCloseAdminModal = () => {
    if (isSubmitting) return;
    setIsAdminModalOpen(false);
    setAccessCode('');
    setErrorMessage('');
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setErrorMessage('Please enter an access code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await ElearningAPI.verifyPreviewAccess(accessCode.trim());
      if (response && response.success) {
        setIsAdminModalOpen(false);
        if (onAccessGranted) {
          onAccessGranted();
        }
      } else {
        setErrorMessage(response?.message || 'Invalid preview access code. Please try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid preview access code. Please verify and try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000726',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(5, 20, 84, 0.7), transparent)',
      color: '#FFFFFF',
      fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* ── TOP HEADER / BRAND BAR ─────────────────────────────────────── */}
      <header style={{
        width: '100%',
        borderBottom: '1px solid rgba(214, 188, 102, 0.2)',
        backgroundColor: 'rgba(0, 11, 61, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          {/* Logo & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #051454 0%, #000b3d 100%)',
              border: '2px solid #d6bc66',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(214, 188, 102, 0.25)',
              flexShrink: 0
            }}>
              <GraduationCap size={24} color="#d6bc66" />
            </div>
            <div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '900',
                letterSpacing: '0.04em',
                color: '#FFF',
                lineHeight: 1.1
              }}>
                DX <span style={{ color: '#d6bc66' }}>ACADEMY</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: '700', letterSpacing: '0.06em' }}>
                FOOTBALL EDUCATION & DEVELOPMENT
              </div>
            </div>
          </div>

          {/* Return button */}
          <button
            onClick={onBackToSports}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(214, 188, 102, 0.1)',
              border: '1px solid rgba(214, 188, 102, 0.35)',
              color: '#d6bc66',
              padding: '7px 15px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.02em'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#d6bc66';
              e.currentTarget.style.color = '#000b3d';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(214, 188, 102, 0.1)';
              e.currentTarget.style.color = '#d6bc66';
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to DX Sports</span>
          </button>
        </div>
      </header>

      {/* ── MAIN LANDING CONTENT ───────────────────────────────────────── */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.25rem 2.5rem',
        position: 'relative'
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(214, 188, 102, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }} />

        <div style={{
          maxWidth: '780px',
          width: '100%',
          position: 'relative',
          zIndex: 2,
          textAlign: 'center'
        }}>
          {/* Badge pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(5, 20, 84, 0.85)',
            border: '1px solid rgba(214, 188, 102, 0.4)',
            padding: '6px 16px',
            borderRadius: '24px',
            color: '#d6bc66',
            fontSize: '0.78rem',
            fontWeight: '800',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.75rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
          }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#d6bc66',
              boxShadow: '0 0 10px #d6bc66'
            }} />
            <span>Under Active Preparation</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: '900',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 0 1.25rem 0',
            color: '#FFFFFF'
          }}>
            Something Great Is <span style={{
              background: 'linear-gradient(135deg, #d6bc66 0%, #ecd98a 50%, #d6bc66 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(214,188,102,0.2)'
            }}>Coming</span>.
          </h1>

          {/* Supporting Copy */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: '#CBD5E1',
            lineHeight: 1.7,
            maxWidth: '640px',
            margin: '0 auto 2.5rem',
            fontWeight: '500'
          }}>
            DX Academy is getting ready. We’re building a better learning experience for
            aspiring athletes, sports professionals, and learners. Our academy will be
            available soon. Stay tuned!
          </p>

          {/* Tasteful Progress / Milestones Card */}
          <div style={{
            backgroundColor: 'rgba(0, 11, 61, 0.75)',
            border: '1px solid rgba(214, 188, 102, 0.25)',
            borderRadius: '16px',
            padding: '1.75rem 1.5rem',
            maxWidth: '620px',
            margin: '0 auto 2.5rem',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
            textAlign: 'left'
          }}>
            {/* Status bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#d6bc66" />
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#FFF' }}>
                  Curriculum &amp; Platform Status
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#d6bc66', fontWeight: '800' }}>
                Pre-Launch Review
              </span>
            </div>

            {/* Visual Animated Progress Bar */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <div style={{
                width: '85%',
                height: '100%',
                background: 'linear-gradient(90deg, #d6bc66 0%, #ecd98a 100%)',
                borderRadius: '999px',
                boxShadow: '0 0 12px rgba(214, 188, 102, 0.5)'
              }} />
            </div>

            {/* Feature Highlights Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="#d6bc66" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#FFF' }}>Coaching Curriculum</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Grassroots to Pro Tactics</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="#d6bc66" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#FFF' }}>Verified Credentials</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Secure Digital Certificates</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="#d6bc66" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#FFF' }}>Interactive Learning</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Match Analysis &amp; Media</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA: Return to sports website */}
          <div>
            <button
              onClick={onBackToSports}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#d6bc66',
                color: '#000b3d',
                padding: '12px 28px',
                borderRadius: '30px',
                fontSize: '0.9rem',
                fontWeight: '900',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 18px rgba(214, 188, 102, 0.35)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 22px rgba(214, 188, 102, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(214, 188, 102, 0.35)';
              }}
            >
              <ArrowLeft size={16} />
              <span>Explore Football News &amp; Scores</span>
            </button>
          </div>
        </div>
      </main>

      {/* ── FOOTER BAR WITH DISCREET ADMIN LINK ────────────────────────── */}
      <footer style={{
        width: '100%',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: '#000726',
        padding: '1.25rem 1.5rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Copyright notice */}
          <div style={{ color: '#64748B', fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} <span style={{ color: '#d6bc66', fontWeight: '700' }}>DX Academy</span> · Football Education LMS · All rights reserved.
          </div>

          {/* Discreet, understated Admin Link */}
          <div>
            <button
              onClick={handleOpenAdminModal}
              title="Private Academy Preview Access"
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'color 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#94A3B8'}
              onMouseOut={(e) => e.currentTarget.style.color = '#64748B'}
            >
              <Lock size={12} style={{ opacity: 0.6 }} />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ── DISCREET ADMIN ACCESS DIALOG (MODAL) ───────────────────────── */}
      {isAdminModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 7, 38, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 9999
        }}>
          <div
            style={{
              backgroundColor: '#051454',
              border: '1px solid rgba(214, 188, 102, 0.4)',
              borderRadius: '16px',
              maxWidth: '420px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseAdminModal}
              disabled={isSubmitting}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px'
              }}
              onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.color = '#FFF')}
              onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.color = '#94A3B8')}
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(214, 188, 102, 0.15)',
                border: '1px solid #d6bc66',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={18} color="#d6bc66" />
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: '800',
                  color: '#FFFFFF'
                }}>
                  Private Academy Preview
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Authorized Client &amp; Reviewer Access
                </span>
              </div>
            </div>

            <p style={{
              fontSize: '0.82rem',
              color: '#CBD5E1',
              lineHeight: 1.5,
              margin: '0 0 1.25rem'
            }}>
              Please enter your pre-launch preview access code to view the Academy LMS.
            </p>

            {/* Form */}
            <form onSubmit={handleVerifyCode}>
              {/* Code Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#d6bc66',
                  letterSpacing: '0.04em',
                  marginBottom: '6px',
                  textTransform: 'uppercase'
                }}>
                  Access Code
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCode ? 'text' : 'password'}
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter access code"
                    disabled={isSubmitting}
                    autoFocus
                    autoComplete="off"
                    style={{
                      width: '100%',
                      padding: '10px 42px 10px 14px',
                      backgroundColor: 'rgba(0, 11, 61, 0.9)',
                      border: errorMessage ? '1px solid #EF4444' : '1px solid rgba(214, 188, 102, 0.35)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                      letterSpacing: showCode ? '0.08em' : '0.12em',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    disabled={isSubmitting}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title={showCode ? 'Hide Code' : 'Show Code'}
                  >
                    {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '6px',
                  color: '#FCA5A5',
                  fontSize: '0.78rem',
                  marginBottom: '1.25rem'
                }}>
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleCloseAdminModal}
                  disabled={isSubmitting}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#94A3B8',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !accessCode.trim()}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: isSubmitting || !accessCode.trim() ? '#94A3B8' : '#d6bc66',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#000b3d',
                    fontSize: '0.8rem',
                    fontWeight: '900',
                    cursor: isSubmitting || !accessCode.trim() ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        border: '2px solid #000b3d',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AcademyUnderConstruction;
