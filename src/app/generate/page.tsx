'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GenerationState {
  status: 'idle' | 'generating' | 'complete' | 'error';
  progress: number;
  imageUrl: string | null;
  error: string | null;
}

const ICONS = {
  sparkles: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  download: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" x2="12" y1="15" y2="3"/>
    </svg>
  ),
  refresh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  ),
};

const ASPECT_RATIOS = [
  { label: 'Square (1:1)', value: '1:1' },
  { label: 'Portrait (3:4)', value: '3:4' },
  { label: 'Landscape (4:3)', value: '4:3' },
  { label: 'Wide (16:9)', value: '16:9' },
];

const QUALITY_PRESETS = [
  { label: 'Standard', value: 'standard', description: 'Fast, good quality' },
  { label: 'HD', value: 'hd', description: 'Enhanced details' },
];

const MODEL_OPTIONS = [
  { label: 'Flux.1 Schnell', value: 'flux-schnell', description: 'Fast generation, 4 steps' },
  { label: 'Flux.1 Dev', value: 'flux-dev', description: 'Best quality, balanced' },
  { label: 'Flux.1 Pro', value: 'flux-pro', description: 'Premium quality, slowest' },
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('standard');
  const [model, setModel] = useState('flux-dev');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [state, setState] = useState<GenerationState>({
    status: 'idle',
    progress: 0,
    imageUrl: null,
    error: null,
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setState({ status: 'generating', progress: 0, imageUrl: null, error: null });

    // Simulate progress
    const progressInterval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 15, 90),
      }));
    }, 500);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio, quality, model }),
      });

      const data = await response.json();

      clearInterval(progressInterval);

      if (data.error) {
        setState({ status: 'error', progress: 0, imageUrl: null, error: data.error });
      } else {
        setState({ status: 'complete', progress: 100, imageUrl: data.imageUrl, error: null });
      }
    } catch (error) {
      clearInterval(progressInterval);
      setState({ 
        status: 'error', 
        progress: 0, 
        imageUrl: null, 
        error: 'Network error. Please try again.' 
      });
    }
  };

  const handleDownload = () => {
    if (!state.imageUrl) return;
    const link = document.createElement('a');
    link.href = state.imageUrl;
    link.download = `ai-image-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="generate-page">
      {/* Gradient orbs for visual interest */}
      <div className="orb orb-1" style={{ opacity: 0.3 }} />
      <div className="orb orb-2" style={{ opacity: 0.2 }} />

      <div className="generate-container">
        {/* Header */}
        <div className="generate-header">
          <h1 className="generate-title">
            <span style={{
              background: 'linear-gradient(135deg, #0a72ef, #de1d8d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Text to Image
            </span>
          </h1>
          <p className="generate-subtitle">
            Describe your vision and watch it come to life
          </p>
        </div>

        <div className="generate-grid">
          {/* Left: Prompt Input */}
          <div>
            <div className="prompt-input-wrapper">
              <textarea
                className="prompt-input"
                placeholder="A majestic dragon flying over a futuristic city at sunset, cinematic lighting, highly detailed, 8k..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={1000}
              />
              <span className="prompt-char-count">{prompt.length}/1000</span>
            </div>

            {/* Settings Panel */}
            <div className="settings-panel mt-3">
              <h3 className="settings-title">Settings</h3>

              {/* Aspect Ratio */}
              <div className="settings-group">
                <label className="settings-label">Aspect Ratio</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.625rem' }}>
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      style={{
                        padding: '0.875rem 0.75rem',
                        background: aspectRatio === ratio.value ? 'var(--vercel-gray-700)' : 'var(--vercel-gray-800)',
                        border: aspectRatio === ratio.value ? '2px solid var(--develop-blue)' : '1px solid var(--vercel-gray-700)',
                        borderRadius: '10px',
                        color: 'var(--vercel-white)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        fontWeight: aspectRatio === ratio.value ? 600 : 400
                      }}
                    >
                      <div style={{ fontSize: '1rem', marginBottom: '0.25rem', fontFamily: 'Georgia, serif' }}>{ratio.value}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{ratio.label.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Selector - Premium Dropdown */}
              <div className="settings-group">
                <label className="settings-label">AI Model</label>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {model.split('-')[1]?.toUpperCase()?.substring(0, 2) || 'FX'}
                      </span>
                      <span>
                        <span style={{ fontWeight: 600, display: 'block', textAlign: 'left' }}>
                          {MODEL_OPTIONS.find(m => m.value === model)?.label}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {MODEL_OPTIONS.find(m => m.value === model)?.description}
                        </span>
                      </span>
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
                      transform: modelDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>

                  {modelDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: 0,
                      right: 0,
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '14px',
                      padding: '0.5rem',
                      zIndex: 10,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      animation: 'fadeIn 0.2s ease'
                    }}>
                      {MODEL_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setModel(option.value);
                            setModelDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '0.875rem 1rem',
                            background: model === option.value ? 'var(--bg-tertiary)' : 'transparent',
                            border: model === option.value ? '1px solid var(--border-default)' : '1px solid transparent',
                            borderRadius: '10px',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '0.25rem',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseOver={(e) => {
                            if (model !== option.value) {
                              e.currentTarget.style.background = 'var(--bg-tertiary)';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (model !== option.value) {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <span style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: model === option.value ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: model === option.value ? 'white' : 'var(--text-secondary)',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            {option.value.split('-')[1]?.toUpperCase()?.substring(0, 2) || 'FX'}
                          </span>
                          <span style={{ flex: 1, textAlign: 'left' }}>
                            <span style={{ fontWeight: 600, display: 'block' }}>{option.label}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{option.description}</span>
                          </span>
                          {model === option.value && (
                            <span style={{ color: 'var(--accent-primary)' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
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
                  {QUALITY_PRESETS.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label} - {preset.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || state.status === 'generating'}
              className="btn-generate mt-3"
              style={{
                width: '100%',
                opacity: !prompt.trim() || state.status === 'generating' ? 0.6 : 1,
                cursor: !prompt.trim() || state.status === 'generating' ? 'not-allowed' : 'pointer'
              }}
            >
              {state.status === 'generating' ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span className="spinner" />
                  Generating...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {ICONS.sparkles}
                  Generate Image
                </span>
              )}
            </button>
          </div>

          {/* Right: Result Display */}
          <div>
            {/* Progress Bar */}
            {state.status === 'generating' && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
                <p className="progress-text">
                  {state.progress < 30 && 'Initializing model...'}
                  {state.progress >= 30 && state.progress < 60 && 'Generating image...'}
                  {state.progress >= 60 && state.progress < 90 && 'Applying refinements...'}
                  {state.progress >= 90 && 'Finalizing...'}
                </p>
              </div>
            )}

            {/* Result Image */}
            {state.imageUrl && (
              <div className="result-container">
                <div className="result-image-wrapper">
                  <img
                    src={state.imageUrl}
                    alt="Generated"
                    className="result-image"
                    style={{
                      width: '100%',
                      height: 'auto',
                      aspectRatio: aspectRatio.replace(':', '/'),
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div className="result-actions">
                  <button onClick={handleDownload} className="btn btn-secondary">
                    {ICONS.download}
                    Download
                  </button>
                  <button
                    onClick={() => setState({ status: 'idle', progress: 0, imageUrl: null, error: null })}
                    className="btn btn-ghost"
                    style={{ color: 'var(--vercel-white)' }}
                  >
                    {ICONS.refresh}
                    Create Another
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {state.status === 'error' && (
              <div style={{
                padding: '2rem',
                background: 'rgba(255, 91, 79, 0.1)',
                border: '1px solid var(--ship-red)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <p style={{ color: 'var(--ship-red)', marginBottom: '1rem' }}>
                  {state.error}
                </p>
                <button
                  onClick={() => setState({ status: 'idle', progress: 0, imageUrl: null, error: null })}
                  className="btn btn-secondary"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Placeholder */}
            {state.status === 'idle' && !state.imageUrl && (
              <div style={{
                aspectRatio: aspectRatio.replace(':', '/'),
                background: 'var(--vercel-gray-900)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2.5rem',
                border: '1px dashed var(--vercel-gray-700)'
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '18px',
                  background: 'var(--vercel-gray-800)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--vercel-gray-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
                <p style={{ color: 'var(--vercel-gray-500)', textAlign: 'center', fontSize: '0.9375rem' }}>
                  Your generated image will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}