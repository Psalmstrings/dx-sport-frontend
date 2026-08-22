import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

export const TransferHub = ({ transfers = [] }) => {
  const fallbackTransfers = [
    {
      _id: 't-1',
      player: 'Victor Osimhen',
      position: 'ST',
      fromClub: 'Napoli',
      toClub: 'PSG / Premier League',
      fee: '€110M Release Clause',
      status: 'HOT RUMOR'
    },
    {
      _id: 't-2',
      player: 'Ademola Lookman',
      position: 'LW',
      fromClub: 'Atalanta',
      toClub: 'Bayern Munich / Chelsea',
      fee: '€60M Valuation',
      status: 'TALKS ADVANCED'
    },
    {
      _id: 't-3',
      player: 'Kano Pillars Prodigy',
      position: 'CM',
      fromClub: 'Kano Pillars',
      toClub: 'Enyimba FC',
      fee: 'Undisclosed Fee',
      status: 'COMPLETED DEAL'
    }
  ];

  const displayTransfers = transfers.length > 0 ? transfers : fallbackTransfers;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowRightLeft size={20} color="#d6bc66" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', textTransform: 'uppercase' }}>
            TRANSFER MARKET RADAR
          </h3>
        </div>
        <span className="badge-gold">LIVE DEALS</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {displayTransfers.map((t) => (
          <div 
            key={t._id}
            style={{
              background: 'rgba(0, 11, 61, 0.65)',
              border: '1px solid rgba(214, 188, 102, 0.2)',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '800', color: '#FFF', fontSize: '0.95rem' }}>{t.player}</span>
                <span style={{ background: '#000b3d', color: '#d6bc66', fontSize: '0.7rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>{t.position || t.pos || 'FW'}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{t.fromClub || t.from}</span>
                <ArrowRightLeft size={12} color="#d6bc66" />
                <span style={{ color: '#d6bc66', fontWeight: '700' }}>{t.toClub || t.to}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10B981', marginBottom: '2px' }}>
                {t.fee}
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '4px',
                background: t.status === 'COMPLETED DEAL' ? '#10B981' : '#E63946',
                color: '#FFF'
              }}>
                {t.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransferHub;
