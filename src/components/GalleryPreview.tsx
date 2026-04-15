'use client';

import { useState } from 'react';

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
    <section id="gallery" style={{
      padding: '6rem 2rem',
      background: 'var(--vercel-gray-50)'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-purple mb-3">🖼️ Gallery</span>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600,
            letterSpacing: '-2px',
            marginBottom: '1rem'
          }}>
            Created by Our Community
          </h2>
          <p style={{ color: 'var(--vercel-gray-600)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
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
                background: activeCategory === category ? 'var(--vercel-black)' : 'white',
                border: '1px solid var(--vercel-gray-200)',
                borderRadius: '9999px',
                color: activeCategory === category ? 'white' : 'var(--vercel-gray-600)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                animation: `fadeInUp 0.5s ease ${index * 0.1}s both`
              }}
            >
              <img
                src={`https://picsum.photos/seed/${item.seed}/400/400`}
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
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1rem'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
              >
                <div style={{ color: 'white' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.title}</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="/gallery" className="btn btn-secondary">
            View Full Gallery →
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
            background: 'rgba(0, 0, 0, 0.9)',
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
                display: 'block'
              }}
            />
            <div style={{ 
              textAlign: 'center',
              marginTop: '1rem',
              color: 'white'
            }}>
              <p style={{ fontWeight: 600 }}>{selectedImage.title}</p>
              <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
