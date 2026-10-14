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

/**
 * Map a league code (or full name) → the correct short display label shown on
 * every match card.  Add new competitions here as the platform expands.
 *
 * Priority: code match → name substring match → raw name → 'Football'
 *
 * This ensures:
 *   NPFL matches  → "NPFL"          (Nigeria Premier Football League)
 *   EPL matches   → "Premier League" (English Premier League)
 *   La Liga       → "La Liga"
 *   …and so on
 */
const LEAGUE_CODE_MAP = {
  // Nigerian
  NPFL:         'NPFL',
  'NPFL1':      'NPFL',
  'NGA.1':      'NPFL',
  // English
  EPL:          'EPL',
  PL:           'EPL',
  'ENG.1':      'EPL',
  // Spanish
  LALIGA:       'La Liga',
  PD:           'La Liga',
  'ESP.1':      'La Liga',
  // Italian
  SERIEA:       'Serie A',
  SA:           'Serie A',
  'ITA.1':      'Serie A',
  // German
  BL1:          'Bundesliga',
  BUNDESLIGA:   'Bundesliga',
  'GER.1':      'Bundesliga',
  // French
  FL1:          'Ligue 1',
  LIGUE1:       'Ligue 1',
  'FRA.1':      'Ligue 1',
  // UEFA
  CL:           'Champions League',
  UCL:          'Champions League',
  UEL:          'Europa League',
  EL:           'Europa League',
  UECL:         'Conference League',
  // South American
  BSA:          'Brasileirão',
  APT:          'Primera División',
  // CAF
  CAF:          'CAF',
  CAFCL:        'CAF Champions League',
};

const NAME_FRAGMENT_MAP = [
  ['Nigeria Premier',     'NPFL'],
  ['Nigerian Professional','NPFL'],
  ['Nigerian Premier',    'NPFL'],
  ['NPFL',                'NPFL'],
  ['English Premier',     'EPL'],
  ['Premier League',      'EPL'],
  ['La Liga',             'La Liga'],
  ['Serie A',             'Serie A'],
  ['Bundesliga',          'Bundesliga'],
  ['Ligue 1',             'Ligue 1'],
  ['Champions League',    'Champions League'],
  ['Europa League',       'Europa League'],
  ['Conference League',   'Conference League'],
];

