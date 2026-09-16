import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Play, Bell, Shield, Activity, ArrowRight, Trophy } from 'lucide-react';

// Resolve a logo URL: if it is a relative /uploads/... path, prepend the API origin.
// Absolute http(s) URLs and base64 data URIs are returned unchanged.
const resolveLogoUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  // Relative path — prefix with backend origin
  const origin = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Status badge styling helper
const statusBadge = (status) => {
  if (status === 'LIVE') return { label: 'LIVE', color: '#10B981', bg: 'rgba(16,185,129,0.15)', showDot: true };
  if (status === 'FINISHED') return { label: 'FT', color: '#d6bc66', bg: 'rgba(214,188,102,0.12)', showDot: false };
  if (status === 'POSTPONED') return { label: 'POSTPONED', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', showDot: false };
  if (status === 'CANCELLED') return { label: 'CANCELLED', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', showDot: false };
  return { label: 'UPCOMING', color: '#d6bc66', bg: 'rgba(214,188,102,0.12)', showDot: false };
};

export const MatchCenter = ({ matches = [], onSelectMatch, isHome = false, onViewMore }) => {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'UPCOMING' | 'RESULTS'

  // Separate matches into upcoming and played (finished / live)
  const upcomingMatches = matches.filter(
    (m) => m.status === 'UPCOMING' || !m.status
  );
  const playedMatches = matches.filter(
    (m) => m.status === 'FINISHED' || m.status === 'LIVE'
  );

  // For Homepage: strictly display at most 4 upcoming matches (or first 4 if none explicitly marked)
  const homeDisplayMatches = (upcomingMatches.length > 0 ? upcomingMatches : matches).slice(0, 4);

  const renderMatchCard = (item, idx) => {
    const isLive = item.status === 'LIVE';
    const isUpcoming = item.status === 'UPCOMING' || !item.status;
    const isFinished = item.status === 'FINISHED';
    const badge = statusBadge(item.status);

    const homeLogo = resolveLogoUrl(
      typeof item.homeTeam === 'object' ? item.homeTeam?.logo : ''
    );
    const awayLogo = resolveLogoUrl(
      typeof item.awayTeam === 'object' ? item.awayTeam?.logo : ''
    );

    return (
      <div
        key={item._id || idx}
        className="glass-panel interactive-card"
        style={{
          padding: '1.5rem',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: isLive
            ? '1px solid rgba(16, 185, 129, 0.5)'
            : '1px solid rgba(255,255,255,0.08)'
        }}
      >
        {/* Header: League name + Status badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '900', color: '#94A3B8', letterSpacing: '0.05em' }}>
            {typeof item.league === 'object' ? item.league?.name || 'NPFL' : 'NPFL'}
          </span>

          <span style={{
            fontSize: '0.7rem',
            color: badge.color,
            background: badge.bg,
            padding: '3px 8px',
            borderRadius: '4px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {badge.showDot && (
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10B981',
                display: 'inline-block',
                animation: 'pulse 1.5s infinite'
              }} />
            )}
            {badge.label}
          </span>
        </div>

        {/* Scoreline / Teams */}
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem' }}>

            {/* Home Team */}
            <div style={{ width: '85px', textAlign: 'center' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '2px solid rgba(214,188,102,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 6px auto',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {homeLogo ? (
                  <img
                    src={homeLogo}
                    alt={typeof item.homeTeam === 'object' ? item.homeTeam?.name : 'Home'}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div style={{
                  display: homeLogo ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%'
                }}>
                  <Shield size={22} color="#d6bc66" />
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#FFF', lineHeight: 1.2 }}>
                {typeof item.homeTeam === 'object'
                  ? (item.homeTeam?.shortName || item.homeTeam?.name)
                  : (item.homeTeam || 'TEAM A')}
              </div>
            </div>

            {/* Score / VS */}
            <div style={{
              fontSize: '1.75rem',
              fontWeight: '900',
              color: isLive ? '#10B981' : isFinished ? '#FFF' : '#d6bc66',
              fontFamily: 'monospace',
              minWidth: '64px',
              textAlign: 'center'
            }}>
              {isUpcoming ? 'VS' : `${item.homeScore ?? 0} - ${item.awayScore ?? 0}`}
            </div>

            {/* Away Team */}
            <div style={{ width: '85px', textAlign: 'center' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '2px solid rgba(214,188,102,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 6px auto',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {awayLogo ? (
                  <img
                    src={awayLogo}
                    alt={typeof item.awayTeam === 'object' ? item.awayTeam?.name : 'Away'}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div style={{
                  display: awayLogo ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%'
                }}>
                  <Shield size={22} color="#d6bc66" />
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#FFF', lineHeight: 1.2 }}>
                {typeof item.awayTeam === 'object'
                  ? (item.awayTeam?.shortName || item.awayTeam?.name)
                  : (item.awayTeam || 'TEAM B')}
              </div>
            </div>
          </div>

          {/* Venue & Date */}
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '700', marginTop: '4px' }}>
            {item.venue || 'Venue TBD'}
          </div>
          {item.matchDate && (
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
              {new Date(item.matchDate).toLocaleDateString('en-GB', {
                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelectMatch && onSelectMatch(item)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: '900',
            fontSize: '0.85rem',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: isUpcoming ? 'transparent' : '#000b3d',
            color: '#FFF',
            border: isUpcoming
              ? '1px solid rgba(255,255,255,0.2)'
              : '1px solid rgba(214, 188, 102, 0.4)',
            cursor: 'pointer'
          }}
        >
          {isUpcoming ? <Bell size={16} color="#d6bc66" /> : <Play size={16} color="#FFFFFF" />}
          <span>{item.action || (isUpcoming ? 'UPCOMING' : isFinished ? 'FULL TIME' : 'WATCH LIVE')}</span>
        </button>
      </div>
    );
  };

  if (!matches || matches.length === 0) {
    return (
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <div style={{ width: '32px', height: '4px', backgroundColor: '#FFFFFF', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.02em', color: '#FFF' }}>
            {isHome ? 'UPCOMING FIXTURES' : 'FIXTURES & SCORES'}
          </h2>
        </div>
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
          <Calendar size={40} color="#d6bc66" style={{ marginBottom: '0.75rem' }} />
          <h4 style={{ color: '#FFF', fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.35rem' }}>
            No Matches Scheduled Yet
          </h4>
          <p style={{ fontSize: '0.88rem' }}>
            Login as Admin or Editor to schedule matches and update live scorelines.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // 1. HOMEPAGE MODE (Display at most 4 upcoming matches + View More button)
  // ==========================================
  if (isHome) {
    return (
      <div style={{ marginBottom: '2.5rem' }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <div style={{ width: '32px', height: '4px', backgroundColor: '#FFFFFF', borderRadius: '2px', marginBottom: '6px' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.02em', color: '#FFF' }}>
              UPCOMING FIXTURES
            </h2>
          </div>

          {onViewMore && (
            <button
              onClick={onViewMore}
              className="btn-outline-gold"
              style={{
                padding: '6px 16px',
                fontSize: '0.8rem',
                minHeight: '36px',
                gap: '6px'
              }}
            >
              <span>VIEW ALL FIXTURES & SCORES</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* 4 Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          {homeDisplayMatches.map(renderMatchCard)}
        </div>

        {/* Centered View More Button */}
        {onViewMore && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              onClick={onViewMore}
              className="btn-outline-gold"
              style={{
                padding: '10px 24px',
                fontSize: '0.875rem',
                gap: '8px'
              }}
            >
              <span>VIEW MORE FIXTURES & SCORES</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 2. DEDICATED FIXTURES & SCORES PAGE MODE
  // ==========================================
  return (
    <div style={{ marginBottom: '3rem' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        borderBottom: '2px solid rgba(214, 188, 102, 0.25)',
        paddingBottom: '1rem'
      }}>
        <div>
          <div style={{ width: '40px', height: '4px', backgroundColor: '#FFFFFF', borderRadius: '2px', marginBottom: '6px' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.02em', color: '#FFF', margin: 0 }}>
            FIXTURES & SCORES
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginTop: '4px' }}>
            Complete schedule of upcoming fixtures and latest results across all competitions
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(5, 20, 84, 0.8)',
          padding: '4px',
          borderRadius: '8px',
          border: '1px solid rgba(214, 188, 102, 0.3)'
        }}>
          <button
            onClick={() => setActiveTab('ALL')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '800',
              color: activeTab === 'ALL' ? '#000b3d' : '#d6bc66',
              background: activeTab === 'ALL' ? 'var(--gold-gray-yellow)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            ALL ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('UPCOMING')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '800',
              color: activeTab === 'UPCOMING' ? '#000b3d' : '#d6bc66',
              background: activeTab === 'UPCOMING' ? 'var(--gold-gray-yellow)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            UPCOMING ({upcomingMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('RESULTS')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '800',
              color: activeTab === 'RESULTS' ? '#000b3d' : '#d6bc66',
              background: activeTab === 'RESULTS' ? 'var(--gold-gray-yellow)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            SCORES & RESULTS ({playedMatches.length})
          </button>
        </div>
      </div>

      {/* Conditional Content by Active Tab */}
      {activeTab === 'ALL' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Section A: Upcoming Fixtures */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Calendar size={20} color="#d6bc66" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
                UPCOMING FIXTURES ({upcomingMatches.length})
              </h2>
            </div>
            {upcomingMatches.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '1.25rem'
              }}>
                {upcomingMatches.map(renderMatchCard)}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
                No upcoming matches scheduled at this time.
              </div>
            )}
          </div>

          {/* Section B: Played Matches & Scores */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Trophy size={20} color="#d6bc66" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
                PLAYED MATCHES & SCORES ({playedMatches.length})
              </h2>
            </div>
            {playedMatches.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '1.25rem'
              }}>
                {playedMatches.map(renderMatchCard)}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
                No match results recorded yet.
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'UPCOMING' ? (
        <div>
          {upcomingMatches.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '1.25rem'
            }}>
              {upcomingMatches.map(renderMatchCard)}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
              <Calendar size={40} color="#d6bc66" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ color: '#FFF', fontSize: '1.1rem', fontWeight: '800' }}>No Upcoming Fixtures</h4>
              <p style={{ fontSize: '0.88rem' }}>Check back soon for newly scheduled games.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {playedMatches.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '1.25rem'
            }}>
              {playedMatches.map(renderMatchCard)}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
              <Trophy size={40} color="#d6bc66" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ color: '#FFF', fontSize: '1.1rem', fontWeight: '800' }}>No Scores or Played Matches Yet</h4>
              <p style={{ fontSize: '0.88rem' }}>Match scorelines will appear here once games conclude.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchCenter;
