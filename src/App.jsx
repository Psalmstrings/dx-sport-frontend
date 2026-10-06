import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ScoreTicker from './components/ScoreTicker';
import HeroSlider from './components/HeroSlider';
import NewsFeed from './components/NewsFeed';
import MatchCenter from './components/MatchCenter';
import LeagueTable from './components/LeagueTable';
import MediaGallery from './components/MediaGallery';
import PostDetailModal from './components/PostDetailModal';
import LoginModal from './components/LoginModal';
import AdminPortal from './components/AdminPortal';
import DXLogo from './assets/DXLogo';
import { API } from './services/api';
import AcademyRouter from './academy/AcademyRouter';

// ─────────────────────────────────────────────────────────────────────────────
// Determine initial layout from the current URL.
// Returns 'ACADEMY' if the path starts with /academy or /verify-certificate,
// otherwise returns 'HOME' (sports website).
// ─────────────────────────────────────────────────────────────────────────────
const getInitialCategory = () => {
  if (typeof window !== 'undefined') {
    const p = window.location.pathname;
    if (p.startsWith('/academy') || p.startsWith('/verify-certificate')) {
      return 'ACADEMY';
    }
  }
  return 'HOME';
};

export function App() {
  const [activeCategory, setActiveCategory] = useState(getInitialCategory);

  // ── Sports website state ───────────────────────────────────────────────────
  const [posts, setPosts] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore sports admin user from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('dx_user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (e) {}
    }
  }, []);

  // Load sports data (only when not in Academy mode)
  const loadData = async () => {
    setLoading(true);
    const categoryToFetch = (
      activeCategory === 'HOME' ||
      activeCategory === 'NEWS' ||
      activeCategory === 'FIXTURES' ||
      activeCategory === 'TABLE' ||
      activeCategory === 'MEDIA'
    ) ? 'ALL' : activeCategory;

    const [fetchedPosts, fetchedMatches, fetchedStandings, fetchedMedia] = await Promise.all([
      API.getPosts(categoryToFetch),
      API.getMatches(),
      API.getStandings(),
      API.getMedia(),
    ]);

    setPosts(fetchedPosts);
    setMatches(fetchedMatches);
    setStandings(fetchedStandings);
    setMediaItems(fetchedMedia);
    setLoading(false);

    // Open a specific article if a shared /news/:slug URL was used
    const initialSlug = window.__DX_INITIAL_SLUG__;
    if (initialSlug && !selectedPost) {
      const found = fetchedPosts.find(p => p.slug === initialSlug);
      if (found) {
        setSelectedPost(found);
      } else {
        API.getPostBySlug(initialSlug).then(post => {
          if (post) setSelectedPost(post);
        });
      }
      window.__DX_INITIAL_SLUG__ = null;
    }
  };

  useEffect(() => {
    if (activeCategory !== 'ACADEMY') {
      loadData();
    }
  }, [activeCategory]);

  // Listen to browser back/forward so the layout switches correctly
  useEffect(() => {
    const handlePop = () => {
      const p = window.location.pathname;
      if (p.startsWith('/academy') || p.startsWith('/verify-certificate')) {
        setActiveCategory('ACADEMY');
      } else if (activeCategory === 'ACADEMY') {
        setActiveCategory('HOME');
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [activeCategory]);

  // Article modal helpers
  const handlePostSelect = (post) => {
    setSelectedPost(post);
    if (post && post.slug) {
      window.history.pushState({ slug: post.slug }, post.title || '', `/news/${post.slug}`);
    }
  };
  const handlePostClose = () => {
    setSelectedPost(null);
    window.history.pushState({}, 'DX SPORTS', '/');
  };

  const handleLogout = () => {
    localStorage.removeItem('dx_auth_token');
    localStorage.removeItem('dx_user');
    setUser(null);
  };

  const navigateTo = (category) => {
    setActiveCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called from the Academy "← Back to DX Sports" button
  const handleBackToSports = () => {
    setActiveCategory('HOME');
    window.history.pushState({}, 'DX SPORTS', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // LAYOUT SWITCH — this is the architectural fix.
  //
  // When the user is in the Academy:
  //   → Render ONLY <AcademyRouter /> as a full-page shell.
  //   → The sports Navbar, ScoreTicker, AdminPortal, HeroSlider, main
  //     content, and sports Footer are completely UNMOUNTED.
  //
  // When the user is on the sports website:
  //   → Render the sports layout normally.
  //   → AcademyRouter is completely UNMOUNTED.
  //
  // There is NO nesting of one layout inside the other.
  // ─────────────────────────────────────────────────────────────────────────
  if (activeCategory === 'ACADEMY') {
    return (
      <AcademyRouter onBackToSports={handleBackToSports} />
    );
  }

  // ── SPORTS WEBSITE LAYOUT ─────────────────────────────────────────────────
  return (
    <div className="app-container">
      {/* 1. Sports Header / Navigation */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onOpenLogin={() => setIsLoginOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* 2. Live Scores Ticker */}
      <ScoreTicker
        matches={matches}
        onMatchSelect={(m) => console.log('Selected match', m)}
      />

      {/* 3. Main Content */}
      <main className="main-content">
        {/* Admin / Editor Control Portal (visible to logged-in sports admins) */}
        {user && <AdminPortal user={user} onRefreshData={loadData} />}

        {/* Hero Banner (Home & News only) */}
        {(activeCategory === 'HOME' || activeCategory === 'NEWS') && (
          <HeroSlider posts={posts} onPostSelect={handlePostSelect} />
        )}

        {/* Content routing for sports website */}
        {activeCategory === 'MEDIA' ? (
          <MediaGallery mediaItems={mediaItems} />
        ) : activeCategory === 'FIXTURES' ? (
          <MatchCenter matches={matches} isHome={false} />
        ) : activeCategory === 'TABLE' ? (
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <LeagueTable standings={standings} />
          </div>
        ) : activeCategory === 'NEWS' ? (
          <div className="content-grid">
            <div>
              <NewsFeed
                posts={posts}
                activeCategory={activeCategory}
                onPostSelect={handlePostSelect}
                isHome={false}
              />
            </div>
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <LeagueTable standings={standings} onViewFullTable={() => navigateTo('TABLE')} />
            </aside>
          </div>
        ) : (
          /* HOME layout */
          <>
            <MatchCenter
              matches={matches}
              isHome={true}
              onViewMore={() => navigateTo('FIXTURES')}
            />
            <div className="content-grid">
              <div>
                <NewsFeed
                  posts={posts}
                  activeCategory={activeCategory}
                  onPostSelect={handlePostSelect}
                  isHome={true}
                  onViewMoreNews={() => navigateTo('NEWS')}
                />
              </div>
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <LeagueTable
                  standings={standings}
                  onViewFullTable={() => navigateTo('TABLE')}
                />
              </aside>
            </div>
          </>
        )}
      </main>

      {/* 4. Sports Footer */}
      <footer style={{
        backgroundColor: '#000b3d',
        borderTop: '2px solid #d6bc66',
        padding: '2.5rem 1.25rem 1.5rem 1.25rem',
        marginTop: '3rem',
      }}>
        <div style={{
          maxWidth: '1340px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          {/* Left: Brand */}
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#FFFFFF', letterSpacing: '0.05em', margin: 0 }}>
              DX SPORTS
            </h2>
            <div style={{ fontSize: '0.825rem', color: '#94A3B8', fontWeight: '700', marginTop: '6px' }}>
              © {new Date().getFullYear()} DX SPORTS. All rights reserved.
            </div>
          </div>

          {/* Center: Socials */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#d6bc66', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              FOLLOW US:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/DXSportsbr/"
                target="_blank"
                rel="noopener noreferrer"
                title="DX Sports Facebook"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(214, 188, 102, 0.3)', color: '#FFFFFF', padding: '8px 14px', borderRadius: '20px', fontSize: '0.825rem', fontWeight: '800', transition: 'all 0.2s ease', textDecoration: 'none' }}
                onMouseOver={e => { e.currentTarget.style.backgroundColor = '#1877F2'; e.currentTarget.style.borderColor = '#1877F2'; }}
                onMouseOut={e => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(214, 188, 102, 0.3)'; }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                <span>Facebook</span>
              </a>
              {/* X / Twitter */}
              <a
                href="https://x.com/DXSportsbr"
                target="_blank"
                rel="noopener noreferrer"
                title="DX Sports X"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(214, 188, 102, 0.3)', color: '#FFFFFF', padding: '8px 14px', borderRadius: '20px', fontSize: '0.825rem', fontWeight: '800', transition: 'all 0.2s ease', textDecoration: 'none' }}
                onMouseOver={e => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.borderColor = '#FFFFFF'; }}
                onMouseOut={e => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(214, 188, 102, 0.3)'; }}
              >
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                <span>X</span>
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com/channel/UCKTdgZGovXp1D2pdu-G7taQ"
                target="_blank"
                rel="noopener noreferrer"
                title="DX Sports YouTube"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(214, 188, 102, 0.3)', color: '#FFFFFF', padding: '8px 14px', borderRadius: '20px', fontSize: '0.825rem', fontWeight: '800', transition: 'all 0.2s ease', textDecoration: 'none' }}
                onMouseOver={e => { e.currentTarget.style.backgroundColor = '#FF0000'; e.currentTarget.style.borderColor = '#FF0000'; }}
                onMouseOut={e => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(214, 188, 102, 0.3)'; }}
              >
                <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Right: Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', fontWeight: '800', color: '#d6bc66', flexWrap: 'wrap' }}>
            <a href="#" onClick={e => e.preventDefault()} style={{ transition: 'color 0.2s' }}>PRIVACY</a>
            <a href="#" onClick={e => e.preventDefault()} style={{ transition: 'color 0.2s' }}>TERMS</a>
            <a
              href="mailto:dxsportsofficial@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(214, 188, 102, 0.3)', color: '#FFFFFF', padding: '8px 14px', borderRadius: '20px', fontSize: '0.825rem', fontWeight: '800', transition: 'all 0.2s ease', textDecoration: 'none' }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = '#cedb14'; e.currentTarget.style.borderColor = '#FF0000'; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(214, 188, 102, 0.3)'; }}
            >
              <span>Place your Advert</span>
            </a>
          </div>
        </div>
      </footer>

      {/* 5. Modals (sports site only) */}
      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={handlePostClose} />
      )}
      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={(u) => setUser(u)}
        />
      )}
    </div>
  );
}

export default App;
