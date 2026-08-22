import React from 'react';
import { Newspaper, Eye, Clock, User, ArrowUpRight, Tag, Share2 } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

export const NewsFeed = ({ posts = [], activeCategory, onPostSelect }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <Newspaper size={48} color="#E6C657" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No stories available in this section yet</h3>
        <p style={{ color: '#94A3B8' }}>Check back soon for latest NPFL, Super Eagles, and European football updates.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Section Heading */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        borderBottom: '2px solid rgba(230, 198, 87, 0.2)',
        paddingBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '4px', height: '24px', backgroundColor: '#E6C657', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            {activeCategory === 'ALL' ? 'LATEST FOOTBALL HEADLINES' : `${activeCategory} NEWS`}
          </h2>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: '600' }}>
          Showing {posts.length} articles
        </span>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {posts.map((post) => (
          <article
            key={post._id}
            onClick={() => onPostSelect(post)}
            className="glass-panel interactive-card"
            style={{
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              {/* Image & Category Pill */}
              <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
                <img
                  src={getImageUrl(post.image || post.coverImage)}
                  alt={post.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />
                <span className="badge-gold" style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                }}>
                  {post.category}
                </span>
              </div>

              {/* Title & Summary */}
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: '800',
                  lineHeight: 1.35,
                  marginBottom: '0.65rem',
                  color: '#FFF'
                }}>
                  {post.title}
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#CBD5E1',
                  lineHeight: 1.45,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '1rem'
                }}>
                  {post.summary}
                </p>
              </div>
            </div>

            {/* Footer Metadata */}
            <div style={{
              padding: '0.85rem 1.25rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: '#94A3B8',
              backgroundColor: 'rgba(11, 26, 58, 0.4)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#E6C657', fontWeight: '600' }}>
                <User size={13} />
                {post.author?.name ? post.author.name.split(' ')[0] : 'DX Staff'}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={13} />
                  {(post.views || 850).toLocaleString()}
                </span>
                <ArrowUpRight size={15} color="#E6C657" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
