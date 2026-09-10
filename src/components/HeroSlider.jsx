import React, { useState, useEffect } from 'react';
import { Flame, ArrowRight, Image as ImageIcon, Share2 } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

export const HeroSlider = ({ posts = [], onPostSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!posts || posts.length === 0) {
    return null;
  }

  const heroPosts = posts.slice(0, 4);

  return (
    <div style={{
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      marginBottom: '2rem',
      boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
      border: '1px solid rgba(214, 188, 102, 0.3)',
      minHeight: '380px',
      display: 'flex',
      alignItems: 'flex-end'
    }}>
      {/* Background Image with Dark Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${getImageUrl(heroPosts[currentIndex]?.image || heroPosts[currentIndex]?.coverImage)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.6)',
        transition: 'all 0.6s ease-in-out'
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0, 11, 61, 0.96) 0%, rgba(0, 11, 61, 0.4) 60%, rgba(0, 11, 61, 0.1) 100%)'
      }} />

      {/* Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '2.25rem',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{
            background: 'var(--gold-gray-yellow)',
            color: '#000b3d',
            fontWeight: '900',
            fontSize: '0.8rem',
            padding: '5px 14px',
            borderRadius: '4px',
            letterSpacing: '0.08em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textTransform: 'uppercase'
          }}>
            <Flame size={15} color="#000b3d" />
            <span>{heroPosts[currentIndex]?.category || 'DAILY NEWS FLASH'}</span>
          </span>
        </div>

        {/* Big Headline */}
        <h1 
          onClick={() => onPostSelect(heroPosts[currentIndex])}
          style={{
            fontSize: 'clamp(1.6rem, 3.8vw, 2.75rem)',
            fontWeight: '900',
            color: '#FFF',
            lineHeight: 1.15,
            marginBottom: '0.85rem',
            cursor: 'pointer',
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            maxWidth: '1000px',
            textTransform: 'uppercase'
          }}
        >
          {heroPosts[currentIndex]?.title}
        </h1>

        {/* Teaser Summary */}
        <p style={{
          color: '#CBD5E1',
          fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
          maxWidth: '850px',
          marginBottom: '1.5rem',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {heroPosts[currentIndex]?.summary}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onPostSelect(heroPosts[currentIndex])}
            className="btn-gold"
          >
            <span>READ FULL REPORT</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => {
              const currentPost = heroPosts[currentIndex];
              if (!currentPost) return;
              const shareUrl = window.location.href;
              if (navigator.share) {
                navigator.share({ title: currentPost.title, text: currentPost.summary, url: shareUrl }).catch(() => {});
              } else {
                navigator.clipboard.writeText(shareUrl).then(() => alert('Headline link copied to clipboard!'));
              }
            }}
            className="btn-outline-gold"
            style={{ padding: '0.75rem 1.25rem' }}
            title="Share Headline"
          >
            <Share2 size={18} />
            <span>SHARE</span>
          </button>
        </div>

        {/* Slide Indicators */}
        {heroPosts.length > 1 && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '1.75rem' }}>
            {heroPosts.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  height: '4px',
                  width: currentIndex === idx ? '36px' : '12px',
                  backgroundColor: currentIndex === idx ? '#d6bc66' : 'rgba(255,255,255,0.3)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSlider;
