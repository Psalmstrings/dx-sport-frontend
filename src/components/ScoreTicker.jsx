import React, { useMemo } from 'react';
import { Activity, Shield } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

export const ScoreTicker = ({ matches = [], onMatchSelect }) => {
  // Sort matches:
  // 1. Currently played matches (LIVE) first on weekends and matchdays
  // 2. Upcoming matches (UPCOMING / SCHEDULED) sorted by nearest kick-off time
  // 3. Finished matches (FINISHED / COMPLETED) sorted by most recent
  const sortedMatches = useMemo(() => {
    if (!Array.isArray(matches) || matches.length === 0) return [];

    return [...matches].sort((a, b) => {
      const getPriority = (item) => {
        const s = (item.status || '').toUpperCase().trim();
        if (s === 'LIVE') return 1;
        if (s === 'UPCOMING' || s === 'SCHEDULED' || !s) return 2;
        if (s === 'FINISHED' || s === 'COMPLETED') return 3;
        return 4;
      };

      const prioA = getPriority(a);
      const prioB = getPriority(b);

      if (prioA !== prioB) {
        return prioA - prioB;
      }

      // Within UPCOMING: sort by nearest kickoff date (ascending)
      if (prioA === 2) {
        const dateA = a.matchDate ? new Date(a.matchDate).getTime() : Infinity;
        const dateB = b.matchDate ? new Date(b.matchDate).getTime() : Infinity;
        return dateA - dateB;
      }

      // Within LIVE or FINISHED: sort by matchDate descending (most recent first)
      const dateA = a.matchDate ? new Date(a.matchDate).getTime() : 0;
      const dateB = b.matchDate ? new Date(b.matchDate).getTime() : 0;
      return dateB - dateA;
    });
  }, [matches]);

  // Seamless marquee duplicate so the animation never jumps
  const displayItems = useMemo(() => {
    if (sortedMatches.length === 0) return [];
    // If fewer than 5 matches, repeat more times to fill wide desktop viewports
    if (sortedMatches.length < 5) {
      return [...sortedMatches, ...sortedMatches, ...sortedMatches, ...sortedMatches];
    }
    return [...sortedMatches, ...sortedMatches];
  }, [sortedMatches]);

  // Duration in seconds: gently proportional to item count (minimum 35s)
  const animationDuration = Math.max(35, displayItems.length * 4.5);

  return (
    <>
      <style>{`
        @keyframes dxGentleScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .dx-ticker-track {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          will-change: transform;
          animation: dxGentleScroll ${animationDuration}s linear infinite;
        }
        .dx-ticker-container:hover .dx-ticker-track {
          animation-play-state: paused;
        }
        .dx-ticker-card {
          transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .dx-ticker-card:hover {
          transform: translateY(-2px);
          background: rgba(10, 32, 110, 0.95) !important;
          border-color: #d6bc66 !important;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }
      `}</style>

      <div
        className="dx-ticker-container"
        style={{
          backgroundColor: '#000726',
          borderBottom: '1px solid rgba(214, 188, 102, 0.25)',
          padding: '0.55rem 0',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        {/* Fixed Ticker Brand Label on Left */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          paddingLeft: '1rem',
          paddingRight: '0.85rem',
          backgroundColor: '#000726',
          boxShadow: '15px 0 20px 0 #000726',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, rgba(214, 188, 102, 0.22) 0%, rgba(214, 188, 102, 0.08) 100%)',
            border: '1px solid rgba(214, 188, 102, 0.45)',
            color: '#d6bc66',
            padding: '5px 11px',
            borderRadius: '6px',
            fontWeight: '900',
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}>
            <Activity size={14} color="#d6bc66" />
            <span>LIVE SCORES</span>
          </div>
        </div>

        {/* Scrolling Viewport */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          position: 'relative',
          maskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)'
        }}>
          {sortedMatches.length === 0 ? (
            <div style={{ paddingLeft: '1rem', fontSize: '0.8rem', color: '#94A3B8', fontWeight: '700' }}>
              NO LIVE SCORES AT PRESENT — Active and scheduled matches will stream here.
            </div>
          ) : (
            <div className="dx-ticker-track">
              {displayItems.map((m, idx) => {
                const isLive = m.status === 'LIVE';
                const isFinished = m.status === 'FINISHED' || m.status === 'COMPLETED';
                const isUpcoming = m.status === 'UPCOMING' || !m.status;

                const compTag = typeof m.league === 'object'
                  ? (m.league?.shortName || m.league?.code || '')
                  : (m.league || '');

                const homeName = typeof m.homeTeam === 'object'
                  ? (m.homeTeam?.code || m.homeTeam?.shortName || m.homeTeam?.name || 'HOME')
                  : (m.homeTeam || 'HOME');

                const awayName = typeof m.awayTeam === 'object'
                  ? (m.awayTeam?.code || m.awayTeam?.shortName || m.awayTeam?.name || 'AWAY')
                  : (m.awayTeam || 'AWAY');

                const homeLogo = m.homeTeam?.logo ? getImageUrl(m.homeTeam.logo) : '';
                const awayLogo = m.awayTeam?.logo ? getImageUrl(m.awayTeam.logo) : '';

                // Time display for upcoming fixtures
                const kickoffTime = isUpcoming && m.matchDate
                  ? new Date(m.matchDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                  : '';

                return (
                  <div
                    key={`${m._id || idx}-${idx}`}
                    className="dx-ticker-card"
                    onClick={() => onMatchSelect && onMatchSelect(m)}
                    title={`Click to view match details: ${homeName} vs ${awayName}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: isLive ? 'rgba(5, 26, 95, 0.88)' : 'rgba(5, 18, 70, 0.72)',
                      border: isLive ? '1px solid #10B981' : '1px solid rgba(214, 188, 102, 0.22)',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      fontSize: '0.84rem',
                      fontWeight: '800'
                    }}
                  >
                    {/* Competition Badge */}
                    {compTag && (
                      <span style={{
                        fontSize: '0.66rem',
                        fontWeight: '900',
                        color: '#d6bc66',
                        background: 'rgba(214, 188, 102, 0.15)',
                        border: '1px solid rgba(214, 188, 102, 0.3)',
                        padding: '2px 5px',
                        borderRadius: '3px',
                        letterSpacing: '0.04em'
                      }}>
                        {compTag}
                      </span>
                    )}

                    {/* Home Team */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {homeLogo ? (
                        <img
                          src={homeLogo}
                          alt=""
                          style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <Shield size={12} color="#94A3B8" />
                      )}
                      <span style={{ color: '#FFFFFF', maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {homeName}
                      </span>
                    </div>

                    {/* Score / VS Display */}
                    {isUpcoming ? (
                      <span style={{
                        color: '#d6bc66',
                        fontFamily: 'monospace',
                        fontWeight: '900',
                        fontSize: '0.85rem',
                        padding: '0 3px'
                      }}>
                        VS
                      </span>
                    ) : (
                      <span style={{
                        color: isLive ? '#10B981' : '#d6bc66',
                        fontFamily: 'monospace',
                        fontWeight: '900',
                        fontSize: '0.92rem',
                        padding: '0 2px'
                      }}>
                        {m.homeScore ?? 0} - {m.awayScore ?? 0}
                      </span>
                    )}

                    {/* Away Team */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#FFFFFF', maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {awayName}
                      </span>
                      {awayLogo ? (
                        <img
                          src={awayLogo}
                          alt=""
                          style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <Shield size={12} color="#94A3B8" />
                      )}
                    </div>

                    {/* Match Status indicator */}
                    {isLive ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        color: '#10B981',
                        fontWeight: '900',
                        background: 'rgba(16, 185, 129, 0.12)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#10B981',
                          boxShadow: '0 0 6px #10B981'
                        }} />
                        <span>{m.currentMinute ? `${m.currentMinute}'` : 'LIVE'}</span>
                      </span>
                    ) : isFinished ? (
                      <span style={{
                        fontSize: '0.68rem',
                        color: '#94A3B8',
                        fontWeight: '800',
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '2px 5px',
                        borderRadius: '3px'
                      }}>
                        FT
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '0.68rem',
                        color: '#d6bc66',
                        fontWeight: '800',
                        background: 'rgba(214, 188, 102, 0.1)',
                        padding: '2px 5px',
                        borderRadius: '3px'
                      }}>
                        {kickoffTime || 'UPCOMING'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ScoreTicker;
