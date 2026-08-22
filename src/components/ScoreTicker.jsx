import React from 'react';
import { Activity } from 'lucide-react';

export const ScoreTicker = ({ matches = [], onMatchSelect }) => {
  return (
    <div style={{
      backgroundColor: '#000726',
      borderBottom: '1px solid rgba(214, 188, 102, 0.2)',
      padding: '0.6rem 1rem',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      {/* Ticker Brand Label */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(214, 188, 102, 0.15)',
        border: '1px solid rgba(214, 188, 102, 0.4)',
        color: '#d6bc66',
        padding: '4px 10px',
        borderRadius: '6px',
        fontWeight: '900',
        fontSize: '0.75rem',
        letterSpacing: '0.05em',
        flexShrink: 0
      }}>
        <Activity size={14} color="#d6bc66" />
        <span>LIVE SCORES</span>
      </div>

      {matches.length === 0 ? (
        <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '700' }}>
          NO LIVE SCORES AT PRESENT — Active matches scheduled in portal will stream here.
        </span>
      ) : (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px' }}>
          {matches.map((m) => {
            const isLive = m.status === 'LIVE';

            return (
              <div
                key={m._id}
                onClick={() => onMatchSelect && onMatchSelect(m)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(5, 20, 84, 0.75)',
                  border: isLive ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.08)',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  fontSize: '0.85rem',
                  fontWeight: '800'
                }}
              >
                <span style={{ color: '#E63946' }}>
                  {typeof m.homeTeam === 'object' ? (m.homeTeam?.code || m.homeTeam?.shortName || m.homeTeam?.name) : (m.homeTeam || 'HOME')}
                </span>
                <span style={{ color: '#d6bc66', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {m.homeScore ?? 0} - {m.awayScore ?? 0}
                </span>
                <span style={{ color: '#FFF' }}>
                  {typeof m.awayTeam === 'object' ? (m.awayTeam?.code || m.awayTeam?.shortName || m.awayTeam?.name) : (m.awayTeam || 'AWAY')}
                </span>

                <span style={{
                  fontSize: '0.7rem',
                  color: isLive ? '#10B981' : '#94A3B8',
                  fontWeight: '800',
                  marginLeft: '4px'
                }}>
                  {m.currentMinute || m.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScoreTicker;
