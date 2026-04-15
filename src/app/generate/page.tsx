'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GenerationState {
  status: 'idle' | 'generating' | 'complete' | 'error';
  progress: number;
  imageUrl: string | null;
  error: string | null;
}

const ASPECT_RATIOS = [
  { label: 'Square (1:1)', value: '1:1', icon: '◻️' },
  { label: 'Portrait (3:4)', value: '3:4', icon: '📱' },
  { label: 'Landscape (4:3)', value: '4:3', icon: '🖼️' },
  { label: 'Wide (16:9)', value: '16:9', icon: '🎬' },
];

const QUALITY_PRESETS = [
  { label: 'Standard', value: 'standard', description: 'Fast, good quality' },
  { label: 'HD', value: 'hd', description: 'Enhanced details' },
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('standard');
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
        body: JSON.stringify({ prompt, aspectRatio, quality }),
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      style={{
                        padding: '0.75rem',
                        background: aspectRatio === ratio.value ? 'var(--vercel-gray-700)' : 'var(--vercel-gray-800)',
                        border: aspectRatio === ratio.value ? '2px solid var(--develop-blue)' : '1px solid var(--vercel-gray-700)',
                        borderRadius: '8px',
                        color: 'var(--vercel-white)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{ratio.icon}</span>
                        <span style={{ fontSize: '0.875rem' }}>{ratio.label}</span>
                      </div>
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
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L12.5 7.5L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7.5L10 2Z" fill="currentColor"/>
                  </svg>
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
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8a6 6 0 1112 0A6 6 0 012 8zM8 4v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
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
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                border: '1px dashed var(--vercel-gray-700)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'var(--vercel-gray-800)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--vercel-gray-500)">
                    <rect x="4" y="4" width="24" height="24" rx="4" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                    <path d="M28 20l-6-6-10 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p style={{ color: 'var(--vercel-gray-500)', textAlign: 'center' }}>
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
