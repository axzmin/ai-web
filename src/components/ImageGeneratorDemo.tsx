'use client';

import { useState } from 'react';

export default function ImageGeneratorDemo() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    // Simulate generation
    setTimeout(() => {
      setResultImage(`https://picsum.photos/seed/${Date.now()}/800/600`);
      setIsGenerating(false);
    }, 2500);
  };

  const samplePrompts = [
    'Cyberpunk city at night with neon lights',
    'A majestic dragon flying over mountains',
    'Futuristic space station orbiting Earth',
    'Beautiful Japanese garden with cherry blossoms'
  ];

  return (
    <section id="generator" style={{
      padding: '6rem 2rem',
      background: 'var(--vercel-black)'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-green mb-3">⚡ Live Demo</span>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600,
            letterSpacing: '-2px',
            color: 'var(--vercel-white)',
            marginBottom: '1rem'
          }}>
            Try It Right Now
          </h2>
          <p style={{ color: 'var(--vercel-gray-400)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
            Experience the power of AI image generation. Type a prompt and watch the magic happen.
          </p>
        </div>

        {/* Generator Interface */}
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          background: 'var(--vercel-gray-900)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid var(--vercel-gray-800)'
        }}>
          {/* Prompt Input */}
          <div className="prompt-input-wrapper" style={{ marginBottom: '1rem' }}>
            <textarea
              className="prompt-input"
              placeholder="Describe the image you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{
                background: 'var(--vercel-gray-800)',
                border: '1px solid var(--vercel-gray-700)',
                color: 'var(--vercel-white)',
                minHeight: '100px'
              }}
            />
          </div>

          {/* Sample Prompts */}
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: 'var(--vercel-gray-500)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
              Try these:
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(p)}
                  style={{
                    padding: '0.375rem 0.75rem',
                    background: 'var(--vercel-gray-800)',
                    border: '1px solid var(--vercel-gray-700)',
                    borderRadius: '9999px',
                    color: 'var(--vercel-gray-300)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {p.substring(0, 25)}...
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              opacity: !prompt.trim() || isGenerating ? 0.6 : 1
            }}
          >
            {isGenerating ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span className="spinner" /> Generating...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                ✨ Generate Image
              </span>
            )}
          </button>

          {/* Result */}
          {resultImage && (
            <div style={{
              marginTop: '1.5rem',
              borderRadius: '12px',
              overflow: 'hidden',
              animation: 'fadeIn 0.5s ease'
            }}>
              <img
                src={resultImage}
                alt="Generated"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
