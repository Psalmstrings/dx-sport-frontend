import React from 'react';
import { X, Calendar, User, Eye, Share2, Bookmark, Tag, ArrowLeft } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

export const PostDetailModal = ({ post, onClose }) => {
  if (!post) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href }).catch(() => {});
    } else {
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 12, 27, 0.88)',
      backdropFilter: 'blur(10px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div className="glass-panel-gold" style={{
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '16px',
        position: 'relative',
        animation: 'fadeIn 0.25s ease-out'
      }}>
        {/* Header Bar */}
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#0B1A3A',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(230, 198, 87, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          <button 
            onClick={onClose}
            style={{
              color: '#E6C657',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '700',
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft size={18} />
            <span>BACK TO NEWS</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handleShare} style={{ color: '#CBD5E1', padding: '6px' }} title="Share">
              <Share2 size={18} />
            </button>
            <button onClick={onClose} style={{ color: '#E6C657', padding: '6px' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 2rem' }}>
          {/* Category & Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <span className="badge-gold">{post.category}</span>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} />
              {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: '900',
            lineHeight: 1.25,
            color: '#FFF',
            marginBottom: '1rem'
          }}>
            {post.title}
          </h1>

          {/* Author info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'rgba(11, 26, 58, 0.6)',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--gold-gradient)',
              color: '#0B1A3A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800'
            }}>
              <User size={20} />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#FFF', fontSize: '0.9rem' }}>
                {post.author?.name || 'DX Sport Editorial Team'}
              </div>
              <div style={{ color: '#E6C657', fontSize: '0.75rem', fontWeight: '600' }}>
                {post.author?.role || 'Sports Correspondent'}
              </div>
            </div>
          </div>

          {/* Main Image */}
          {(post.image || post.coverImage) && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <img
                src={getImageUrl(post.image || post.coverImage)}
                alt={post.title}
                style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Article HTML Content */}
          <div 
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: '#E2E8F0',
              marginBottom: '2rem'
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: '1rem'
            }}>
              <Tag size={16} color="#E6C657" />
              {post.tags.map((tag, idx) => (
                <span key={idx} style={{
                  background: 'rgba(230, 198, 87, 0.1)',
                  color: '#E6C657',
                  border: '1px solid rgba(230, 198, 87, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.78rem',
                  fontWeight: '600'
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
