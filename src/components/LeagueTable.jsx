import React from 'react';
import { Trophy, Shield } from 'lucide-react';

// Resolve relative logo URLs (same helper as MatchCenter)
const resolveLogoUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const origin = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Form badge colours
const formColor = (f) => {
  if (f === 'W') return { bg: '#10B981', color: '#FFF' };
  if (f === 'D') return { bg: '#F59E0B', color: '#FFF' };
  if (f === 'L') return { bg: '#EF4444', color: '#FFF' };
  return { bg: '#374151', color: '#9CA3AF' };
};

// Position badge style
const posBadgeStyle = (pos) => {
  if (pos === 1) return { background: 'var(--gold-gradient)', color: '#0B1A3A' };
  if (pos <= 3) return { background: '#0B1A3A', color: '#FFF', border: '1px solid rgba(230,198,87,0.4)' };
  return { background: 'transparent', color: '#CBD5E1' };
};

export const LeagueTable = ({ standings = [], leagueName = '' }) => {
  // Derive league name from first standings entry if not passed as prop
  const displayLeagueName = leagueName || 'LEAGUE STANDINGS';

  if (standings.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '1.25rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <Trophy size={20} color="#E6C657" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', textTransform: 'uppercase' }}>
            {displayLeagueName}
          </h3>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
          No teams registered yet. Register teams in the Admin Portal to populate the standings.
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={20} color="#E6C657" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', textTransform: 'uppercase' }}>
            {displayLeagueName}
          </h3>
        </div>
        <span style={{
          fontSize: '0.7rem',
          color: '#d6bc66',
          background: 'rgba(214,188,102,0.12)',
          padding: '3px 10px',
          borderRadius: '4px',
          fontWeight: '800'
        }}>
          {standings.length} TEAMS
        </span>
      </div>

      {/* Scrollable & Mobile Fitted Table */}
      <div className="league-table-wrapper">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ color: '#94A3B8', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '8px 4px', width: '28px', textAlign: 'center' }}>#</th>
              <th style={{ padding: '8px 6px' }}>CLUB</th>
              <th style={{ padding: '8px 4px', textAlign: 'center' }} title="Played">P</th>
              <th style={{ padding: '8px 4px', textAlign: 'center' }} title="Wins">W</th>
              <th style={{ padding: '8px 4px', textAlign: 'center' }} title="Draws">D</th>
              <th style={{ padding: '8px 4px', textAlign: 'center' }} title="Losses">L</th>
              <th className="mobile-hide-col" style={{ padding: '8px 4px', textAlign: 'center' }} title="Goals For">GF</th>
              <th className="mobile-hide-col" style={{ padding: '8px 4px', textAlign: 'center' }} title="Goals Against">GA</th>
              <th style={{ padding: '8px 4px', textAlign: 'center' }} title="Goal Difference">GD</th>
              <th style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '800', color: '#d6bc66' }} title="Points">PTS</th>
              <th style={{ padding: '8px 6px', textAlign: 'center' }}>FORM</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, idx) => {
              const pos = row.position || idx + 1;
              const posStyle = posBadgeStyle(pos);
              const teamLogo = resolveLogoUrl(
                typeof row.team === 'object' ? row.team?.logo : ''
              );
              const teamName = typeof row.team === 'object'
                ? (row.team?.name || row.team?.shortName)
                : row.team;
              const form = Array.isArray(row.form) ? row.form : [];
              const gd = row.goalDifference ?? (row.goalsFor - row.goalsAgainst) ?? 0;

              return (
                <tr
                  key={row._id || idx}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    transition: 'background 0.2s',
                    background: pos <= 2 ? 'rgba(214,188,102,0.05)' : 'transparent'
                  }}
                >
                  {/* Position badge */}
                  <td style={{ padding: '8px 4px', textAlign: 'center' }}>
                    <span style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      ...posStyle
                    }}>
                      {pos}
                    </span>
                  </td>

                  {/* Team name & logo */}
                  <td style={{ padding: '8px 6px', fontWeight: '700', color: '#FFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '1px solid rgba(214,188,102,0.3)',
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {teamLogo ? (
                          <img
                            src={teamLogo}
                            alt={teamName}
                            style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <Shield size={12} color="#d6bc66" />
                        )}
                      </div>
                      <span className="team-name-cell" title={teamName}>{teamName}</span>
                    </div>
                  </td>

                  {/* Played */}
                  <td style={{ padding: '8px 4px', textAlign: 'center', color: '#CBD5E1' }}>
                    {row.played ?? 0}
                  </td>

                  {/* Wins */}
                  <td style={{ padding: '8px 4px', textAlign: 'center', color: '#CBD5E1' }}>
                    {row.won ?? 0}
                  </td>

                  {/* Draws */}
                  <td style={{ padding: '8px 4px', textAlign: 'center', color: '#CBD5E1' }}>
                    {row.drawn ?? 0}
                  </td>

                  {/* Losses */}
                  <td style={{ padding: '8px 4px', textAlign: 'center', color: '#CBD5E1' }}>
                    {row.lost ?? 0}
                  </td>

                  {/* Goals For (Hidden on small mobile) */}
                  <td className="mobile-hide-col" style={{ padding: '8px 4px', textAlign: 'center', color: '#94A3B8' }}>
                    {row.goalsFor ?? 0}
                  </td>

                  {/* Goals Against (Hidden on small mobile) */}
                  <td className="mobile-hide-col" style={{ padding: '8px 4px', textAlign: 'center', color: '#94A3B8' }}>
                    {row.goalsAgainst ?? 0}
                  </td>

                  {/* Goal Difference */}
                  <td style={{
                    padding: '8px 4px',
                    textAlign: 'center',
                    color: gd > 0 ? '#10B981' : gd < 0 ? '#EF4444' : '#94A3B8',
                    fontWeight: gd !== 0 ? '700' : '400'
                  }}>
                    {gd > 0 ? `+${gd}` : gd}
                  </td>

                  {/* Points */}
                  <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: '900', color: '#d6bc66', fontSize: '0.9rem' }}>
                    {row.points ?? 0}
                  </td>

                  {/* Form badges (oldest → newest, left → right) */}
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                    {form.length === 0 ? (
                      <span style={{ color: '#4B5563', fontSize: '0.8rem', fontWeight: '700' }}>—</span>
                    ) : (
                      <div style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
                        {form.map((f, fIdx) => {
                          const fc = formColor(f);
                          return (
                            <span
                              key={fIdx}
                              title={f === 'W' ? 'Win' : f === 'D' ? 'Draw' : 'Loss'}
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '4px',
                                fontSize: '0.65rem',
                                fontWeight: '800',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: fc.bg,
                                color: fc.color
                              }}
                            >
                              {f}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '0.75rem',
        paddingTop: '0.5rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        fontSize: '0.68rem',
        color: '#64748B'
      }}>
        <span>P = Played</span>
        <span>W = Won</span>
        <span>D = Drawn</span>
        <span>L = Lost</span>
        <span>GF = Goals For</span>
        <span>GA = Goals Against</span>
        <span>GD = Goal Diff</span>
        <span>PTS = Points</span>
      </div>
    </div>
  );
};

export default LeagueTable;
