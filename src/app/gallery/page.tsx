'use client';

import { useState } from 'react';

const SAMPLE_IMAGES = [
  { id: 1, title: 'Cyberpunk City', prompt: 'Futuristic cyberpunk city with neon lights', seed: 1234 },
  { id: 2, title: 'Mountain Sunset', prompt: 'Majestic mountain landscape at golden hour', seed: 2345 },
  { id: 3, title: 'Abstract Art', prompt: 'Colorful abstract geometric patterns', seed: 3456 },
  { id: 4, title: 'Forest Temple', prompt: 'Ancient temple hidden in misty forest', seed: 4567 },
  { id: 5, title: 'Space Station', prompt: 'Futuristic space station orbiting Earth', seed: 5678 },
  { id: 6, title: 'Ocean Dreams', prompt: 'Underwater scene with bioluminescent creatures', seed: 6789 },
  { id: 7, title: 'Steampunk Machine', prompt: 'Intricate steampunk mechanical device', seed: 7890 },
  { id: 8, title: 'Japanese Garden', prompt: 'Traditional Japanese garden with cherry blossoms', seed: 8901 },
];

const CATEGORIES = ['All', 'Fantasy', 'Sci-Fi', 'Nature', 'Abstract'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof SAMPLE_IMAGES[0] | null>(null);

  const getImageUrl = (id: number, seed: number) => 
    `https://picsum.photos/seed/${seed}/600/600`;

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem 4rem', background: '#09090b' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: 700, 
            letterSpacing: '-2px',
            color: '#fafafa',
            marginBottom: '0.5rem'
          }}>
            Gallery
          </h1>
          <p style={{ color: '#71717a', fontSize: '1.125rem' }}>
            Explore creations made with AI Studio
          </p>
        </div>

        {/* Category Filter */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          justifyContent: 'center',
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '0.5rem 1rem',
                background: selectedCategory === category ? '#7c3aed' : 'rgba(255,255,255,0.05)',
                border: '1px solid',
                borderColor: selectedCategory === category ? '#7c3aed' : 'rgba(255,255,255,0.1)',
                borderRadius: '9999px',
                color: selectedCategory === category ? '#fff' : '#a1a1aa',
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
          gap: '1rem'
        }}>
          {SAMPLE_IMAGES.map((image, index) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              style={{ 
                cursor: 'pointer',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '1',
                animation: `fadeInUp 0.4s ease ${index * 0.05}s both`
              }}
            >
              <img
                src={getImageUrl(image.id, image.seed)}
                alt={image.title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1rem'
              }}
              onMouseOver={(e) => (e.currentTarget as HTMLElement).style.opacity = '1'}
              onMouseOut={(e) => (e.currentTarget as HTMLElement).style.opacity = '0'}
              >
                <div style={{ color: 'white' }}>
                  <p style={{ fontWeight: 600 }}>{image.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.95)',
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
              src={getImageUrl(selectedImage.id, selectedImage.seed)}
              alt={selectedImage.title}
              style={{ 
                width: '100%', 
                borderRadius: '16px',
                display: 'block'
              }}
            />
            <div style={{ 
              textAlign: 'center',
              marginTop: '1.5rem',
              color: 'white'
            }}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{selectedImage.title}</h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{selectedImage.prompt}</p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => window.location.href = '/generate'}
                  style={{
                    padding: '0.625rem 1.25rem',
                    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Create Similar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
