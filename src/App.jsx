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

export function App() {
  const [activeCategory, setActiveCategory] = useState('HOME');
  const [posts, setPosts] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('dx_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    const categoryToFetch = (activeCategory === 'HOME' || activeCategory === 'FIXTURES' || activeCategory === 'MEDIA') ? 'ALL' : activeCategory;
    
    const [fetchedPosts, fetchedMatches, fetchedStandings, fetchedMedia] = await Promise.all([
      API.getPosts(categoryToFetch),
      API.getMatches(),
      API.getStandings(),
      API.getMedia()
    ]);

    setPosts(fetchedPosts);
    setMatches(fetchedMatches);
    setStandings(fetchedStandings);
    setMediaItems(fetchedMedia);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [activeCategory]);

  const handleLogout = () => {
    localStorage.removeItem('dx_auth_token');
    localStorage.removeItem('dx_user');
    setUser(null);
  };

  return (
    <div className="app-container">
      {/* 1. Header Navigation Bar */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onOpenLogin={() => setIsLoginOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* 2. Scores Ticker Bar */}
      <ScoreTicker matches={matches} onMatchSelect={(m) => console.log('Selected match', m)} />

      {/* 3. Main Content Container */}
      <main className="main-content">
        {/* Admin & Editor Control Portal Header (Visible when logged in) */}
        {user && <AdminPortal user={user} onRefreshData={loadData} />}

        {/* Daily News Flash Hero Banner */}
        {(activeCategory === 'HOME' || activeCategory === 'NEWS') && (
          <HeroSlider posts={posts} onPostSelect={(post) => setSelectedPost(post)} />
        )}

        {/* Upcoming Fixtures Section */}
        {(activeCategory === 'HOME' || activeCategory === 'FIXTURES') && (
          <MatchCenter matches={matches} />
        )}

        {/* Content Layout Routing */}
        {activeCategory === 'MEDIA' ? (
          <MediaGallery mediaItems={mediaItems} />
        ) : activeCategory === 'FIXTURES' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <LeagueTable standings={standings} />
          </div>
        ) : (
          /* Content Grid Layout for HOME and NEWS PAGE */
          <div className="content-grid">
            {/* Main Column */}
            <div>
              <NewsFeed
                posts={posts}
                activeCategory={activeCategory}
                onPostSelect={(post) => setSelectedPost(post)}
              />
            </div>

            {/* Sidebar Column */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <LeagueTable standings={standings} />
            </aside>
          </div>
        )}

      </main>

      {/* 4. Prototype Footer */}
      <footer style={{
        backgroundColor: '#000b3d',
        borderTop: '2px solid #d6bc66',
        padding: '2.5rem 1.25rem 1.5rem 1.25rem',
        marginTop: '3rem'
      }}>
        <div style={{
          maxWidth: '1340px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Left Column: White Brand Title & Copyright */}
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#FFFFFF', letterSpacing: '0.05em', margin: 0 }}>
              DX SPORTS
            </h2>
            <div style={{ fontSize: '0.825rem', color: '#94A3B8', fontWeight: '700', marginTop: '6px' }}>
              © {new Date().getFullYear()} DX SPORTS. All rights reserved.
            </div>
          </div>

          {/* Center Column: Social Media Handles */}
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
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(214, 188, 102, 0.3)',
                  color: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: '0.825rem',
                  fontWeight: '800',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1877F2'; e.currentTarget.style.borderColor = '#1877F2'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(214, 188, 102, 0.3)'; }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/DXSportsbr"
                target="_blank"
                rel="noopener noreferrer"
                title="DX Sports X"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(214, 188, 102, 0.3)',
                  color: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: '0.825rem',
                  fontWeight: '800',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.borderColor = '#FFFFFF'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(214, 188, 102, 0.3)'; }}
              >
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X</span>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/channel/UCKTdgZGovXp1D2pdu-G7taQ"
                target="_blank"
                rel="noopener noreferrer"
                title="DX Sports YouTube"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(214, 188, 102, 0.3)',
                  color: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  fontSize: '0.825rem',
                  fontWeight: '800',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FF0000'; e.currentTarget.style.borderColor = '#FF0000'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(214, 188, 102, 0.3)'; }}
              >
                <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Right Column: Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', fontWeight: '800', color: '#d6bc66', flexWrap: 'wrap' }}>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ transition: 'color 0.2s' }}>PRIVACY</a>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ transition: 'color 0.2s' }}>TERMS</a>
            <a href="mailto:dxsportsofficial@gmail.com" onClick={(e) => e.preventDefault()} style={{ transition: 'color 0.2s' }}>ADVERTISE</a>
          </div>
        </div>
      </footer>

      {/* 5. Modals */}
      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
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
