'use client';

import { useState, useRef, useCallback } from 'react';

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
  const [state, setState] = useState<GenerationState>({
    status: 'idle',
    progress: 0,
    imageUrl: null,
    resultUrl: null,
    error: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    setState({ 
      status: 'generating', 
      progress: 0, 
      imageUrl: imageUrl,
      resultUrl: null, 
      error: null 
    });

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
          strength 
        }),
      });

      const data = await response.json();

      clearInterval(progressInterval);

      if (data.error) {
        setState({ status: 'error', progress: 0, imageUrl: null, resultUrl: null, error: data.error });
      } else {
        setState({ 
          status: 'complete', 
          progress: 100, 
          imageUrl: imageUrl,
          resultUrl: data.imageUrl, 
          error: null 
        });
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
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || !imageUrl || state.status === 'generating'}
              className="btn-generate mt-3"
              style={{
                width: '100%',
                opacity: !prompt.trim() || !imageUrl || state.status === 'generating' ? 0.6 : 1,
                cursor: !prompt.trim() || !imageUrl || state.status === 'generating' ? 'not-allowed' : 'pointer',
                background: 'linear-gradient(135deg, #de1d8d 0%, #ff5b4f 100%)'
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
                  Remix Image
                </span>
              )}
            </button>
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
