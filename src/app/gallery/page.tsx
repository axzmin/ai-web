'use client';

import { useState } from 'react';

// Sample gallery data (in production, this would come from API)
const SAMPLE_IMAGES = [
  { id: 1, title: 'Cyberpunk City', prompt: 'Futuristic cyberpunk city with neon lights', seed: 1234 },
  { id: 2, title: 'Mountain Sunset', prompt: 'Majestic mountain landscape at golden hour', seed: 2345 },
  { id: 3, title: 'Abstract Art', prompt: 'Colorful abstract geometric patterns', seed: 3456 },
  { id: 4, title: 'Forest Temple', prompt: 'Ancient temple hidden in misty forest', seed: 4567 },
  { id: 5, title: 'Space Station', prompt: 'Futuristic space station orbiting Earth', seed: 5678 },
  { id: 6, title: 'Ocean Dreams', prompt: 'Underwater scene with bioluminescent creatures', seed: 6789 },
  { id: 7, title: 'Steampunk Machine', prompt: 'Intricate steampunk mechanical device', seed: 7890 },
  { id: 8, title: 'Japanese Garden', prompt: 'Traditional Japanese garden with cherry blossoms', seed: 8901 },
  { id: 9, title: 'Dragon Rider', prompt: 'Epic fantasy scene with dragon and rider', seed: 9012 },
  { id: 10, title: 'Desert Oasis', prompt: 'Hidden oasis in vast desert landscape', seed: 1011 },
  { id: 11, title: 'Neon Portrait', prompt: 'Portrait with neon lighting effects', seed: 1122 },
  { id: 12, title: 'Floating Islands', prompt: 'Fantasy floating islands in the sky', seed: 2233 },
];

const CATEGORIES = ['All', 'Fantasy', 'Sci-Fi', 'Nature', 'Abstract', 'Architecture'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof SAMPLE_IMAGES[0] | null>(null);

  // For demo, we'll use placeholder images from picsum
  const getImageUrl = (id: number, seed: number) => 
    `https://picsum.photos/seed/${seed}/600/600`;

  return (
    <div className="gallery-page">
      <div className="container">
        {/* Header */}
        <div className="gallery-header">
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: 600, 
            letterSpacing: '-2px',
            marginBottom: '0.5rem'
          }}>
            Gallery
          </h1>
          <p style={{ color: 'var(--vercel-gray-600)', fontSize: '1.125rem' }}>
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
              className={`badge ${selectedCategory === category ? 'badge-blue' : ''}`}
              style={{
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                border: 'none',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                background: selectedCategory === category ? '#ebf5ff' : 'var(--vercel-gray-100)',
                color: selectedCategory === category ? '#0068d6' : 'var(--vercel-gray-600)'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {SAMPLE_IMAGES.map((image, index) => (
            <div
              key={image.id}
              className="gallery-item"
              onClick={() => setSelectedImage(image)}
              style={{ 
                cursor: 'pointer',
                animationDelay: `${index * 100}ms`
              }}
            >
              <img
                src={getImageUrl(image.id, image.seed)}
                alt={image.title}
                loading="lazy"
              />
              <div className="gallery-item-overlay">
                <div style={{ color: 'white' }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{image.title}</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    {image.prompt.substring(0, 50)}...
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
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
            cursor: 'pointer',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '800px',
              width: '100%',
              background: 'var(--vercel-black)',
              borderRadius: '16px',
              overflow: 'hidden',
              animation: 'scaleIn 0.3s var(--ease-out-back)'
            }}
          >
            <img
              src={getImageUrl(selectedImage.id, selectedImage.seed)}
              alt={selectedImage.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 600,
                color: 'var(--vercel-white)',
                marginBottom: '0.5rem'
              }}>
                {selectedImage.title}
              </h3>
              <p style={{ 
                color: 'var(--vercel-gray-400)', 
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                {selectedImage.prompt}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    // In production, this would open the remix page with this image
                    window.location.href = `/generate/remix`;
                  }}
                >
                  Remix This
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
