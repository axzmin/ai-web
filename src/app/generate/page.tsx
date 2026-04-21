'use client';

import { useState } from 'react';
import { useAuth, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

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
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
};

const ASPECT_RATIOS = [
  { label: 'Square', value: '1:1', icon: '◻' },
  { label: 'Portrait', value: '3:4', icon: '▯' },
  { label: 'Landscape', value: '4:3', icon: '▭' },
  { label: 'Wide', value: '16:9', icon: '▰' },
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

  const { isSignedIn, isLoaded } = useAuth();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setState({ status: 'generating', progress: 0, imageUrl: null, error: null });

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
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      padding: '5rem 1.5rem 4rem',
    }}>
      {/* Warm gradient accent */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '400px',
        background: 'radial-gradient(ellipse at 50% -20%, rgba(255, 140, 66, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}>
            Text to Image
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.0625rem',
          }}>
            Describe your vision and watch it come to life
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start',
        }}>
          {/* Left: Prompt Input */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
          }}>
            {/* Prompt */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}>
                Your Prompt
              </label>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A majestic dragon flying over a futuristic city at sunset, cinematic lighting, highly detailed, 8k..."
                  maxLength={1000}
                  style={{
                    width: '100%',
                    minHeight: '140px',
                    padding: '0.875rem 1rem',
                    paddingBottom: '2rem',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9375rem',
                    fontFamily: 'inherit',
                    lineHeight: 1.6,
                    resize: 'vertical',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 140, 66, 0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '0.625rem',
                  right: '0.75rem',
                  fontSize: '0.75rem',
                  color: prompt.length > 900 ? 'var(--accent-primary)' : 'var(--text-muted)',
                }}>
                  {prompt.length}/1000
                </span>
              </div>
            </div>

            {/* Settings */}
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.25rem',
            }}>
              <h3 style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '1rem',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}>
                Settings
              </h3>

              {/* Aspect Ratio */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}>
                  Aspect Ratio
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      style={{
                        padding: '0.625rem 0.25rem',
                        background: aspectRatio === ratio.value ? 'var(--accent-primary)' : 'var(--bg-card)',
                        border: aspectRatio === ratio.value ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                        borderRadius: '10px',
                        color: aspectRatio === ratio.value ? 'white' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        fontWeight: aspectRatio === ratio.value ? 600 : 400,
                        fontSize: '0.8125rem',
                        boxShadow: aspectRatio === ratio.value ? '0 2px 8px rgba(255, 140, 66, 0.25)' : 'none',
                      }}
                    >
                      <div style={{ fontSize: '1.125rem', marginBottom: '0.125rem' }}>{ratio.icon}</div>
                      <div>{ratio.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Selector */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}>
                  AI Model
                </label>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: modelDropdownOpen ? 'var(--bg-card)' : 'var(--bg-card)',
                      border: `1px solid ${modelDropdownOpen ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: modelDropdownOpen ? '0 0 0 3px rgba(255, 140, 66, 0.12)' : 'none',
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
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                      }}>
                        {model.split('-')[1]?.toUpperCase()?.substring(0, 2) || 'FX'}
                      </span>
                      <span>
                        <span style={{ fontWeight: 600, display: 'block', textAlign: 'left', fontSize: '0.875rem' }}>
                          {MODEL_OPTIONS.find(m => m.value === model)?.label}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {MODEL_OPTIONS.find(m => m.value === model)?.description}
                        </span>
                      </span>
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
                      transform: modelDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: 'var(--text-muted)',
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
                      zIndex: 50,
                      boxShadow: 'var(--shadow-xl)',
                      animation: 'fadeIn 0.2s ease',
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
                            padding: '0.75rem',
                            background: model === option.value ? 'var(--bg-secondary)' : 'transparent',
                            border: model === option.value ? '1px solid var(--border-default)' : '1px solid transparent',
                            borderRadius: '10px',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '0.25rem',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseOver={(e) => {
                            if (model !== option.value) {
                              e.currentTarget.style.background = 'var(--bg-secondary)';
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
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                          }}>
                            {option.value.split('-')[1]?.toUpperCase()?.substring(0, 2) || 'FX'}
                          </span>
                          <span style={{ flex: 1, textAlign: 'left' }}>
                            <span style={{ fontWeight: 600, display: 'block', fontSize: '0.875rem' }}>{option.label}</span>
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
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}>
                  Quality
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {QUALITY_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setQuality(preset.value)}
                      style={{
                        padding: '0.625rem 0.75rem',
                        background: quality === preset.value ? 'var(--accent-primary)' : 'var(--bg-card)',
                        border: quality === preset.value ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                        borderRadius: '10px',
                        color: quality === preset.value ? 'white' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        fontWeight: quality === preset.value ? 600 : 400,
                        fontSize: '0.8125rem',
                        boxShadow: quality === preset.value ? '0 2px 8px rgba(255, 140, 66, 0.25)' : 'none',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.125rem' }}>{preset.label}</div>
                      <div style={{ fontSize: '0.6875rem', opacity: quality === preset.value ? 0.85 : 0.7 }}>{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            {!isLoaded ? (
              <div style={{
                width: '100%',
                padding: '0.9375rem',
                background: 'var(--bg-tertiary)',
                borderRadius: '12px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.9375rem',
              }}>
                Loading...
              </div>
            ) : !isSignedIn ? (
              <div style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)',
                borderRadius: '12px',
                textAlign: 'center',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  marginBottom: '0.75rem',
                }}>
                  {ICONS.lock}
                  Sign in to generate
                </div>
                <SignInButton mode="modal">
                  <button
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem',
                      background: 'var(--gradient-primary)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center',
                      boxShadow: 'var(--shadow-glow-orange)',
                    }}
                  >
                    Sign In
                  </button>
                </SignInButton>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || state.status === 'generating'}
                style={{
                  width: '100%',
                  padding: '0.9375rem',
                  background: !prompt.trim() || state.status === 'generating'
                    ? 'var(--bg-tertiary)'
                    : 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: '12px',
                  color: !prompt.trim() || state.status === 'generating' ? 'var(--text-muted)' : 'white',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: !prompt.trim() || state.status === 'generating' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: !prompt.trim() || state.status === 'generating' ? 'none' : 'var(--shadow-glow-orange)',
                }}
              >
                {state.status === 'generating' ? (
                  <>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid var(--text-muted)',
                      borderTopColor: 'var(--accent-primary)',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Generating...
                  </>
                ) : (
                  <>
                    {ICONS.sparkles}
                    Generate Image
                  </>
                )}
              </button>
            )}
          </div>

          {/* Right: Result Display */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Progress */}
            {state.status === 'generating' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{
                  marginBottom: '1rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}>
                  {state.progress < 30 && 'Initializing model...'}
                  {state.progress >= 30 && state.progress < 60 && 'Generating image...'}
                  {state.progress >= 60 && state.progress < 90 && 'Applying refinements...'}
                  {state.progress >= 90 && 'Finalizing...'}
                </div>
                <div style={{
                  height: '6px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  marginBottom: '0.5rem',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${state.progress}%`,
                    background: 'var(--gradient-primary)',
                    borderRadius: '9999px',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                <div style={{
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.8125rem',
                }}>
                  {Math.round(state.progress)}%
                </div>
              </div>
            )}

            {/* Result Image */}
            {state.imageUrl && (
              <>
                <div style={{
                  flex: 1,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  marginBottom: '1rem',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img
                    src={state.imageUrl}
                    alt="Generated"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '400px',
                      aspectRatio: aspectRatio.replace(':', '/'),
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={handleDownload}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--gradient-primary)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: 'var(--shadow-glow-orange)',
                    }}
                  >
                    {ICONS.download}
                    Download
                  </button>
                  <button
                    onClick={() => setState({ status: 'idle', progress: 0, imageUrl: null, error: null })}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    {ICONS.refresh}
                    Create Another
                  </button>
                </div>
              </>
            )}

            {/* Error */}
            {state.status === 'error' && (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '1.5rem',
                background: 'var(--bg-secondary)',
                borderRadius: '14px',
                border: '1px solid rgba(220, 69, 69, 0.20)',
                textAlign: 'center',
              }}>
                <p style={{
                  color: 'var(--accent-primary)',
                  marginBottom: '1rem',
                  fontSize: '0.9375rem',
                }}>
                  {state.error}
                </p>
                <button
                  onClick={() => setState({ status: 'idle', progress: 0, imageUrl: null, error: null })}
                  style={{
                    padding: '0.625rem 1rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    margin: '0 auto',
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Placeholder */}
            {state.status === 'idle' && !state.imageUrl && (
              <div style={{
                flex: 1,
                aspectRatio: aspectRatio.replace(':', '/'),
                maxHeight: '400px',
                background: 'var(--bg-secondary)',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2.5rem',
                border: '2px dashed var(--border-default)',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
                <p style={{
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  fontSize: '0.9375rem',
                }}>
                  Your generated image will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
