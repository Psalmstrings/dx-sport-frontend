import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, Shield, Share2, Check, Link2, Activity, Trophy, Bell, Play } from 'lucide-react';
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
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`,
    x: `https://twitter.com/intent/tweet?url=${shareUrlEncoded}&text=${shareTitleEncoded}%20via%20@DXSportsbr`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareTitleEncoded}%20${shareUrlEncoded}`,
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
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : 'Match Date TBD';

  const formattedTime = match.matchDate ? new Date(match.matchDate).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(3, 8, 28, 0.94)',
      backdropFilter: 'blur(12px)',
      zIndex: 2100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem',
      overflowY: 'auto'
    }}>
      <div
        className="glass-panel-gold"
        style={{
          maxWidth: '780px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: '16px',
          position: 'relative',
          backgroundColor: '#000b3d',
          border: '1px solid rgba(214, 188, 102, 0.35)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
          animation: 'fadeIn 0.22s ease-out'
        }}
      >
        {/* Header Bar */}
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#000726',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid rgba(214, 188, 102, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={18} color="#d6bc66" />
            <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#d6bc66', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
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
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(214, 188, 102, 0.25)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scoreboard Hero Banner */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(5, 20, 84, 0.9) 0%, rgba(0, 11, 61, 0.95) 100%)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          borderBottom: '1px solid rgba(214, 188, 102, 0.2)'
        }}>
          {/* Status Badge */}
          <div style={{ marginBottom: '1.25rem' }}>
            {isLive ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10B981',
                color: '#10B981',
                padding: '5px 14px',
                borderRadius: '20px',
                fontWeight: '900',
                fontSize: '0.78rem',
                letterSpacing: '0.05em'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 10px #10B981',
                  animation: 'pulse 1.5s infinite'
                }} />
                <span>LIVE {match.currentMinute ? `• ${match.currentMinute}'` : ''}</span>
              </span>
            ) : isFinished ? (
              <span style={{
                backgroundColor: 'rgba(214, 188, 102, 0.15)',
                border: '1px solid rgba(214, 188, 102, 0.4)',
                color: '#d6bc66',
                padding: '4px 14px',
                borderRadius: '20px',
                fontWeight: '900',
                fontSize: '0.78rem',
                letterSpacing: '0.05em'
              }}>
                FULL TIME
              </span>
            ) : (
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#94A3B8',
                padding: '4px 14px',
                borderRadius: '20px',
                fontWeight: '800',
                fontSize: '0.78rem',
                letterSpacing: '0.05em'
              }}>
                UPCOMING FIXTURE
              </span>
            )}
          </div>

          {/* Confrontation Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '560px',
            margin: '0 auto',
            gap: '1rem'
          }}>
            {/* Home Team */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '2px solid rgba(214,188,102,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px auto',
                overflow: 'hidden'
              }}>
                {homeLogo ? (
                  <img
                    src={homeLogo}
                    alt={homeName}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <Shield size={32} color="#d6bc66" />
                )}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#FFFFFF', lineHeight: 1.2 }}>
                {homeName}
              </div>
              {homeTeam?.code && (
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#d6bc66', marginTop: '2px' }}>
                  {homeTeam.code}
                </div>
              )}
            </div>

            {/* Score Center */}
            <div style={{ minWidth: '130px', textAlign: 'center' }}>
              {isUpcoming ? (
                <div>
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: '900',
                    color: '#d6bc66',
                    letterSpacing: '0.1em'
                  }}>
                    VS
                  </div>
                  {formattedTime && (
                    <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: '800', marginTop: '4px' }}>
                      {formattedTime}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{
                    fontSize: '2.75rem',
                    fontWeight: '900',
                    color: isLive ? '#10B981' : '#FFFFFF',
                    fontFamily: 'monospace',
                    letterSpacing: '0.05em',
                    lineHeight: 1
                  }}>
                    {match.homeScore ?? 0} - {match.awayScore ?? 0}
                  </div>
                  {(match.halfTimeHomeScore !== undefined && match.halfTimeAwayScore !== undefined) && (
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '700', marginTop: '6px' }}>
                      HT: {match.halfTimeHomeScore} - {match.halfTimeAwayScore}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '2px solid rgba(214,188,102,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px auto',
                overflow: 'hidden'
              }}>
                {awayLogo ? (
                  <img
                    src={awayLogo}
                    alt={awayName}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <Shield size={32} color="#d6bc66" />
                )}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#FFFFFF', lineHeight: 1.2 }}>
                {awayName}
              </div>
              {awayTeam?.code && (
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#d6bc66', marginTop: '2px' }}>
                  {awayTeam.code}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Match Meta Information Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {/* Venue */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(214, 188, 102, 0.15)',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <MapPin size={20} color="#d6bc66" />
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>
                  VENUE / STADIUM
                </div>
                <div style={{ fontSize: '0.88rem', color: '#FFFFFF', fontWeight: '800' }}>
                  {match.venue || homeTeam?.stadium || 'Official Stadium'}
                </div>
              </div>
            </div>

            {/* Date & Kickoff */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(214, 188, 102, 0.15)',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Calendar size={20} color="#d6bc66" />
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>
                  MATCHDAY DATE
                </div>
                <div style={{ fontSize: '0.88rem', color: '#FFFFFF', fontWeight: '800' }}>
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
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: '900',
                color: '#d6bc66',
                letterSpacing: '0.05em',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Activity size={16} />
                <span>MATCH TIMELINE & KEY EVENTS</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {match.events.map((evt, idx) => (
                  <div
                    key={evt._id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        background: '#d6bc66',
                        color: '#000726',
                        fontWeight: '900',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace'
                      }}>
                        {evt.minute}'
                      </span>
                      <span style={{ color: '#FFF', fontWeight: '800' }}>
                        {evt.player}
                      </span>
                      {evt.detail && (
                        <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>
                          ({evt.detail})
                        </span>
                      )}
                    </div>
                    <span style={{
                      color: evt.type === 'GOAL' ? '#10B981' : evt.type === 'RED_CARD' ? '#EF4444' : '#F59E0B',
                      fontWeight: '800',
                      fontSize: '0.75rem'
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
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: '900',
                color: '#d6bc66',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem'
              }}>
                {match.report ? 'MATCH REPORT & HIGHLIGHTS' : 'MATCH PREVIEW & CONTEXT'}
              </div>
              <p style={{
                fontSize: '0.9rem',
                lineHeight: 1.6,
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
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: '900',
              color: '#d6bc66',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Share2 size={15} />
              <span>SHARE THIS FIXTURE WITH FRIENDS</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* WhatsApp */}
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#25D366',
                  color: '#FFF',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  textDecoration: 'none'
                }}
              >
                <span>WhatsApp</span>
              </a>

              {/* X / Twitter */}
              <a
                href={shareLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#000000',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFF',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  textDecoration: 'none'
                }}
              >
                <span>X / Twitter</span>
              </a>

              {/* Facebook */}
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#1877F2',
                  color: '#FFF',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  textDecoration: 'none'
                }}
              >
                <span>Facebook</span>
              </a>

              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: copied ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(214, 188, 102, 0.4)',
                  color: '#FFF',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {copied ? <Check size={14} color="#FFF" /> : <Link2 size={14} color="#d6bc66" />}
                <span>{copied ? 'Link Copied!' : 'Copy Match Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailModal;
