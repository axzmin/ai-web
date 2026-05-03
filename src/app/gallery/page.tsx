'use client';

import { useState } from 'react';
import Link from 'next/link';

const SAMPLE_IMAGES = [
  { id: 1, title: 'Cyberpunk City', prompt: 'Futuristic cyberpunk city with neon lights', seed: 1234, category: 'Sci-Fi' },
  { id: 2, title: 'Mountain Sunset', prompt: 'Majestic mountain landscape at golden hour', seed: 2345, category: 'Nature' },
  { id: 3, title: 'Abstract Art', prompt: 'Colorful abstract geometric patterns', seed: 3456, category: 'Abstract' },
  { id: 4, title: 'Forest Temple', prompt: 'Ancient temple hidden in misty forest', seed: 4567, category: 'Nature' },
  { id: 5, title: 'Space Station', prompt: 'Futuristic space station orbiting Earth', seed: 5678, category: 'Sci-Fi' },
  { id: 6, title: 'Ocean Dreams', prompt: 'Underwater scene with bioluminescent creatures', seed: 6789, category: 'Nature' },
  { id: 7, title: 'Steampunk Machine', prompt: 'Intricate steampunk mechanical device', seed: 7890, category: 'Sci-Fi' },
  { id: 8, title: 'Japanese Garden', prompt: 'Traditional Japanese garden with cherry blossoms', seed: 8901, category: 'Nature' },
  { id: 9, title: 'Dragon Knight', prompt: 'Epic fantasy warrior with dragon companion', seed: 9012, category: 'Fantasy' },
  { id: 10, title: 'Neon Portrait', prompt: 'Portrait in neon-lit cyberpunk alley', seed: 3457, category: 'Sci-Fi' },
  { id: 11, title: 'Crystal Cave', prompt: 'Underground cave filled with glowing crystals', seed: 4568, category: 'Fantasy' },
  { id: 12, title: 'Desert Oasis', prompt: 'Peaceful oasis in golden desert sunset', seed: 5679, category: 'Nature' },
];

const CATEGORIES = ['All', 'Fantasy', 'Sci-Fi', 'Nature', 'Abstract'];

const getImageUrl = (id: number, seed: number) =>
  `https://picsum.photos/seed/${seed}/600/600`;

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof SAMPLE_IMAGES[0] | null>(null);

  const filteredImages = selectedCategory === 'All'
    ? SAMPLE_IMAGES
    : SAMPLE_IMAGES.filter(img => img.category === selectedCategory);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      padding: '5rem 1.5rem 4rem',
    }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '400px',
        background: 'radial-gradient(ellipse at 50% -20%, rgba(52, 98, 91, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}>
            Gallery
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem' }}>
            Explore creations made with AI Studio
          </p>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex', gap: '0.5rem', justifyContent: 'center',
          marginBottom: '2.5rem', flexWrap: 'wrap',
        }}>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '0.5rem 1.25rem',
                background: selectedCategory === category ? 'var(--accent-primary)' : 'var(--bg-card)',
                border: selectedCategory === category ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                borderRadius: '9999px',
                color: selectedCategory === category ? 'white' : 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: selectedCategory === category ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedCategory === category ? '0 2px 8px rgba(52, 98, 91, 0.25)' : 'none',
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
        }}>
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              style={{
                cursor: 'pointer',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '1',
                background: 'var(--bg-tertiary)',
                animation: `fadeInUp 0.4s ease ${index * 0.05}s both`,
                border: '1px solid var(--border-subtle)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <img
                src={getImageUrl(image.id, image.seed)}
                alt={image.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(26, 22, 20, 0.85) 0%, transparent 55%)',
                opacity: 0, transition: 'opacity 0.3s ease',
                display: 'flex', alignItems: 'flex-end', padding: '1.25rem',
              }}
              onMouseOver={(e) => (e.currentTarget as HTMLElement).style.opacity = '1'}
              onMouseOut={(e) => (e.currentTarget as HTMLElement).style.opacity = '0'}
              >
                <div>
                  <p style={{ fontWeight: 600, color: 'white', fontSize: '0.9375rem', marginBottom: '0.125rem' }}>{image.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem' }}>{image.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          textAlign: 'center', marginTop: '3rem', padding: '2rem',
          background: 'var(--bg-card)', borderRadius: '20px',
          border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)',
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Create Your Own
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
            Join thousands of creators using AI Studio
          </p>
          <Link href="/generate" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', background: 'var(--gradient-primary)',
            borderRadius: '10px', color: 'white', textDecoration: 'none',
            fontWeight: 600, fontSize: '0.9375rem', boxShadow: 'var(--shadow-glow-orange)',
          }}>
            Start Creating
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(26, 22, 20, 0.60)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '2rem', animation: 'fadeIn 0.2s ease',
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', width: '100%', animation: 'scaleIn 0.3s ease' }}>
            <img
              src={getImageUrl(selectedImage.id, selectedImage.seed)}
              alt={selectedImage.title}
              style={{ width: '100%', borderRadius: '16px', display: 'block', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xl)' }}
            />
            <div style={{
              textAlign: 'center', marginTop: '1.5rem', background: 'var(--bg-card)',
              borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)',
            }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                {selectedImage.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                {selectedImage.prompt}
              </p>
              <span style={{
                display: 'inline-block', padding: '0.25rem 0.75rem',
                background: 'var(--bg-secondary)', borderRadius: '9999px',
                fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '1.25rem',
              }}>
                {selectedImage.category}
              </span>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{
                    padding: '0.625rem 1.25rem', background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-default)', borderRadius: '10px',
                    color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                  }}
                >
                  Close
                </button>
                <Link href="/generate" style={{
                  padding: '0.625rem 1.25rem', background: 'var(--gradient-primary)',
                  border: 'none', borderRadius: '10px', color: 'white',
                  textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
                  boxShadow: 'var(--shadow-glow-orange)',
                }}>
                  Create Similar
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
