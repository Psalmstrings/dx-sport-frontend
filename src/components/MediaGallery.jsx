import React, { useState } from 'react';
import { Image as ImageIcon, Eye, Play, Sparkles, X } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

export const MediaGallery = ({ mediaItems = [] }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const defaultGallery = [
    {
      _id: 'm-1',
      title: 'Victor Osimhen Tactical Striking Masterclass',
      url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
      caption: 'Highlight reel capturing decisive moments from the weekend title derby.',
      createdAt: '2026-08-18'
    },
    {
      _id: 'm-2',
      title: 'Enyimba FC Stadium atmosphere & Fan Celebrations',
      url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
      caption: 'Electrifying crowd reactions during the NPFL championship showdown.',
      createdAt: '2026-08-17'
    },
    {
      _id: 'm-3',
      title: 'Super Eagles Training Camp Action Shots',
      url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1000&q=80',
      caption: 'Intense drills ahead of the upcoming AFCON qualifier match.',
      createdAt: '2026-08-16'
    },
    {
      _id: 'm-4',
      title: 'Hoops Championship Dunk Competition',
      url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
      caption: 'Top performing dunkers at the annual DX Sport Hoops Finals.',
      createdAt: '2026-08-15'
    }
  ];

  const displayItems = mediaItems.length > 0 ? mediaItems : defaultGallery;

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        borderBottom: '2px solid rgba(214, 188, 102, 0.25)',
        paddingBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '4px', height: '24px', backgroundColor: '#E63946', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.02em', color: '#FFF' }}>
            SPORTS MEDIA & GALLERY HIGHLIGHTS
          </h2>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#d6bc66', fontWeight: '700' }}>
          Showing {displayItems.length} media photos
        </span>
      </div>

      {/* Gallery Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {displayItems.map((item) => (
          <div
            key={item._id}
            onClick={() => setSelectedMedia(item)}
            className="glass-panel interactive-card"
            style={{
              overflow: 'hidden',
              borderRadius: '14px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
              <img
                src={getImageUrl(item.url)}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,11,61,0.85), transparent 60%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1rem'
              }}>
                <span className="badge-gold" style={{ fontSize: '0.7rem' }}>
                  <ImageIcon size={12} /> PHOTO MEDIA
                </span>
              </div>
            </div>

            <div style={{ padding: '1rem' }}>
              <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#FFF', marginBottom: '0.4rem', lineHeight: '1.3' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                {item.caption || 'Official DX Sport match highlight photo.'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedMedia && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 7, 38, 0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            maxWidth: '850px',
            width: '100%',
            background: '#000b3d',
            border: '1px solid rgba(214, 188, 102, 0.4)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedMedia(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.6)',
                color: '#FFF',
                padding: '8px',
                borderRadius: '50%',
                zIndex: 10,
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <img
              src={getImageUrl(selectedMedia.url)}
              alt={selectedMedia.title}
              style={{ width: '100%', maxHeight: '480px', objectFit: 'cover' }}
            />

            <div style={{ padding: '1.5rem' }}>
              <div className="badge-gold" style={{ marginBottom: '8px', display: 'inline-flex' }}>
                DX SPORT MEDIA GALLERY
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#FFF', marginBottom: '8px' }}>
                {selectedMedia.title}
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: '1.5' }}>
                {selectedMedia.caption || 'High quality sports media capture.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