const getLeagueDisplayName = (league) => {
  if (!league) return 'Football';

  // Populated object from API: { name, code, shortName, … }
  if (typeof league === 'object') {
    const name = league.name || '';
    const code = (league.code || '').toUpperCase().trim();
    const short = (league.shortName || '').toUpperCase().trim();

    // 1. Authoritative check for NPFL
    if (short === 'NPFL' || code === 'NPFL' || /nigeri/i.test(name) || /npfl/i.test(name)) {
      return 'NPFL';
    }

    // 2. Authoritative check for English Premier League / EPL
    if (short === 'EPL' || code === 'EPL' || /english premier/i.test(name)) {
      return 'EPL';
    }

    if (league.shortName) return league.shortName;

    // 3. Name takes priority
    for (const [fragment, label] of NAME_FRAGMENT_MAP) {
      if (name && name.toLowerCase().includes(fragment.toLowerCase())) return label;
    }

    // 4. Code fallback
    if (code && LEAGUE_CODE_MAP[code]) return LEAGUE_CODE_MAP[code];

    return name || code || 'Football';
  }

  // Raw string (un-populated)
  const str = String(league).trim();
  const strUpper = str.toUpperCase();
  if (strUpper === 'NPFL' || /nigeri/i.test(str)) return 'NPFL';
  if (strUpper === 'EPL' || /english premier/i.test(str)) return 'EPL';
  if (LEAGUE_CODE_MAP[strUpper]) return LEAGUE_CODE_MAP[strUpper];
  for (const [fragment, label] of NAME_FRAGMENT_MAP) {
    if (str.toLowerCase().includes(fragment.toLowerCase())) return label;
  }
  return str || 'Football';
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
  const [competitionFilter, setCompetitionFilter] = useState('ALL'); // 'ALL' | competitionId

  // Extract unique competitions present in the matches dataset
  const availableCompetitions = React.useMemo(() => {
    const map = new Map();
    matches.forEach((m) => {
      if (!m.league) return;
      const id = typeof m.league === 'object'
        ? (m.league._id || m.league.code || m.league.shortName)
        : String(m.league);
      const label = typeof m.league === 'object'
        ? (m.league.shortName || m.league.code || m.league.name)
        : getLeagueDisplayName(m.league);
      if (id && !map.has(id)) {
        map.set(id, { id, label });
      }
    });
    return Array.from(map.values());
  }, [matches]);

  // Filter matches by selected competition
  const filteredMatches = React.useMemo(() => {
    if (competitionFilter === 'ALL') return matches;
    return matches.filter((m) => {
      if (!m.league) return false;
      const id = typeof m.league === 'object'
        ? (m.league._id || m.league.code || m.league.shortName)
        : String(m.league);
      return id === competitionFilter;
    });
  }, [matches, competitionFilter]);

  // Separate filtered matches into upcoming and played (finished / live)
  const upcomingMatches = filteredMatches.filter(
    (m) => m.status === 'UPCOMING' || !m.status
  );
  const playedMatches = filteredMatches.filter(
    (m) => m.status === 'FINISHED' || m.status === 'LIVE'
  );

  // For Homepage: strictly display at most 4 upcoming matches (or first 4 if none explicitly marked)
  const homeDisplayMatches = (upcomingMatches.length > 0 ? upcomingMatches : filteredMatches).slice(0, 4);

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
          <span style={{
            fontSize: '0.74rem',
            fontWeight: '900',
            color: '#d6bc66',
            letterSpacing: '0.05em',
            background: 'rgba(214, 188, 102, 0.12)',
            border: '1px solid rgba(214, 188, 102, 0.35)',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            {getLeagueDisplayName(item.league)}
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

        {/* Dynamic Competition Filter Bar (Homepage) */}
        {availableCompetitions.length > 1 && (
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '1.25rem',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setCompetitionFilter('ALL')}
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.74rem',
                fontWeight: '800',
                cursor: 'pointer',
                border: competitionFilter === 'ALL' ? '1px solid #d6bc66' : '1px solid rgba(255,255,255,0.12)',
                background: competitionFilter === 'ALL' ? 'rgba(214,188,102,0.2)' : 'rgba(0,11,61,0.6)',
                color: competitionFilter === 'ALL' ? '#d6bc66' : '#FFF',
                transition: 'all 0.2s'
              }}
            >
              ALL ({matches.length})
            </button>
            {availableCompetitions.map((comp) => {
              const isSelected = competitionFilter === comp.id;
              const count = matches.filter((m) => {
                const id = typeof m.league === 'object' ? (m.league._id || m.league.code || m.league.shortName) : String(m.league);
                return id === comp.id;
              }).length;
              return (
                <button
                  key={comp.id}
                  onClick={() => setCompetitionFilter(comp.id)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    border: isSelected ? '1px solid #d6bc66' : '1px solid rgba(255,255,255,0.12)',
                    background: isSelected ? 'rgba(214,188,102,0.2)' : 'rgba(0,11,61,0.6)',
                    color: isSelected ? '#d6bc66' : '#FFF',
                    transition: 'all 0.2s'
                  }}
                >
                  {comp.label} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* 4 Cards Grid */}
        {homeDisplayMatches.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            {homeDisplayMatches.map(renderMatchCard)}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8', marginBottom: '1.5rem' }}>
            No matches found for the selected competition.
          </div>
        )}

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
            ALL ({filteredMatches.length})
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

      {/* Dynamic Competition Filter Bar (Dedicated Page) */}
      {availableCompetitions.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          alignItems: 'center',
          background: 'rgba(0, 11, 61, 0.5)',
          padding: '10px 14px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            FILTER BY LEAGUE / CUP:
          </span>
          <button
            onClick={() => setCompetitionFilter('ALL')}
            style={{
              padding: '5px 14px',
              borderRadius: '20px',
              fontSize: '0.76rem',
              fontWeight: '800',
              cursor: 'pointer',
              border: competitionFilter === 'ALL' ? '1px solid #d6bc66' : '1px solid rgba(255,255,255,0.12)',
              background: competitionFilter === 'ALL' ? 'rgba(214,188,102,0.2)' : 'rgba(5,20,84,0.6)',
              color: competitionFilter === 'ALL' ? '#d6bc66' : '#FFF',
              transition: 'all 0.2s'
            }}
          >
            ALL COMPETITIONS ({matches.length})
          </button>
          {availableCompetitions.map((comp) => {
            const isSelected = competitionFilter === comp.id;
            const count = matches.filter((m) => {
              const id = typeof m.league === 'object' ? (m.league._id || m.league.code || m.league.shortName) : String(m.league);
              return id === comp.id;
            }).length;
            return (
              <button
                key={comp.id}
                onClick={() => setCompetitionFilter(comp.id)}
                style={{
                  padding: '5px 14px',
                  borderRadius: '20px',
                  fontSize: '0.76rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #d6bc66' : '1px solid rgba(255,255,255,0.12)',
                  background: isSelected ? 'rgba(214,188,102,0.2)' : 'rgba(5,20,84,0.6)',
                  color: isSelected ? '#d6bc66' : '#FFF',
                  transition: 'all 0.2s'
                }}
              >
                {comp.label} ({count})
              </button>
            );
          })}
        </div>
      )}

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
                No upcoming matches scheduled for this selection.
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
                No match results recorded for this selection.
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
              <p style={{ fontSize: '0.88rem' }}>Check back soon for newly scheduled games in this competition.</p>
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
