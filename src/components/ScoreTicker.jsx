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
    if (sortedMatches.length < 6) {
      return [...sortedMatches, ...sortedMatches, ...sortedMatches, ...sortedMatches];
    }
    return [...sortedMatches, ...sortedMatches];
  }, [sortedMatches]);

  // Duration in seconds: gently proportional to item count (minimum 35s)
  const animationDuration = Math.max(35, displayItems.length * 4.2);

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
          gap: 10px;
          will-change: transform;
          animation: dxGentleScroll ${animationDuration}s linear infinite;
        }
        .dx-ticker-container:hover .dx-ticker-track,
        .dx-ticker-container:active .dx-ticker-track {
          animation-play-state: paused;
        }
        .dx-ticker-card {
          transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(5, 18, 70, 0.72);
          border: 1px solid rgba(214, 188, 102, 0.22);
          padding: 3px 9px;
          border-radius: 6px;
          cursor: pointer;
          flex-shrink: 0;
          font-size: 0.78rem;
          font-weight: 800;
        }
        .dx-ticker-card:hover {
          transform: translateY(-1px);
          background: rgba(10, 32, 110, 0.95) !important;
          border-color: #d6bc66 !important;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
        }
        .dx-ticker-badge-wrapper {
          position: relative;
          z-index: 10;
          padding-left: 0.65rem;
          padding-right: 0.5rem;
          background-color: #000726;
          box-shadow: 8px 0 14px -2px #000726;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .dx-ticker-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, rgba(214, 188, 102, 0.22) 0%, rgba(214, 188, 102, 0.08) 100%);
          border: 1px solid rgba(214, 188, 102, 0.45);
          color: #d6bc66;
          padding: 3px 7px;
          border-radius: 5px;
          font-weight: 900;
          font-size: 0.68rem;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .dx-ticker-badge-wrapper {
            padding-left: 0.4rem;
            padding-right: 0.35rem;
            box-shadow: 6px 0 10px -2px #000726;
          }
          .dx-ticker-badge {
            padding: 2px 5px;
            font-size: 0.62rem;
            gap: 3px;
          }
          .dx-ticker-card {
            padding: 3px 7px;
            font-size: 0.74rem;
            gap: 5px;
          }
        }
      `}</style>

      <div
        className="dx-ticker-container"
        style={{
          backgroundColor: '#000726',
          borderBottom: '1px solid rgba(214, 188, 102, 0.22)',
          padding: '0.35rem 0',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        {/* Streamlined Ticker Brand Label on Left */}
        <div className="dx-ticker-badge-wrapper">
          <div className="dx-ticker-badge">
            <Activity size={12} color="#d6bc66" />
            <span>LIVE SCORES</span>
          </div>
        </div>

        {/* Scrolling Viewport — Max space for fixtures */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          position: 'relative',
          maskImage: 'linear-gradient(to right, transparent 0%, black 1.5%, black 98.5%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 1.5%, black 98.5%, transparent 100%)'
        }}>
          {sortedMatches.length === 0 ? (
            <div style={{ paddingLeft: '0.75rem', fontSize: '0.75rem', color: '#94A3B8', fontWeight: '700' }}>
              NO LIVE SCORES AT PRESENT — Scheduled matches will stream here.
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
                    style={isLive ? {
                      background: 'rgba(5, 26, 95, 0.88)',
                      borderColor: '#10B981'
                    } : undefined}
                  >
                    {/* Competition Badge */}
                    {compTag && (
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: '900',
                        color: '#d6bc66',
                        background: 'rgba(214, 188, 102, 0.15)',
                        border: '1px solid rgba(214, 188, 102, 0.3)',
                        padding: '1px 4px',
                        borderRadius: '3px',
                        letterSpacing: '0.03em'
                      }}>
                        {compTag}
                      </span>
                    )}

                    {/* Home Team */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      {homeLogo ? (
                        <img
                          src={homeLogo}
                          alt=""
                          style={{ width: '14px', height: '14px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <Shield size={10} color="#94A3B8" />
                      )}
                      <span style={{ color: '#FFFFFF', maxWidth: '75px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {homeName}
                      </span>
                    </div>

                    {/* Score / VS Display */}
                    {isUpcoming ? (
                      <span style={{
                        color: '#d6bc66',
                        fontFamily: 'monospace',
                        fontWeight: '900',
                        fontSize: '0.78rem',
                        padding: '0 2px'
                      }}>
                        VS
                      </span>
                    ) : (
                      <span style={{
                        color: isLive ? '#10B981' : '#d6bc66',
                        fontFamily: 'monospace',
                        fontWeight: '900',
                        fontSize: '0.86rem',
                        padding: '0 2px'
                      }}>
                        {m.homeScore ?? 0} - {m.awayScore ?? 0}
                      </span>
                    )}

                    {/* Away Team */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <span style={{ color: '#FFFFFF', maxWidth: '75px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {awayName}
                      </span>
                      {awayLogo ? (
                        <img
                          src={awayLogo}
                          alt=""
                          style={{ width: '14px', height: '14px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <Shield size={10} color="#94A3B8" />
                      )}
                    </div>

                    {/* Match Status indicator */}
                    {isLive ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.66rem',
                        color: '#10B981',
                        fontWeight: '900',
                        background: 'rgba(16, 185, 129, 0.12)',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        <span style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: '#10B981',
                          boxShadow: '0 0 5px #10B981'
                        }} />
                        <span>{m.currentMinute ? `${m.currentMinute}'` : 'LIVE'}</span>
                      </span>
                    ) : isFinished ? (
                      <span style={{
                        fontSize: '0.64rem',
                        color: '#94A3B8',
                        fontWeight: '800',
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '1px 4px',
                        borderRadius: '3px'
                      }}>
                        FT
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '0.64rem',
                        color: '#d6bc66',
                        fontWeight: '800',
                        background: 'rgba(214, 188, 102, 0.1)',
                        padding: '1px 4px',
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
