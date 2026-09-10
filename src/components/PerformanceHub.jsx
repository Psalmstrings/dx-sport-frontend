import React from 'react';
import { Activity, Zap, Sparkles, Radio, Trophy, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export const PerformanceHub = ({ onSelectCategory }) => {
  const sports = [
    {
      id: '01',
      category: 'HOOPS',
      title: 'SLAM DUNK SESSIONS',
      subtitle: 'EXPLORE BASKETBALL',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
      badge: 'NBA & REGIONAL'
    },
    {
      id: '02',
      category: 'TENNIS',
      title: 'GRAND SLAM ELITE',
      subtitle: 'EXPLORE TENNIS',
      image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80',
      badge: 'ATP TOUR'
    },
    {
      id: '03',
      category: 'GOLF',
      title: 'MASTER THE GREEN',
      subtitle: 'EXPLORE GOLF',
      image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80',
      badge: 'PGA TOUR'
    }
  ];

  const upcomingFeatures = [
    {
      icon: <Cpu size={24} color="#d6bc66" />,
      title: 'AI Match Score Predictor',
      description: 'Advanced statistical machine-learning engine providing probabilistic match outcome predictions and team momentum indicators.'
    },
    {
      icon: <Radio size={24} color="#d6bc66" />,
      title: 'Live Audio & Text Commentary',
      description: 'Stream live match audio broadcasts and sub-second play-by-play text commentary direct to your phone.'
    },
    {
      icon: <Trophy size={24} color="#d6bc66" />,
      title: 'Fan Fantasy & Prediction League',
      description: 'Compete against thousands of sports enthusiasts nationwide, build weekly lineups, and win cash prizes.'
    },
    {
      icon: <Zap size={24} color="#d6bc66" />,
      title: 'Instant Video Replays & Gist Clips',
      description: 'Watch 4K HD goal replays, post-match interviews, and viral locker room moments seconds after they happen.'
    }
  ];

  return (
    <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      {/* SECTION 1: PERFORMANCE HUB (MATCHING PDF PROTOTYPE EXACTLY) */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{
          color: '#FFFFFF',
          fontWeight: '900',
          fontSize: '0.8rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase'
        }}>
          PERFORMANCE HUB
        </span>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '900',
          color: '#FFF',
          textTransform: 'uppercase',
          marginTop: '2px'
        }}>
          SPORTS ACTIVITIES
        </h2>
      </div>

      {/* 3 Prototype Performance Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3.5rem'
      }}>
        {sports.map((item) => (
          <div
            key={item.id}
            className="interactive-card"
            onClick={() => onSelectCategory && onSelectCategory(item.category)}
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              height: '380px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              border: '1px solid rgba(214, 188, 102, 0.25)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '1.5rem'
            }}
          >
            {/* Background Image */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.65)',
              transition: 'transform 0.5s ease'
            }} />

            {/* Dark Gradient Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0, 11, 61, 0.95) 0%, rgba(0, 11, 61, 0.3) 60%, transparent 100%)'
            }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span className="badge-gold" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                {item.badge}
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#d6bc66' }}>
                {item.id} / {item.category}
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#FFF', lineHeight: 1.2, margin: '4px 0 8px 0' }}>
                {item.title}
              </h3>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#CBD5E1', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{item.subtitle}</span>
                <ArrowRight size={14} color="#d6bc66" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 2: ABOUT DX SPORT & UPCOMING FEATURES */}
      <div className="glass-panel-gold" style={{ padding: '2.5rem', borderRadius: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem auto' }}>
          <span style={{
            background: 'var(--gold-gray-yellow)',
            color: '#000b3d',
            fontWeight: '900',
            fontSize: '0.78rem',
            padding: '4px 12px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            WELCOME TO DX SPORT NIGERIA
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#FFF', margin: '0.75rem 0 1rem 0' }}>
            The Ultimate Sports News, Scores & Live Analytics Engine
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem', lineHeight: 1.6 }}>
            DX Sport is Nigeria's flagship digital stadium—delivering ultra-fast NPFL match commentary, Super Eagles international coverage, transfer market gist, and real-time scores from top leagues across the globe.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {upcomingFeatures.map((feat, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(0, 11, 61, 0.7)',
                border: '1px solid rgba(214, 188, 102, 0.25)',
                borderRadius: '12px',
                padding: '1.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(214, 188, 102, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                border: '1px solid rgba(214, 188, 102, 0.3)'
              }}>
                {feat.icon}
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFF', marginBottom: '0.5rem' }}>
                {feat.title}
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.5 }}>
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceHub;
