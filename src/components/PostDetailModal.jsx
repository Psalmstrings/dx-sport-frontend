import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Share2, Tag, ArrowLeft, Check, Link2 } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

export const PostDetailModal = ({ post, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Dynamic SEO Injection Effect
  useEffect(() => {
    if (!post) return;

    const originalTitle = document.title;
    document.title = `${post.title} | DX SPORT`;

    const shareUrl = window.location.href;
    const postImageUrl = getImageUrl(post.image || post.coverImage);
    const postSummary = post.summary || post.title;

    // Helper to set meta tag content
    const setMetaTag = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        if (property.startsWith('og:')) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('og:title', post.title);
    setMetaTag('og:description', postSummary);
    setMetaTag('og:image', postImageUrl);
    setMetaTag('og:url', shareUrl);
    setMetaTag('twitter:title', post.title);
    setMetaTag('twitter:description', postSummary);
    setMetaTag('twitter:image', postImageUrl);

    // Inject JSON-LD NewsArticle schema for Google SEO
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.id = 'dynamic-news-article-schema';
    jsonLdScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': post.title,
      'image': [postImageUrl],
      'datePublished': post.createdAt || new Date().toISOString(),
      'dateModified': post.updatedAt || post.createdAt || new Date().toISOString(),
      'author': {
        '@type': 'Person',
        'name': post.author?.name || 'DX Sport Editorial Team'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'DX SPORT',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://dxsports.com/logo.png'
        }
      },
      'description': postSummary
    });
    document.head.appendChild(jsonLdScript);

    return () => {
      document.title = originalTitle;
      const script = document.getElementById('dynamic-news-article-schema');
      if (script) script.remove();
    };
  }, [post]);

  if (!post) return null;

  const currentUrl = window.location.href;
  const shareTitle = encodeURIComponent(post.title);
  const shareUrlEncoded = encodeURIComponent(currentUrl);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`,
    x: `https://twitter.com/intent/tweet?url=${shareUrlEncoded}&text=${shareTitle}%20via%20@DXSportsbr`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrlEncoded}`,
    telegram: `https://t.me/share/url?url=${shareUrlEncoded}&text=${shareTitle}`
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      alert('Share URL: ' + currentUrl);
    });
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary || post.title,
        url: currentUrl
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 12, 27, 0.92)',
      backdropFilter: 'blur(12px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem',
      overflowY: 'auto'
    }}>
      <div className="glass-panel-gold" style={{
        maxWidth: '850px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        borderRadius: '16px',
        position: 'relative',
        animation: 'fadeIn 0.25s ease-out'
      }}>
        {/* Header Bar */}
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#000b3d',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid rgba(214, 188, 102, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          <button 
            onClick={onClose}
            style={{
              color: '#d6bc66',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '800',
              fontSize: '0.875rem',
              minHeight: '44px'
            }}
          >
            <ArrowLeft size={18} />
            <span>BACK TO NEWS</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleNativeShare}
              style={{
                color: '#FFFFFF',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(214, 188, 102, 0.3)',
                padding: '8px 12px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: '800',
                minHeight: '40px'
              }}
              title="Share post"
            >
              <Share2 size={16} color="#d6bc66" />
              <span>SHARE</span>
            </button>
            <button onClick={onClose} style={{ color: '#d6bc66', padding: '6px', minHeight: '44px', minWidth: '44px' }}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem 1.5rem' }}>
          {/* Category & Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className="badge-gold">{post.category}</span>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} />
              {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
            fontWeight: '900',
            lineHeight: 1.25,
            color: '#FFFFFF',
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
            background: 'rgba(0, 11, 61, 0.6)',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--gold-gradient)',
              color: '#000b3d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              flexShrink: 0
            }}>
              <User size={20} />
            </div>
            <div>
              <div style={{ fontWeight: '800', color: '#FFF', fontSize: '0.9rem' }}>
                {post.author?.name || 'DX Sport Editorial Team'}
              </div>
              <div style={{ color: '#d6bc66', fontSize: '0.75rem', fontWeight: '700' }}>
                {post.author?.role || 'Sports Correspondent'}
              </div>
            </div>
          </div>

          {/* Main Image */}
          {(post.image || post.coverImage) && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
              <img
                src={getImageUrl(post.image || post.coverImage)}
                alt={post.title}
                style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Article Content */}
          <div 
            style={{
              fontSize: '1.025rem',
              lineHeight: 1.7,
              color: '#E2E8F0',
              marginBottom: '2rem'
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* SOCIAL MEDIA SHARE BAR */}
          <div style={{
            background: 'rgba(0, 11, 61, 0.8)',
            border: '1px solid rgba(214, 188, 102, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: '900',
              color: '#d6bc66',
              letterSpacing: '0.05em',
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase'
            }}>
              <Share2 size={16} />
              <span>SHARE THIS STORY WITH FRIENDS</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* Facebook Share */}
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
                  padding: '9px 15px',
                  borderRadius: '20px',
                  fontSize: '0.825rem',
                  fontWeight: '800',
                  textDecoration: 'none',
                  minHeight: '42px'
                }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>

              {/* X Share */}
              <a
                href={shareLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#000000',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#FFF',
                  padding: '9px 15px',
                  borderRadius: '20px',
                  fontSize: '0.825rem',
                  fontWeight: '800',
                  textDecoration: 'none',
                  minHeight: '42px'
                }}
              >
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X / Twitter</span>
              </a>

              {/* WhatsApp Share */}
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
                  padding: '9px 15px',
                  borderRadius: '20px',
                  fontSize: '0.825rem',
                  fontWeight: '800',
                  textDecoration: 'none',
                  minHeight: '42px'
                }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.238-1.111z"/>
                </svg>
                <span>WhatsApp</span>
              </a>

              {/* Telegram Share */}
              <a
                href={shareLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#229ED9',
                  color: '#FFF',
                  padding: '9px 15px',
                  borderRadius: '20px',
                  fontSize: '0.825rem',
                  fontWeight: '800',
                  textDecoration: 'none',
                  minHeight: '42px'
                }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.97 9.28c-.15.65-.54.81-1.08.5l-3.01-2.22-1.45 1.4c-.16.16-.3.3-.61.3l.21-3.05 5.56-5.02c.24-.22-.05-.34-.37-.13l-6.87 4.33-2.96-.92c-.64-.2-.65-.64.13-.95l11.57-4.46c.53-.2 1.01.12.85.84z"/>
                </svg>
                <span>Telegram</span>
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
                  padding: '9px 15px',
                  borderRadius: '20px',
                  fontSize: '0.825rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  minHeight: '42px',
                  transition: 'all 0.2s'
                }}
              >
                {copied ? <Check size={16} color="#FFF" /> : <Link2 size={16} color="#d6bc66" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

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
              <Tag size={16} color="#d6bc66" />
              {post.tags.map((tag, idx) => (
                <span key={idx} style={{
                  background: 'rgba(214, 188, 102, 0.12)',
                  color: '#d6bc66',
                  border: '1px solid rgba(214, 188, 102, 0.3)',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.78rem',
                  fontWeight: '700'
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
