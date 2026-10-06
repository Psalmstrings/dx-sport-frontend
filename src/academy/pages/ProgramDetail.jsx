import React, { useState, useEffect } from 'react';
import ElearningAPI from '../../services/elearningApi';
import { useAcademyAuth } from '../context/AcademyAuthContext';
import {
  ArrowLeft,
  Clock,
  Award,
  CheckCircle,
  BookOpen,
  DollarSign,
  ChevronDown,
  ChevronUp,
  FileText,
  Video,
  Shield,
  ArrowRight
} from 'lucide-react';

export const ProgramDetail = ({ slug, onBack, onNavigate }) => {
  const { isAuthenticated } = useAcademyAuth();
  const [data, setData] = useState(null);
  const [bankInfo, setBankInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [expandedModule, setExpandedModule] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      ElearningAPI.getProgramBySlug(slug),
      ElearningAPI.getPublicSettings()
    ])
      .then(([progRes, setRes]) => {
        if (progRes.success) setData(progRes);
        if (setRes.success) setBankInfo(setRes.payment);
      })
      .catch(err => {
        setFeedback({ type: 'error', text: 'Failed to load program details.' });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      onNavigate('LOGIN');
      return;
    }

    try {
      setApplying(true);
      setFeedback(null);
      const res = await ElearningAPI.apply(data.program._id);
      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Application ${res.application.applicationId} created successfully! Redirecting to applications...`
        });
        setTimeout(() => {
          onNavigate('APPLICATIONS');
        }, 1200);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Failed to submit application'
      });
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
        Loading program curriculum...
      </div>
    );
  }

  if (!data || !data.program) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#EF4444' }}>
        Program not found.
        <div style={{ marginTop: '1rem' }}>
          <button onClick={onBack} className="btn-outline-gold">Back to Programs</button>
        </div>
      </div>
    );
  }

  const { program, curriculum = [] } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#d6bc66',
          fontSize: '0.85rem',
          fontWeight: '800'
        }}
      >
        <ArrowLeft size={16} />
        <span>BACK TO ALL PROGRAMS</span>
      </button>

      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 11, 61, 0.95) 0%, rgba(5, 20, 84, 0.9) 100%)',
        padding: '2.5rem',
        borderRadius: '20px',
        border: '1px solid rgba(214, 188, 102, 0.35)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '900',
            padding: '4px 12px',
            borderRadius: '6px',
            background: 'var(--gold-gray-yellow)',
            color: '#000b3d'
          }}>
            {program.level.toUpperCase()} LEVEL
          </span>

          <span style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={16} color="#d6bc66" />
            <span>Course Duration: {program.duration} (30 Days LMS Access)</span>
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          fontWeight: '900',
          color: '#FFF',
          lineHeight: 1.2,
          fontFamily: "'Outfit', sans-serif",
          marginBottom: '1rem'
        }}>
          {program.title}
        </h1>

        <p style={{ fontSize: '1rem', color: '#CBD5E1', lineHeight: 1.6, maxWidth: '800px', marginBottom: '2rem' }}>
          {program.description}
        </p>

        {/* Feedback alert */}
        {feedback && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            background: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: feedback.type === 'error' ? '1px solid #EF4444' : '1px solid #10B981',
            color: feedback.type === 'error' ? '#FCA5A5' : '#6EE7B7',
            fontSize: '0.9rem',
            fontWeight: '700'
          }}>
            {feedback.text}
          </div>
        )}

        {/* Pricing & Apply Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800' }}>TUITION INVESTMENT</div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#d6bc66', fontFamily: "'Outfit', sans-serif" }}>
              {program.currency} {program.price.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleApply}
            disabled={applying}
            className="btn-gold"
            style={{ padding: '14px 32px', fontSize: '0.95rem' }}
          >
            <span>{applying ? 'PROCESSING APPLICATION...' : isAuthenticated ? 'APPLY FOR THIS PROGRAM' : 'LOGIN TO APPLY NOW'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {/* Left Column: Curriculum Modules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ width: '32px', height: '4px', backgroundColor: '#d6bc66', borderRadius: '2px', marginBottom: '6px' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#FFF' }}>
              COURSE OUTLINE & MODULES
            </h2>
          </div>

          {curriculum.length === 0 ? (
            <div className="glass-panel" style={{ padding: '1.5rem', color: '#94A3B8', fontSize: '0.85rem' }}>
              Curriculum syllabus currently being compiled by the technical board.
            </div>
          ) : (
            curriculum.map((mod, idx) => (
              <div
                key={mod._id}
                className="glass-panel"
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(214, 188, 102, 0.25)'
                }}
              >
                <div
                  onClick={() => setExpandedModule(expandedModule === idx ? -1 : idx)}
                  style={{
                    padding: '1.25rem',
                    background: 'rgba(5, 20, 84, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#d6bc66', fontWeight: '800' }}>
                      MODULE {mod.order || idx + 1}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFF', margin: '2px 0 0 0' }}>
                      {mod.title}
                    </h3>
                  </div>
                  {expandedModule === idx ? <ChevronUp size={20} color="#d6bc66" /> : <ChevronDown size={20} color="#d6bc66" />}
                </div>

                {expandedModule === idx && (
                  <div style={{ padding: '1.25rem', background: 'rgba(0, 7, 38, 0.6)' }}>
                    {mod.description && (
                      <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '1rem' }}>
                        {mod.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {mod.lessons.map(lesson => (
                        <div
                          key={lesson._id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.03)',
                            fontSize: '0.82rem',
                            color: '#CBD5E1'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {lesson.type === 'video' || lesson.type === 'external_video' ? (
                              <Video size={16} color="#d6bc66" />
                            ) : (
                              <FileText size={16} color="#d6bc66" />
                            )}
                            <span style={{ fontWeight: '700' }}>{lesson.title}</span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            {lesson.durationMinutes} mins
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right Column: Objectives, Requirements & Bank details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Objectives */}
          <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="#d6bc66" />
              <span>WHAT YOU WILL LEARN</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {program.objectives?.map((obj, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#CBD5E1' }}>
                  <CheckCircle size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFF', marginBottom: '1rem' }}>
              ADMISSION REQUIREMENTS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {program.requirements?.map((req, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#94A3B8' }}>
                  <span style={{ color: '#d6bc66', fontWeight: '900' }}>•</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment info preview */}
          {bankInfo && (
            <div style={{
              background: 'rgba(5, 20, 84, 0.75)',
              border: '1px solid #d6bc66',
              padding: '1.5rem',
              borderRadius: '16px'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#d6bc66', letterSpacing: '0.05em' }}>
                DIRECT TUITION PAYMENT
              </div>
              <div style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '6px' }}>
                Bank: <strong>{bankInfo.bankName}</strong><br />
                Account: <strong>{bankInfo.accountName}</strong><br />
                Account Number: <strong style={{ color: '#d6bc66' }}>{bankInfo.accountNumber}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
