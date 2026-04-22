'use client';

import { useState, useEffect } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

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

const MODEL_OPTIONS = [
  { label: 'Flux.1 Schnell', value: 'flux-schnell', description: 'Fast, 4 steps' },
  { label: 'Flux.1 Dev', value: 'flux-dev', description: 'Best quality' },
  { label: 'Flux.1 Pro', value: 'flux-pro', description: 'Premium quality' },
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
  const [model, setModel] = useState('flux-schnell');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [qualityDropdownOpen, setQualityDropdownOpen] = useState(false);
  const [aspectDropdownOpen, setAspectDropdownOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState(false);
  const [state, setState] = useState<GenState>({
    status: 'idle', progress: 0, imageUrl: null, error: null
  });

  const { isSignedIn, userId } = useAuth();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Close all dropdowns when clicking on something NOT inside a dropdown-container
      if (!target.closest('.dropdown-container')) {
        setModelDropdownOpen(false);
        setQualityDropdownOpen(false);
        setAspectDropdownOpen(false);
      }
    };

    // Use mousedown for better event capture (before React onClick)
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user credits on mount
  useEffect(() => {
    if (userId) {
      fetch('/api/user')
        .then(res => res.json())
        .then(data => {
          if (data.credits !== undefined) {
            setCredits(data.credits);
          }
        })
        .catch(() => {});
    }
  }, [userId]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // Check credits first
    if (credits !== null && credits <= 0) {
      setInsufficientCredits(true);
      return;
    }

    setState({ status: 'generating', progress: 0, imageUrl: null, error: null });
    setInsufficientCredits(false);

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
        body: JSON.stringify({ prompt, aspectRatio, quality, model }),
      });
      const data = await res.json();
      clearInterval(interval);

      if (data.error) {
        setState({ status: 'error', progress: 0, imageUrl: null, error: data.error });
        if (data.error.includes('credits') || data.error.includes('Credit')) {
          setInsufficientCredits(true);
        }
      } else {
        setState({ status: 'complete', progress: 100, imageUrl: data.imageUrl, error: null });
        // Update credits after successful generation
        if (credits !== null) {
          setCredits(prev => prev !== null ? prev - 1 : null);
        }
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
              {/* All selectors in a consistent grid layout */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* AI Model */}
                <div>
                  <label className="settings-label">AI Model</label>
                  <div className="dropdown-container" style={{ position: 'relative' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setModelDropdownOpen(!modelDropdownOpen); setQualityDropdownOpen(false); setAspectDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 1rem',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>
                        {MODEL_OPTIONS.find(m => m.value === model)?.label}
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>
                    {modelDropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        right: 0,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '12px',
                        padding: '0.375rem',
                        zIndex: 50,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}>
                        {MODEL_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => { setModel(option.value); setModelDropdownOpen(false); }}
                            style={{
                              width: '100%',
                              padding: '0.625rem 0.75rem',
                              background: model === option.value ? 'var(--bg-tertiary)' : 'transparent',
                              border: model === option.value ? '1px solid var(--border-default)' : '1px solid transparent',
                              borderRadius: '8px',
                              color: 'var(--text-primary)',
                              fontSize: '0.8125rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '2px'
                            }}
                          >
                            <span style={{ textAlign: 'left' }}>
                              <span style={{ fontWeight: 600, display: 'block', fontSize: '0.8125rem' }}>{option.label}</span>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>{option.description}</span>
                            </span>
                            {model === option.value && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quality and Aspect Ratio in a 2-column grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* Quality */}
                  <div>
                    <label className="settings-label">Quality</label>
                    <div className="dropdown-container" style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setQualityDropdownOpen(!qualityDropdownOpen); setModelDropdownOpen(false); setAspectDropdownOpen(false); }}
                        style={{
                          width: '100%',
                          height: '44px',
                          padding: '0 1rem',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-default)',
                          borderRadius: '12px',
                          color: 'var(--text-primary)',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          boxSizing: 'border-box'
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>
                          {QUALITY_OPTIONS.find(q => q.value === quality)?.label}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </button>
                      {qualityDropdownOpen && (
                        <div style={{
                          position: 'absolute',
                          top: 'calc(100% + 6px)',
                          left: 0,
                          right: 0,
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-default)',
                          borderRadius: '12px',
                          padding: '0.375rem',
                          zIndex: 50,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          maxHeight: '200px',
                          overflowY: 'auto'
                        }}>
                          {QUALITY_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => { setQuality(option.value); setQualityDropdownOpen(false); }}
                              style={{
                                width: '100%',
                                padding: '0.625rem 0.75rem',
                                background: quality === option.value ? 'var(--bg-tertiary)' : 'transparent',
                                border: quality === option.value ? '1px solid var(--border-default)' : '1px solid transparent',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '0.8125rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '2px'
                              }}
                            >
                              <span style={{ textAlign: 'left' }}>
                                <span style={{ fontWeight: 600, display: 'block', fontSize: '0.8125rem' }}>{option.label}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>{option.desc}</span>
                              </span>
                              {quality === option.value && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <div>
                    <label className="settings-label">Aspect Ratio</label>
                    <div className="dropdown-container" style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setAspectDropdownOpen(!aspectDropdownOpen); setModelDropdownOpen(false); setQualityDropdownOpen(false); }}
                        style={{
                          width: '100%',
                          height: '44px',
                          padding: '0 1rem',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-default)',
                          borderRadius: '12px',
                          color: 'var(--text-primary)',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          boxSizing: 'border-box'
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>
                          {ASPECT_RATIOS.find(r => r.value === aspectRatio)?.label} ({aspectRatio})
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </button>
                      {aspectDropdownOpen && (
                        <div style={{
                          position: 'absolute',
                          top: 'calc(100% + 6px)',
                          left: 0,
                          right: 0,
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-default)',
                          borderRadius: '12px',
                          padding: '0.375rem',
                          zIndex: 50,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          maxHeight: '200px',
                          overflowY: 'auto'
                        }}>
                          {ASPECT_RATIOS.map((ratio) => (
                            <button
                              key={ratio.value}
                              onClick={() => { setAspectRatio(ratio.value); setAspectDropdownOpen(false); }}
                              style={{
                                width: '100%',
                                padding: '0.625rem 0.75rem',
                                background: aspectRatio === ratio.value ? 'var(--bg-tertiary)' : 'transparent',
                                border: aspectRatio === ratio.value ? '1px solid var(--border-default)' : '1px solid transparent',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '0.8125rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '2px'
                              }}
                            >
                              <span style={{ textAlign: 'left' }}>
                                <span style={{ fontWeight: 600, display: 'block', fontSize: '0.8125rem' }}>{ratio.label}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>{ratio.value}</span>
                              </span>
                              {aspectRatio === ratio.value && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || state.status === 'generating' || !isSignedIn}
              className="btn-generate mt-4"
              style={{
                width: '100%',
                opacity: (!prompt.trim() || state.status === 'generating' || !isSignedIn) ? 0.6 : 1,
                cursor: (!prompt.trim() || state.status === 'generating' || !isSignedIn) ? 'not-allowed' : 'pointer',
              }}
            >
              {state.status === 'generating' ? (
                <><span className="spinner" /> Generating...</>
              ) : !isSignedIn ? (
                <><svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L12.5 7.5L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7.5L10 2Z" fill="currentColor"/>
                </svg> Sign In to Generate</>
              ) : (
                <><svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L12.5 7.5L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7.5L10 2Z" fill="currentColor"/>
                </svg> Generate Image {credits !== null && <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>({credits} credits)</span>}</>
              )}
            </button>

            {/* Insufficient Credits Message */}
            {insufficientCredits && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Insufficient credits
                </p>
                <Link href="/pricing" style={{
                  color: 'var(--accent-primary)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}>
                  Upgrade your plan →
                </Link>
              </div>
            )}
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
