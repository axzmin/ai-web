'use client';

import { useState } from 'react';

const GALLERY_ICONS = {
  image: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  ),
  gallery: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  ),
};

const GALLERY_ITEMS = [
  { id: 1, title: 'Cyberpunk City', seed: 1001, category: 'Sci-Fi' },
  { id: 2, title: 'Mountain Temple', seed: 1002, category: 'Nature' },
  { id: 3, title: 'Abstract Art', seed: 1003, category: 'Abstract' },
  { id: 4, title: 'Space Station', seed: 1004, category: 'Sci-Fi' },
  { id: 5, title: 'Japanese Garden', seed: 1005, category: 'Nature' },
  { id: 6, title: 'Neon Portrait', seed: 1006, category: 'Portrait' },
  { id: 7, title: 'Floating Islands', seed: 1007, category: 'Fantasy' },
  { id: 8, title: 'Ocean City', seed: 1008, category: 'Fantasy' },
];

const CATEGORIES = ['All', 'Sci-Fi', 'Nature', 'Fantasy', 'Abstract', 'Portrait'];

export default function GalleryPreview() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  const filteredItems = activeCategory === 'All' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="section-padded" style={{
      background: 'var(--bg-tertiary)'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(37, 99, 235, 0.15)',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1rem'
          }}>
            <span style={{ color: 'var(--accent-primary)', display: 'flex' }}>{GALLERY_ICONS.gallery}</span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--accent-primary)'
            }}>
              Gallery
            </span>
          </div>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600,
            letterSpacing: '-2px',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Created by Our Community
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
            See what artists and creators are making with AI Studio every day.
          </p>
        </div>

        {/* Category Filter */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          justifyContent: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '0.5rem 1rem',
                background: activeCategory === category ? 'var(--accent-primary)' : 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: '9999px',
                color: activeCategory === category ? 'white' : 'var(--text-secondary)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Wider cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.25rem',
          maxWidth: '1300px',
          margin: '0 auto'
        }}>
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                animation: `fadeInUp 0.5s ease ${index * 0.1}s both`,
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <img
                src={`https://picsum.photos/seed/${item.seed}/500/500`}
                alt={item.title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              {/* Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(20,20,19,0.85) 0%, transparent 60%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1.25rem'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
              >
                <div style={{ color: 'white' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{item.title}</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a href="/gallery" className="btn btn-secondary">
            View Full Gallery
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(20, 20, 19, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '700px',
              width: '100%',
              animation: 'scaleIn 0.3s ease'
            }}
          >
            <img
              src={`https://picsum.photos/seed/${selectedImage.seed}/700/700`}
              alt={selectedImage.title}
              style={{ 
                width: '100%', 
                borderRadius: '16px',
                display: 'block',
                boxShadow: 'var(--shadow-xl)'
              }}
            />
            <div style={{ 
              textAlign: 'center',
              marginTop: '1.25rem',
              color: 'white'
            }}>
              <p style={{ fontWeight: 600, fontSize: '1rem' }}>{selectedImage.title}</p>
              <p style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.25rem' }}>{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}