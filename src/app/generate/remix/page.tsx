'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

const ASPECT_RATIOS = [
  { label: 'Square', value: '1:1' },
  { label: 'Portrait', value: '3:4' },
  { label: 'Landscape', value: '4:3' },
  { label: 'Wide', value: '16:9' },
];

const QUALITY_OPTIONS = [
  { label: 'Standard', value: 'standard', description: 'Fast generation' },
  { label: 'HD', value: 'hd', description: 'Enhanced details' },
];

const MODEL_OPTIONS = [
  { label: 'Flux.1 Schnell', value: 'flux-schnell', description: 'Fast, 4 steps' },
  { label: 'Flux.1 Dev', value: 'flux-dev', description: 'Best quality' },
  { label: 'Flux.1 Pro', value: 'flux-pro', description: 'Premium quality' },
];

interface GenerationState {
  status: 'idle' | 'uploading' | 'generating' | 'complete' | 'error';
  progress: number;
  imageUrl: string | null;
  resultUrl: string | null;
  error: string | null;
}

export default function RemixPage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [strength, setStrength] = useState(0.7);
  const [model, setModel] = useState('flux-schnell');
  const [quality, setQuality] = useState('standard');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [qualityDropdownOpen, setQualityDropdownOpen] = useState(false);
  const [aspectDropdownOpen, setAspectDropdownOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState(false);
  const [state, setState] = useState<GenerationState>({
    status: 'idle',
    progress: 0,
    imageUrl: null,
    resultUrl: null,
    error: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      
      // For demo, we'll use the uploaded image as-is
      // In production, you'd upload to a temporary storage
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || !imageUrl) return;

    // Check credits first
    if (credits !== null && credits <= 0) {
      setInsufficientCredits(true);
      return;
    }

    setState({ 
      status: 'generating', 
      progress: 0, 
      imageUrl: imageUrl,
      resultUrl: null, 
      error: null 
    });
    setInsufficientCredits(false);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 12, 90),
      }));
    }, 400);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          imageUrl,
          mode: 'remix',
          strength,
          model,
          quality,
          aspectRatio
        }),
      });

      const data = await response.json();

      clearInterval(progressInterval);

      if (data.error) {
        setState({ status: 'error', progress: 0, imageUrl: null, resultUrl: null, error: data.error });
        if (data.error.includes('credits') || data.error.includes('Credit')) {
          setInsufficientCredits(true);
        }
      } else {
        setState({ 
          status: 'complete', 
          progress: 100, 
          imageUrl: imageUrl,
          resultUrl: data.imageUrl, 
          error: null 
        });
        // Update credits after successful generation
        if (credits !== null) {
          setCredits(prev => prev !== null ? prev - 1 : null);
        }
      }
    } catch (error) {
      clearInterval(progressInterval);
      setState({ 
        status: 'error', 
        progress: 0, 
        imageUrl: null,
        resultUrl: null, 
        error: 'Network error. Please try again.' 
      });
    }
  };

  const handleDownload = () => {
    if (!state.resultUrl) return;
    const link = document.createElement('a');
    link.href = state.resultUrl;
    link.download = `ai-remix-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="generate-page">
      <div className="orb orb-1" style={{ opacity: 0.3 }} />
      <div className="orb orb-2" style={{ opacity: 0.2 }} />

      <div className="generate-container">
        {/* Header */}
        <div className="generate-header">
          <h1 className="generate-title">
            <span style={{
              background: 'linear-gradient(135deg, #de1d8d, #ff5b4f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Image to Image
            </span>
          </h1>
          <p className="generate-subtitle">
            Upload an image and transform it with AI
          </p>
        </div>

        <div className="generate-grid">
          {/* Left: Upload + Prompt */}
          <div>
            {/* Upload Zone */}
            {!imagePreview ? (
              <div
                className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
                <div className="upload-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor">
                    <path d="M24 4L36 16H28V32H20V16H12L24 4Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 44V36H12V44H36V36H44V44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="upload-text">
                  Drag and drop an image here, or click to browse
                </p>
                <p className="upload-text" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                  Supports JPG, PNG, WebP up to 10MB
                </p>
              </div>
            ) : (
              <div className="upload-preview">
                <img 
                  src={imagePreview} 
                  alt="Upload preview" 
                  style={{ 
                    width: '100%', 
                    borderRadius: '12px',
                    aspectRatio: '1',
                    objectFit: 'cover'
                  }} 
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setImageUrl(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    background: 'var(--vercel-black)',
                    border: 'none',
                    color: 'var(--vercel-white)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Prompt Input */}
            <div className="prompt-input-wrapper mt-3">
              <textarea
                className="prompt-input"
                placeholder="Transform this image into a cyberpunk style, neon lights, rain-soaked streets..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={1000}
              />
              <span className="prompt-char-count">{prompt.length}/1000</span>
            </div>

            {/* Strength Slider */}
            <div className="settings-panel mt-3">
              {/* Model Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                  AI Model
                </label>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {/* Quality */}
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Quality
                  </label>
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
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>{option.description}</span>
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
                  <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Aspect Ratio
                  </label>
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

              {/* Transformation Strength */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="settings-label">Transformation Strength</label>
                <span style={{ color: 'var(--vercel-white)', fontSize: '0.875rem' }}>
                  {Math.round(strength * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={strength}
                onChange={(e) => setStrength(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  accentColor: 'var(--preview-pink)'
                }}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                color: 'var(--vercel-gray-500)',
                fontSize: '0.75rem',
                marginTop: '0.25rem'
              }}>
                <span>Keep Original</span>
                <span>Full Transform</span>
              </div>
            </div>

            {/* Generate Button */}
            {!isSignedIn ? (
              <div style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                background: 'rgba(255, 140, 66, 0.08)',
                border: '1px solid rgba(255, 140, 66, 0.15)',
                borderRadius: '14px',
                textAlign: 'center'
              }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1rem' }}>
                  Sign in to remix images
                </p>
                <Link href="/login" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.5rem',
                  background: 'linear-gradient(135deg, #de1d8d 0%, #ff5b4f 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(222, 29, 141, 0.3)'
                }}>
                  Sign In to Remix
                </Link>
              </div>
            ) : (
              <>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || !imageUrl || state.status === 'generating'}
                  className="btn-generate mt-3"
                  style={{
                    width: '100%',
                    opacity: !prompt.trim() || !imageUrl || state.status === 'generating' ? 0.6 : 1,
                    cursor: !prompt.trim() || !imageUrl || state.status === 'generating' ? 'not-allowed' : 'pointer',
                    background: 'linear-gradient(135deg, #de1d8d 0%, #ff5b4f 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {state.status === 'generating' ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span className="spinner" />
                      Transforming...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2L2 10L6 10L4 18L16 6L12 6L14 2L10 2Z" fill="currentColor"/>
                      </svg>
                      Remix Image {credits !== null && <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>({credits} credits)</span>}
                    </span>
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
              </>
            )}
          </div>

          {/* Right: Result */}
          <div>
            {/* Progress */}
            {state.status === 'generating' && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
                <p className="progress-text">
                  {state.progress < 30 && 'Analyzing image...'}
                  {state.progress >= 30 && state.progress < 60 && 'Applying AI transformation...'}
                  {state.progress >= 60 && state.progress < 90 && 'Refining details...'}
                  {state.progress >= 90 && 'Finalizing...'}
                </p>
              </div>
            )}

            {/* Result */}
            {state.resultUrl && (
              <div className="result-container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ 
                      color: 'var(--vercel-gray-400)', 
                      fontSize: '0.75rem',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      Original
                    </p>
                    <img
                      src={state.imageUrl || ''}
                      alt="Original"
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        aspectRatio: '1',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div>
                    <p style={{ 
                      color: 'var(--vercel-gray-400)', 
                      fontSize: '0.75rem',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      Remixed
                    </p>
                    <img
                      src={state.resultUrl}
                      alt="Remixed"
                      className="result-image"
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        aspectRatio: '1',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </div>
                <div className="result-actions">
                  <button onClick={handleDownload} className="btn btn-secondary">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 12V2M4 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={() => setState({ 
                      status: 'idle', 
                      progress: 0, 
                      imageUrl: null,
                      resultUrl: null, 
                      error: null 
                    })}
                    className="btn btn-ghost"
                    style={{ color: 'var(--vercel-white)' }}
                  >
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
                  onClick={() => setState({ 
                    status: 'idle', 
                    progress: 0, 
                    imageUrl: null,
                    resultUrl: null, 
                    error: null 
                  })}
                  className="btn btn-secondary"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Placeholder */}
            {state.status === 'idle' && !state.resultUrl && (
              <div style={{
                aspectRatio: '1',
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
                    <path d="M16 4L4 16L16 28L28 16L16 4Z" strokeWidth="2"/>
                    <path d="M4 16L16 28L28 16" strokeWidth="2"/>
                  </svg>
                </div>
                <p style={{ color: 'var(--vercel-gray-500)', textAlign: 'center' }}>
                  Upload an image and add a prompt to remix
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
