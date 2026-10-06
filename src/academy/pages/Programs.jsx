import React, { useState, useEffect } from 'react';
import ElearningAPI from '../../services/elearningApi';
import { BookOpen, Clock, CheckCircle, ArrowRight, Filter } from 'lucide-react';

export const Programs = ({ onSelectProgram }) => {
  const [programs, setPrograms] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = selectedLevel !== 'All' ? { level: selectedLevel } : {};
    ElearningAPI.getPrograms(params)
      .then(res => {
        if (res.success) setPrograms(res.programs || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedLevel]);

  const levels = ['All', 'Beginner', 'Intermediate', 'Professional'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ width: '36px', height: '4px', backgroundColor: '#d6bc66', borderRadius: '2px', marginBottom: '8px' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#FFF', fontFamily: "'Outfit', sans-serif", textTransform: 'uppercase' }}>
          ACADEMIC PROGRAMS & DIPLOMAS
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '4px' }}>
          Explore our certified curriculum designed for modern African and international football standards.
        </p>
      </div>

      {/* Level Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {levels.map(lvl => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '800',
              cursor: 'pointer',
              color: selectedLevel === lvl ? '#000b3d' : '#d6bc66',
              background: selectedLevel === lvl ? '#d6bc66' : 'rgba(5, 20, 84, 0.8)',
              border: '1px solid rgba(214, 188, 102, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            {lvl.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Program Cards Grid */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
          Loading curriculum catalog...
        </div>
      ) : programs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
          No programs found for level: {selectedLevel}
        </div>
      ) : (
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
                border: '1px solid rgba(214, 188, 102, 0.25)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '900',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: prog.level === 'Professional' ? 'rgba(239, 68, 68, 0.2)' : prog.level === 'Intermediate' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: prog.level === 'Professional' ? '#F87171' : prog.level === 'Intermediate' ? '#FBBF24' : '#34D399',
                    border: '1px solid currentColor'
                  }}>
                    {prog.level}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="#d6bc66" />
                    <span>{prog.duration}</span>
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFF', marginBottom: '0.75rem', lineHeight: 1.25 }}>
                  {prog.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {prog.description}
                </p>

                {prog.objectives && prog.objectives.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#d6bc66', fontWeight: '800', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Learning Outcomes:
                    </div>
                    {prog.objectives.slice(0, 3).map((obj, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '4px' }}>
                        <CheckCircle size={14} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: '1rem',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700' }}>TUITION</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#d6bc66', fontFamily: "'Outfit', sans-serif" }}>
                    {prog.currency} {prog.price.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => onSelectProgram(prog.slug)}
                  className="btn-gold"
                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  <span>DETAILS & APPLY</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Programs;
