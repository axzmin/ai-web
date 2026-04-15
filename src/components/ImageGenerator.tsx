'use client';

import { useState } from 'react';

const ASPECT_RATIOS = [
  { label: 'Square', value: '1:1', icon: '◻️' },
  { label: 'Portrait', value: '3:4', icon: '📱' },
  { label: 'Landscape', value: '4:3', icon: '🖼️' },
  { label: 'Wide', value: '16:9', icon: '🎬' },
];

const QUALITY_OPTIONS = [
  { label: 'Standard', value: 'standard', desc: 'Fast generation' },
  { label: 'HD', value: 'hd', desc: 'Enhanced quality' },
];

interface GenState {
  status: 'idle' | 'generating' | 'complete' | 'error';
  progress: number;
  imageUrl: string | null;
  error: string | null;
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('standard');
  const [state, setState] = useState<GenState>({
    status: 'idle', progress: 0, imageUrl: null, error: null
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setState({ status: 'generating', progress: 0, imageUrl: null, error: null });
    
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 20, 90)
      }));
    }, 400);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio, quality }),
      });
      const data = await res.json();
      clearInterval(interval);
      
      if (data.error) {
        setState({ status: 'error', progress: 0, imageUrl: null, error: data.error });
      } else {
        setState({ status: 'complete', progress: 100, imageUrl: data.imageUrl, error: null });
      }
    } catch {
      clearInterval(interval);
      setState({ status: 'error', progress: 0, imageUrl: null, error: 'Network error' });
    }
  };

  const getProgressText = (p: number) => {
    if (p < 30) return 'Initializing model...';
    if (p < 60) return 'Generating image...';
    if (p < 90) return 'Refining details...';
    return 'Finalizing...';
  };

  return (
    <section className="generator-section" id="generator">
      <div className="orb orb-1" style={{ opacity: 0.2 }} />
      <div className="orb orb-2" style={{ opacity: 0.15 }} />
      
      <div className="generator-container">
        <div className="generator-header">
          <h2 className="generator-title">
            Create <span className="text-gradient">Magic</span> in Seconds
          </h2>
          <p className="generator-subtitle">
            Type your idea and watch it transform into stunning artwork
          </p>
        </div>

        <div className="generator-grid">
          {/* Left: Form */}
          <div>
            <div className="prompt-input-wrapper">
              <textarea
                className="prompt-input"
                placeholder="A majestic dragon flying over a futuristic cyberpunk city at sunset, cinematic lighting, highly detailed, 8k ultra quality..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={1000}
              />
              <span className="prompt-char-count">{prompt.length}/1000</span>
            </div>

            <div className="settings-panel mt-4">
              <div className="grid-2" style={{ gap: '1rem' }}>
                {/* Aspect Ratio */}
                <div className="settings-group">
                  <label className="settings-label">Aspect Ratio</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {ASPECT_RATIOS.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setAspectRatio(r.value)}
                        style={{
                          padding: '0.625rem',
                          background: aspectRatio === r.value ? 'var(--vercel-gray-700)' : 'var(--vercel-gray-800)',
                          border: aspectRatio === r.value ? '2px solid var(--develop-blue)' : '1px solid var(--vercel-gray-700)',
                          borderRadius: '8px',
                          color: 'var(--vercel-white)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span>{r.icon}</span> {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality */}
                <div className="settings-group">
                  <label className="settings-label">Quality</label>
                  <select
                    className="settings-select"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                  >
                    {QUALITY_OPTIONS.map((q) => (
                      <option key={q.value} value={q.value}>
                        {q.label} - {q.desc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || state.status === 'generating'}
              className="btn-generate mt-4"
            >
              {state.status === 'generating' ? (
                <><span className="spinner" /> Generating...</>
              ) : (
                <><svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L12.5 7.5L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7.5L10 2Z" fill="currentColor"/>
                </svg> Generate Image</>
              )}
            </button>
          </div>

          {/* Right: Result */}
          <div>
            <div className="result-panel">
              {state.status === 'generating' && (
                <div className="progress-container" style={{ padding: '4rem 2rem' }}>
                  <div className="progress-bar" style={{ marginBottom: '1rem' }}>
                    <div className="progress-fill" style={{ width: `${state.progress}%` }} />
                  </div>
                  <p className="progress-text">{getProgressText(state.progress)}</p>
                </div>
              )}

              {state.imageUrl && (
                <>
                  <img
                    src={state.imageUrl}
                    alt="Generated"
                    className="result-image"
                    style={{ aspectRatio: aspectRatio.replace(':', '/'), objectFit: 'cover' }}
                  />
                  <div className="result-actions">
                    <button className="btn btn-secondary" style={{ flex: 1 }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 12V2M4 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={() => setState({ status: 'idle', progress: 0, imageUrl: null, error: null })}
                      className="btn btn-ghost"
                      style={{ color: 'var(--vercel-white)' }}
                    >
                      Create Another
                    </button>
                  </div>
                </>
              )}

              {state.status === 'error' && (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--ship-red)', marginBottom: '1rem' }}>{state.error}</p>
                  <button
                    onClick={() => setState({ status: 'idle', progress: 0, imageUrl: null, error: null })}
                    className="btn btn-secondary"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {state.status === 'idle' && (
                <div className="result-placeholder">
                  <div className="result-placeholder-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--vercel-gray-500)">
                      <rect x="4" y="4" width="24" height="24" rx="4" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                      <path d="M28 20l-6-6-10 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: '0.875rem' }}>Your creation will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
