import React, { useState, useEffect } from 'react';
import {
  Activity, TrendingUp, TrendingDown, Users, Eye, Globe, Compass,
  Smartphone, Monitor, Tablet, Calendar, RefreshCw, Share2,
  ExternalLink, BarChart3, Sparkles, Clock, Search, ArrowUpRight
} from 'lucide-react';
import { API } from '../services/api';

export const VisitorAnalytics = () => {
  const [period, setPeriod] = useState('week'); // 'day' | 'week' | 'month' | 'year'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metricMode, setMetricMode] = useState('views'); // 'views' | 'visitors'
  const [hoveredBar, setHoveredBar] = useState(null);
  const [liveSearch, setLiveSearch] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchAnalytics = async (selectedPeriod = period) => {
    setLoading(true);
    try {
      const res = await API.getAnalyticsDashboard(selectedPeriod);
      if (res && res.success) {
        setData(res);
      } else {
        setFeedbackMsg('Failed to load analytics: ' + (res?.error || 'Unknown error'));
      }
    } catch (err) {
      setFeedbackMsg('Connection error fetching analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const handleSeedData = async () => {
    if (!window.confirm('Generate fresh realistic baseline traffic data for the past 30 days?')) return;
    setIsSeeding(true);
    try {
      const res = await API.seedAnalyticsData(period);
      if (res && res.success) {
        setData(res);
        setFeedbackMsg('Realistic visitor traffic baseline generated successfully!');
        setTimeout(() => setFeedbackMsg(''), 4000);
      }
    } catch (err) {
      setFeedbackMsg('Error generating demo data');
    } finally {
      setIsSeeding(false);
    }
  };

  const summary = data?.summary || {
    totalViews: 0,
    uniqueVisitors: 0,
    totalSessions: 0,
    viewsPerVisitor: 0,
    viewsGrowth: 0,
    visitorsGrowth: 0,
    allTimeViews: 0
  };

  const timeline = data?.timeline || [];
  const sources = data?.sources || [];
  const topPages = data?.topPages || [];
  const devices = data?.devices || [];
  const browsers = data?.browsers || [];
  const operatingSystems = data?.operatingSystems || [];
  const recentVisits = data?.recentVisits || [];

  // Filtered live visits
  const filteredRecentVisits = recentVisits.filter(v => {
    if (!liveSearch) return true;
    const term = liveSearch.toLowerCase();
    return (
      (v.path && v.path.toLowerCase().includes(term)) ||
      (v.title && v.title.toLowerCase().includes(term)) ||
      (v.referrerSource && v.referrerSource.toLowerCase().includes(term)) ||
      (v.browser && v.browser.toLowerCase().includes(term)) ||
      (v.device && v.device.toLowerCase().includes(term))
    );
  });

  // Calculate chart max value
  const maxMetricVal = Math.max(
    ...timeline.map(item => (metricMode === 'views' ? item.views : item.uniqueVisitors)),
    10
  );

  const getPeriodLabel = () => {
    if (period === 'day') return 'Today (24 Hours)';
    if (period === 'week') return 'This Week (Last 7 Days)';
    if (period === 'month') return 'This Month (Last 30 Days)';
    return 'This Year (12 Months)';
  };

  const getComparisonLabel = () => {
    if (period === 'day') return 'vs yesterday';
    if (period === 'week') return 'vs previous 7 days';
    if (period === 'month') return 'vs previous 30 days';
    return 'vs previous year';
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'recently';
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return `${Math.max(1, seconds)}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'Google':
        return '🔍';
      case 'WhatsApp':
        return '💬';
      case 'Twitter / X':
        return '🐦';
      case 'Facebook':
        return '👥';
      case 'Instagram':
        return '📷';
      case 'Direct':
        return '🔗';
      default:
        return '🌐';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#FFF' }}>
      {/* ── 1. TOP HEADER & PERIOD SWITCHER ── */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderLeft: '4px solid #d6bc66'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={22} style={{ color: '#d6bc66' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', letterSpacing: '0.5px' }}>
              WEBSITE VISITORS & TRAFFIC ANALYTICS
            </h3>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                border: '1px solid #10B981',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
              LIVE TELEMETRY
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94A3B8' }}>
            Real-time tracking of visitor traffic, page views, referral origins, and engagement patterns.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              background: 'rgba(0, 11, 61, 0.8)',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {[
              { id: 'day', label: 'Per Day' },
              { id: 'week', label: 'Per Week' },
              { id: 'month', label: 'Per Month' },
              { id: 'year', label: 'Per Year' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPeriod(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: period === tab.id ? 'var(--gold-gray-yellow, #d6bc66)' : 'transparent',
                  color: period === tab.id ? '#000b3d' : '#CBD5E1'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAnalytics(period)}
            disabled={loading}
            title="Refresh analytics data"
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            title="Generate realistic traffic baseline for demonstration"
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              background: 'rgba(214, 188, 102, 0.15)',
              border: '1px solid rgba(214, 188, 102, 0.4)',
              color: '#d6bc66',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={14} />
            {isSeeding ? 'Seeding...' : 'Populate Baseline'}
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10B981',
            color: '#10B981',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '700'
          }}
        >
          {feedbackMsg}
        </div>
      )}

      {/* ── 2. SUMMARY METRIC CARDS ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1rem'
        }}
      >
        {/* Metric 1: Total Views */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>
              Total Page Views
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(214, 188, 102, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d6bc66'
              }}
            >
              <Eye size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#FFF', margin: '8px 0 4px 0' }}>
            {summary.totalViews.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
            <span
              style={{
                color: summary.viewsGrowth >= 0 ? '#10B981' : '#EF4444',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              {summary.viewsGrowth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {summary.viewsGrowth >= 0 ? `+${summary.viewsGrowth}%` : `${summary.viewsGrowth}%`}
            </span>
            <span style={{ color: '#64748B' }}>{getComparisonLabel()}</span>
          </div>
        </div>

        {/* Metric 2: Unique Visitors */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>
              Unique Visitors
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8'
              }}
            >
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#FFF', margin: '8px 0 4px 0' }}>
            {summary.uniqueVisitors.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
            <span
              style={{
                color: summary.visitorsGrowth >= 0 ? '#10B981' : '#EF4444',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              {summary.visitorsGrowth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {summary.visitorsGrowth >= 0 ? `+${summary.visitorsGrowth}%` : `${summary.visitorsGrowth}%`}
            </span>
            <span style={{ color: '#64748B' }}>{getComparisonLabel()}</span>
          </div>
        </div>

        {/* Metric 3: Active Sessions */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>
              Browsing Sessions
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C084FC'
              }}
            >
              <Compass size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#FFF', margin: '8px 0 4px 0' }}>
            {summary.totalSessions.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
            Distinct site visits in {getPeriodLabel().toLowerCase()}
          </div>
        </div>

        {/* Metric 4: Views per Visitor (Engagement) */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>
              Pages / Visitor
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(34, 197, 94, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4ADE80'
              }}
            >
              <BarChart3 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#FFF', margin: '8px 0 4px 0' }}>
            {summary.viewsPerVisitor}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
            Avg page consumption depth
          </div>
        </div>
      </div>

      {/* ── 3. VISUAL TIMELINE CHART (PER DAY / PER WEEK / PER MONTH) ── */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '10px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            gap: '1rem'
          }}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#d6bc66' }}>
              TRAFFIC TREND TIMELINE ({getPeriodLabel().toUpperCase()})
            </h4>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: '#94A3B8' }}>
              Histogram breakdown showing audience activity over time
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 11, 61, 0.7)',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <button
              onClick={() => setMetricMode('views')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                background: metricMode === 'views' ? '#d6bc66' : 'transparent',
                color: metricMode === 'views' ? '#000b3d' : '#CBD5E1'
              }}
            >
              Page Views
            </button>
            <button
              onClick={() => setMetricMode('visitors')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                background: metricMode === 'visitors' ? '#38BDF8' : 'transparent',
                color: metricMode === 'visitors' ? '#000b3d' : '#CBD5E1'
              }}
            >
              Unique Visitors
            </button>
          </div>
        </div>

        {/* SVG / HTML Bar Chart */}
        <div style={{ position: 'relative', height: '240px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: timeline.length > 20 ? '3px' : '8px', paddingBottom: '30px' }}>
          {/* Horizontal grid lines */}
          <div style={{ position: 'absolute', inset: '0 0 30px 0', pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ borderBottom: '1px dashed rgba(255, 255, 255, 0.08)', width: '100%', height: '0' }} />
            <div style={{ borderBottom: '1px dashed rgba(255, 255, 255, 0.08)', width: '100%', height: '0' }} />
            <div style={{ borderBottom: '1px dashed rgba(255, 255, 255, 0.08)', width: '100%', height: '0' }} />
          </div>

          {timeline.length > 0 ? (
            timeline.map((item, idx) => {
              const val = metricMode === 'views' ? item.views : item.uniqueVisitors;
              const heightPct = Math.min(100, Math.max(8, (val / maxMetricVal) * 100));
              const isHovered = hoveredBar === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                  style={{
                    flex: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: `${heightPct + 12}%`,
                        background: '#000b3d',
                        border: '1px solid #d6bc66',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        zIndex: 20,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                        pointerEvents: 'none'
                      }}
                    >
                      <div style={{ fontWeight: '800', color: '#d6bc66' }}>{item.label}</div>
                      <div style={{ color: '#FFF' }}>Views: <b>{item.views}</b></div>
                      <div style={{ color: '#38BDF8' }}>Unique: <b>{item.uniqueVisitors}</b></div>
                    </div>
                  )}

                  {/* The Bar */}
                  <div
                    style={{
                      width: '100%',
                      maxWidth: timeline.length > 20 ? '16px' : '36px',
                      height: `${heightPct}%`,
                      background: metricMode === 'views'
                        ? (isHovered ? '#FFF' : 'linear-gradient(180deg, #d6bc66 0%, #b89736 100%)')
                        : (isHovered ? '#FFF' : 'linear-gradient(180deg, #38BDF8 0%, #0284C7 100%)'),
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease, background 0.2s ease',
                      boxShadow: isHovered ? '0 0 10px rgba(214, 188, 102, 0.5)' : 'none'
                    }}
                  />

                  {/* X-axis Label */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      fontSize: timeline.length > 15 ? '0.62rem' : '0.72rem',
                      color: isHovered ? '#d6bc66' : '#94A3B8',
                      fontWeight: isHovered ? '800' : '600',
                      whiteSpace: 'nowrap',
                      transform: timeline.length > 20 ? 'rotate(-45deg)' : 'none',
                      transformOrigin: 'top left'
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ width: '100%', textAlign: 'center', color: '#64748B', paddingTop: '60px' }}>
              No timeline data available for this range
            </div>
          )}
        </div>
      </div>

      {/* ── 4. TWO-COLUMN GRID: HOW PEOPLE VISIT (SOURCES) & TOP PAGES ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Box A: How People Visit (Traffic Acquisition Sources) */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Share2 size={18} style={{ color: '#d6bc66' }} />
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#FFF' }}>
                HOW PEOPLE VISIT THE WEBSITE
              </h4>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#94A3B8' }}>
                Traffic channels & referral origins
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {sources.length > 0 ? (
              sources.map((src, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
                      <span>{getSourceIcon(src.source)}</span>
                      <span>{src.source}</span>
                    </span>
                    <span style={{ color: '#CBD5E1', fontSize: '0.78rem' }}>
                      <b style={{ color: '#FFF' }}>{src.count.toLocaleString()}</b> views ({src.percentage}%)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${src.percentage}%`,
                        height: '100%',
                        background:
                          src.source === 'Google'
                            ? '#4285F4'
                            : src.source === 'WhatsApp'
                            ? '#25D366'
                            : src.source === 'Twitter / X'
                            ? '#1DA1F2'
                            : src.source === 'Facebook'
                            ? '#1877F2'
                            : src.source === 'Instagram'
                            ? '#E1306C'
                            : '#d6bc66',
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#64748B', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                No traffic source data available yet
              </div>
            )}
          </div>
        </div>

        {/* Box B: Top Visited Pages & Content */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Globe size={18} style={{ color: '#d6bc66' }} />
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#FFF' }}>
                TOP VISITED PAGES & CONTENT
              </h4>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#94A3B8' }}>
                Most viewed pages across the site
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {topPages.length > 0 ? (
              topPages.map((page, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(0, 11, 61, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        color: '#FFF',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={page.title}
                    >
                      {page.title || page.path}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                      {page.path}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: '800', color: '#d6bc66', fontSize: '0.85rem' }}>
                      {page.count.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                      {page.percentage}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#64748B', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                No page visit logs recorded yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 5. DEVICES, BROWSERS & OS INSIGHTS ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Device Types */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '10px' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '800', color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Smartphone size={16} style={{ color: '#d6bc66' }} /> DEVICE BREAKDOWN
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {devices.map((d, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {d.device === 'Mobile' ? <Smartphone size={14} /> : d.device === 'Desktop' ? <Monitor size={14} /> : <Tablet size={14} />}
                    {d.device}
                  </span>
                  <span><b>{d.count}</b> ({d.percentage}%)</span>
                </div>
                <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${d.percentage}%`,
                      height: '100%',
                      background: d.device === 'Mobile' ? '#10B981' : d.device === 'Desktop' ? '#38BDF8' : '#F59E0B'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Browsers */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '10px' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '800', color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={16} style={{ color: '#d6bc66' }} /> TOP BROWSERS
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {browsers.map((b, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span>{b.browser}</span>
                  <span><b>{b.count}</b> ({b.percentage}%)</span>
                </div>
                <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${b.percentage}%`, height: '100%', background: '#d6bc66' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Systems */}
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '10px' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '800', color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Monitor size={16} style={{ color: '#d6bc66' }} /> OPERATING SYSTEMS
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {operatingSystems.map((o, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span>{o.os}</span>
                  <span><b>{o.count}</b> ({o.percentage}%)</span>
                </div>
                <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${o.percentage}%`, height: '100%', background: '#A855F7' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. REAL-TIME LIVE ACTIVITY STREAM ── */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '10px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} style={{ color: '#d6bc66' }} />
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#FFF' }}>
                RECENT VISITOR HITS
              </h4>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#94A3B8' }}>
                Live chronological feed of user navigation
              </p>
            </div>
          </div>

          {/* Search/filter box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 11, 61, 0.7)',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              width: '100%',
              maxWidth: '260px'
            }}
          >
            <Search size={14} style={{ color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Filter visits by path / source..."
              value={liveSearch}
              onChange={(e) => setLiveSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFF',
                fontSize: '0.78rem',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>
        </div>

        {/* Live visits table */}
        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {filteredRecentVisits.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredRecentVisits.map((v, i) => (
                <div
                  key={v.id || i}
                  style={{
                    background: 'rgba(0, 11, 61, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '1rem' }}>{getSourceIcon(v.referrerSource)}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '700', color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {v.title || v.path}
                      </div>
                      <div style={{ color: '#94A3B8', fontSize: '0.7rem', display: 'flex', gap: '8px' }}>
                        <span style={{ fontFamily: 'monospace' }}>{v.path}</span>
                        <span>•</span>
                        <span>Source: <b style={{ color: '#d6bc66' }}>{v.referrerSource}</b></span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        color: '#CBD5E1',
                        fontSize: '0.7rem'
                      }}
                    >
                      {v.device} • {v.browser}
                    </span>
                    <span style={{ color: '#64748B', fontSize: '0.72rem', minWidth: '60px', textAlign: 'right' }}>
                      {formatTimeAgo(v.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B', fontSize: '0.85rem' }}>
              {liveSearch ? 'No visits match your filter query' : 'No recent visits recorded yet'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorAnalytics;
