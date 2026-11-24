import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Shield, Share2, Check, Link2, Activity, Trophy } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

export const MatchDetailModal = ({ match, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!match) return null;

  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FINISHED' || match.status === 'COMPLETED';
  const isUpcoming = match.status === 'UPCOMING' || !match.status;

  const homeTeam = typeof match.homeTeam === 'object' ? match.homeTeam : { name: match.homeTeam || 'Home Team' };
  const awayTeam = typeof match.awayTeam === 'object' ? match.awayTeam : { name: match.awayTeam || 'Away Team' };
  const league = typeof match.league === 'object' ? match.league : { name: match.league || 'Football League' };

  const homeName = homeTeam?.name || 'Home Team';
  const awayName = awayTeam?.name || 'Away Team';
  const leagueName = league?.name || league?.code || 'Football League';

  const homeLogo = homeTeam?.logo ? getImageUrl(homeTeam.logo) : '';
  const awayLogo = awayTeam?.logo ? getImageUrl(awayTeam.logo) : '';

  const matchUrl = `${window.location.origin}/match/${match._id}`;
  const shareTitle = `${homeName} vs ${awayName} | DX SPORTS`;
  const shareTitleEncoded = encodeURIComponent(shareTitle);
  const shareUrlEncoded = encodeURIComponent(matchUrl);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${shareTitleEncoded}%20${shareUrlEncoded}`,
    x: `https://twitter.com/intent/tweet?url=${shareUrlEncoded}&text=${shareTitleEncoded}%20via%20@DXSportsbr`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`,
    telegram: `https://t.me/share/url?url=${shareUrlEncoded}&text=${shareTitleEncoded}`
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(matchUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      alert('Match link: ' + matchUrl);
    });
  };

  const formattedDate = match.matchDate ? new Date(match.matchDate).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : 'Date TBD';

  const formattedTime = match.matchDate ? new Date(match.matchDate).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <>
      <style>{`
        .dx-match-modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(3, 8, 28, 0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 2100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(0.35rem, 2vw, 1rem);
          overflow-y: auto;
          box-sizing: border-box;
        }

        .dx-match-modal-card {
          max-width: 720px;
          width: 100%;
          max-height: 94vh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: clamp(10px, 2vw, 16px);
          position: relative;
          background-color: #000b3d;
          border: 1px solid rgba(214, 188, 102, 0.35);
          box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.85);
          box-sizing: border-box;
          animation: dxModalFade 0.2s ease-out;
        }

        @keyframes dxModalFade {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }

        .dx-match-board {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
          gap: clamp(0.4rem, 2vw, 1rem);
          box-sizing: border-box;
        }

        .dx-team-col {
          flex: 1;
          min-width: 0;
          text-align: center;
        }

        .dx-team-logo-box {
          width: clamp(44px, 12vw, 68px);
          height: clamp(44px, 12vw, 68px);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 2px solid rgba(214, 188, 102, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto clamp(6px, 1.5vw, 10px) auto;
          overflow: hidden;
          flex-shrink: 0;
        }

        .dx-team-name-text {
          font-size: clamp(0.8rem, 2.8vw, 1rem);
          font-weight: 900;
          color: #FFFFFF;
          line-height: 1.2;
          word-break: break-word;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .dx-score-col {
          flex-shrink: 0;
          min-width: clamp(70px, 18vw, 115px);
          text-align: center;
        }

        .dx-score-text {
          font-size: clamp(1.8rem, 6.5vw, 2.6rem);
          font-weight: 900;
          font-family: monospace;
          letter-spacing: 0.04em;
          line-height: 1;
        }

        .dx-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: clamp(0.5rem, 1.5vw, 0.85rem);
          margin-bottom: 1.25rem;
        }

        .dx-share-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 7px 13px;
          border-radius: 20px;
          font-size: clamp(0.74rem, 2.2vw, 0.8rem);
          font-weight: 800;
          text-decoration: none;
          flex: 1 1 auto;
          min-width: 80px;
          box-sizing: border-box;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .dx-share-btn:hover {
          opacity: 0.88;
        }

        @media (max-width: 420px) {
          .dx-match-modal-overlay {
            padding: 0.25rem;
          }
          .dx-match-modal-card {
            max-height: 96vh;
            border-radius: 12px;
          }
          .dx-team-logo-box {
            width: 44px;
            height: 44px;
          }
        }
      `}</style>

      <div className="dx-match-modal-overlay" onClick={onClose}>
        <div
          className="dx-match-modal-card"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div style={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#000726',
            padding: 'clamp(0.65rem, 2vw, 0.95rem) clamp(0.75rem, 2.5vw, 1.25rem)',
            borderBottom: '1px solid rgba(214, 188, 102, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            zIndex: 10
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: 0,
              flex: 1,
              overflow: 'hidden'
            }}>
              <Trophy size={16} color="#d6bc66" style={{ flexShrink: 0 }} />
              <span style={{
                fontSize: 'clamp(0.74rem, 2.4vw, 0.86rem)',
                fontWeight: '900',
                color: '#d6bc66',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {leagueName} • MATCH DETAILS
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close match details"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(214, 188, 102, 0.3)',
                color: '#d6bc66',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Scoreboard Hero Banner */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(5, 20, 84, 0.92) 0%, rgba(0, 11, 61, 0.96) 100%)',
            padding: 'clamp(1.1rem, 3.5vw, 1.85rem) clamp(0.75rem, 2vw, 1.25rem)',
            textAlign: 'center',
            borderBottom: '1px solid rgba(214, 188, 102, 0.2)'
          }}>
            {/* Status Badge */}
            <div style={{ marginBottom: 'clamp(0.85rem, 2.5vw, 1.15rem)' }}>
              {isLive ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10B981',
                  color: '#10B981',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontWeight: '900',
                  fontSize: 'clamp(0.7rem, 2.2vw, 0.76rem)',
                  letterSpacing: '0.04em'
                }}>
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 8px #10B981'
                  }} />
                  <span>LIVE {match.currentMinute ? `• ${match.currentMinute}'` : ''}</span>
                </span>
              ) : isFinished ? (
                <span style={{
                  backgroundColor: 'rgba(214, 188, 102, 0.15)',
                  border: '1px solid rgba(214, 188, 102, 0.4)',
                  color: '#d6bc66',
                  padding: '3px 12px',
                  borderRadius: '20px',
                  fontWeight: '900',
                  fontSize: 'clamp(0.7rem, 2.2vw, 0.76rem)',
                  letterSpacing: '0.04em'
                }}>
                  FULL TIME
                </span>
              ) : (
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#94A3B8',
                  padding: '3px 12px',
                  borderRadius: '20px',
                  fontWeight: '800',
                  fontSize: 'clamp(0.7rem, 2.2vw, 0.76rem)',
                  letterSpacing: '0.04em'
                }}>
                  UPCOMING FIXTURE
                </span>
              )}
            </div>

            {/* Confrontation Box */}
            <div className="dx-match-board">
              {/* Home Team */}
              <div className="dx-team-col">
                <div className="dx-team-logo-box">
                  {homeLogo ? (
                    <img
                      src={homeLogo}
                      alt={homeName}
                      style={{ width: '85%', height: '85%', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <Shield size={24} color="#d6bc66" />
                  )}
                </div>
                <div className="dx-team-name-text">
                  {homeName}
                </div>
                {homeTeam?.code && (
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#d6bc66', marginTop: '2px' }}>
                    {homeTeam.code}
                  </div>
                )}
              </div>

              {/* Score Center */}
              <div className="dx-score-col">
                {isUpcoming ? (
                  <div>
                    <div style={{
                      fontSize: 'clamp(1.4rem, 5vw, 1.75rem)',
                      fontWeight: '900',
                      color: '#d6bc66',
                      letterSpacing: '0.08em'
                    }}>
                      VS
                    </div>
                    {formattedTime && (
                      <div style={{ fontSize: 'clamp(0.75rem, 2.4vw, 0.85rem)', color: '#94A3B8', fontWeight: '800', marginTop: '3px' }}>
                        {formattedTime}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="dx-score-text" style={{ color: isLive ? '#10B981' : '#FFFFFF' }}>
                      {match.homeScore ?? 0} - {match.awayScore ?? 0}
                    </div>
                    {(match.halfTimeHomeScore !== undefined && match.halfTimeAwayScore !== undefined) && (
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '700', marginTop: '4px' }}>
                        HT: {match.halfTimeHomeScore} - {match.halfTimeAwayScore}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="dx-team-col">
                <div className="dx-team-logo-box">
                  {awayLogo ? (
                    <img
                      src={awayLogo}
                      alt={awayName}
                      style={{ width: '85%', height: '85%', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <Shield size={24} color="#d6bc66" />
                  )}
                </div>
                <div className="dx-team-name-text">
                  {awayName}
                </div>
                {awayTeam?.code && (
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#d6bc66', marginTop: '2px' }}>
                    {awayTeam.code}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div style={{ padding: 'clamp(0.85rem, 2.5vw, 1.25rem)' }}>
            {/* Match Meta Information Grid */}
            <div className="dx-meta-grid">
              {/* Venue */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(214, 188, 102, 0.15)',
                padding: '0.7rem 0.85rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <MapPin size={18} color="#d6bc66" style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>
                    VENUE
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.76rem, 2.3vw, 0.85rem)',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {match.venue || homeTeam?.stadium || 'Official Stadium'}
                  </div>
                </div>
              </div>

              {/* Date & Kickoff */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(214, 188, 102, 0.15)',
                padding: '0.7rem 0.85rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Calendar size={18} color="#d6bc66" style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>
                    MATCH DATE
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.76rem, 2.3vw, 0.85rem)',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {formattedDate} {formattedTime ? `• ${formattedTime}` : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Match Events / Timeline (if available) */}
            {match.events && match.events.length > 0 && (
              <div style={{
                background: 'rgba(0, 11, 61, 0.8)',
                border: '1px solid rgba(214, 188, 102, 0.25)',
                borderRadius: '10px',
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                marginBottom: '1rem'
              }}>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: '900',
                  color: '#d6bc66',
                  letterSpacing: '0.04em',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Activity size={14} />
                  <span>MATCH TIMELINE & KEY EVENTS</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {match.events.map((evt, idx) => (
                    <div
                      key={evt._id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: 'clamp(0.75rem, 2.3vw, 0.82rem)',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                        <span style={{
                          background: '#d6bc66',
                          color: '#000726',
                          fontWeight: '900',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          fontFamily: 'monospace',
                          flexShrink: 0
                        }}>
                          {evt.minute}'
                        </span>
                        <span style={{ color: '#FFF', fontWeight: '800', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {evt.player}
                        </span>
                        {evt.detail && (
                          <span style={{ color: '#94A3B8', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            ({evt.detail})
                          </span>
                        )}
                      </div>
                      <span style={{
                        color: evt.type === 'GOAL' ? '#10B981' : evt.type === 'RED_CARD' ? '#EF4444' : '#F59E0B',
                        fontWeight: '800',
                        fontSize: '0.72rem',
                        flexShrink: 0
                      }}>
                        {evt.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Match Preview or Report */}
            {(match.preview || match.report) && (
              <div style={{
                background: 'rgba(0, 11, 61, 0.8)',
                border: '1px solid rgba(214, 188, 102, 0.25)',
                borderRadius: '10px',
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                marginBottom: '1rem'
              }}>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: '900',
                  color: '#d6bc66',
                  letterSpacing: '0.04em',
                  marginBottom: '0.5rem'
                }}>
                  {match.report ? 'MATCH REPORT' : 'MATCH PREVIEW'}
                </div>
                <p style={{
                  fontSize: 'clamp(0.8rem, 2.3vw, 0.88rem)',
                  lineHeight: 1.5,
                  color: '#CBD5E1',
                  margin: 0,
                  whiteSpace: 'pre-line'
                }}>
                  {match.report || match.preview}
                </p>
              </div>
            )}

            {/* Share Fixture Section */}
            <div style={{
              background: 'rgba(0, 7, 38, 0.9)',
              border: '1px solid rgba(214, 188, 102, 0.25)',
              borderRadius: '10px',
              padding: 'clamp(0.75rem, 2vw, 1rem)'
            }}>
              <div style={{
                fontSize: '0.76rem',
                fontWeight: '900',
                color: '#d6bc66',
                letterSpacing: '0.04em',
                marginBottom: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Share2 size={13} />
                <span>SHARE THIS FIXTURE</span>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {/* WhatsApp */}
                <a
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dx-share-btn"
                  style={{ backgroundColor: '#25D366', color: '#FFF' }}
                >
                  <span>WhatsApp</span>
                </a>

                {/* X / Twitter */}
                <a
                  href={shareLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dx-share-btn"
                  style={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF' }}
                >
                  <span>X</span>
                </a>

                {/* Facebook */}
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dx-share-btn"
                  style={{ backgroundColor: '#1877F2', color: '#FFF' }}
                >
                  <span>Facebook</span>
                </a>

                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="dx-share-btn"
                  style={{
                    backgroundColor: copied ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(214, 188, 102, 0.4)',
                    color: '#FFF'
                  }}
                >
                  {copied ? <Check size={13} color="#FFF" /> : <Link2 size={13} color="#d6bc66" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchDetailModal;
