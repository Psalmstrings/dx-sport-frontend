import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Play, Bell, Shield, Activity } from 'lucide-react';

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

export const MatchCenter = ({ matches = [], onSelectMatch }) => {
  if (!matches || matches.length === 0) {
    return (
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <div style={{ width: '32px', height: '4px', backgroundColor: '#FFFFFF', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.02em', color: '#FFF' }}>
            UPCOMING FIXTURES
          </h2>
        </div>
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
          <Calendar size={40} color="#d6bc66" style={{ marginBottom: '0.75rem' }} />
          <h4 style={{ color: '#FFF', fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.35rem' }}>
            No Match Features Scheduled Yet
          </h4>
          <p style={{ fontSize: '0.88rem' }}>
            Login as Admin or Editor to schedule matches using registered teams and update live scorelines.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{ width: '32px', height: '4px', backgroundColor: '#FFFFFF', borderRadius: '2px', marginBottom: '6px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.02em', color: '#FFF' }}>
            FIXTURES ({matches.length})
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            background: 'rgba(5, 20, 84, 0.8)',
            border: '1px solid rgba(214, 188, 102, 0.3)',
            color: '#FFF',
            padding: '8px 12px',
            borderRadius: '6px'
          }}>
            <ChevronLeft size={18} />
          </button>
          <button style={{
            background: 'rgba(5, 20, 84, 0.8)',
            border: '1px solid rgba(214, 188, 102, 0.3)',
            color: '#FFF',
            padding: '8px 12px',
            borderRadius: '6px'
          }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Fixture Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '1.25rem'
      }}>
        {matches.map((item, idx) => {
          const isLive = item.status === 'LIVE';
          const isUpcoming = item.status === 'UPCOMING';
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
                  {typeof item.league === 'object'
                    ? (item.league?.name || item.league?.code)
                    : (item.league || item.leagueName || 'PREMIER LEAGUE')}
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
                  <div style={{ width: '80px', textAlign: 'center' }}>
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
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
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
                    <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#FFF', lineHeight: 1.2 }}>
                      {typeof item.homeTeam === 'object'
                        ? (item.homeTeam?.shortName || item.homeTeam?.name)
                        : (item.homeTeam || 'TEAM A')}
                    </div>
                  </div>

                  {/* Score / VS */}
                  <div style={{
                    fontSize: '1.6rem',
                    fontWeight: '900',
                    color: isLive ? '#10B981' : isFinished ? '#FFF' : '#d6bc66',
                    fontFamily: 'monospace',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}>
                    {isUpcoming ? 'VS' : `${item.homeScore ?? 0} - ${item.awayScore ?? 0}`}
                  </div>

                  {/* Away Team */}
                  <div style={{ width: '80px', textAlign: 'center' }}>
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
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
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
                    <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#FFF', lineHeight: 1.2 }}>
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
        })}
      </div>
    </div>
  );
};

export default MatchCenter;
