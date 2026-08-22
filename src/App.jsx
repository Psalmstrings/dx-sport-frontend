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
    const categoryToFetch = (activeCategory === 'HOME' || activeCategory === 'FEATURES' || activeCategory === 'MEDIA') ? 'ALL' : activeCategory;
    
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
        {(activeCategory === 'HOME' || activeCategory === 'FEATURES') && (
          <MatchCenter matches={matches} />
        )}

        {/* Content Layout Routing */}
        {activeCategory === 'MEDIA' ? (
          <MediaGallery mediaItems={mediaItems} />
        ) : activeCategory === 'FEATURES' ? (
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
        padding: '3rem 1.5rem 1.5rem 1.5rem',
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
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#E63946', letterSpacing: '0.05em' }}>
              DX SPORTS
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '700', marginTop: '4px' }}>
              © 2026 DX SPORTS.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', fontWeight: '800', color: '#d6bc66' }}>
            <a href="#" onClick={(e) => e.preventDefault()}>PRIVACY</a>
            <a href="#" onClick={(e) => e.preventDefault()}>TERMS</a>
            <a href="#" onClick={(e) => e.preventDefault()}>ADVERTISE</a>
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
