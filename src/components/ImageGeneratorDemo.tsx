'use client';

import { useState, useRef } from 'react';

export default function ImageGeneratorDemo() {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState('');
  const [remixPrompt, setRemixPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [strength, setStrength] = useState(0.7);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatios = [
    { label: 'Square', value: '1:1', icon: '◻️' },
    { label: 'Portrait', value: '3:4', icon: '📱' },
    { label: 'Landscape', value: '4:3', icon: '🖼️' },
    { label: 'Wide', value: '16:9', icon: '🎬' },
  ];

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = () => {
    if (activeTab === 'text' && !prompt.trim()) return;
    if (activeTab === 'image' && (!uploadedImage || !remixPrompt.trim())) return;
    
    setIsGenerating(true);
    setResultImage(null);
    
    setTimeout(() => {
      const seed = Date.now();
      const w = aspectRatio === '16:9' ? 800 : aspectRatio === '3:4' ? 600 : 700;
      const h = aspectRatio === '16:9' ? 450 : aspectRatio === '3:4' ? 800 : 700;
      setResultImage(`https://picsum.photos/seed/${seed}/${w}/${h}`);
      setIsGenerating(false);
    }, 2500);
  };

  const samplePrompts = [
    'A majestic dragon flying over a futuristic city at sunset',
    'Abstract geometric art with vibrant neon colors',
    'A cozy Japanese cafe in autumn with falling leaves',
    'Epic fantasy castle on a cliff with storm clouds'
  ];

  return (
    <section id="generator" style={{
      padding: '5rem 2rem',
      background: 'var(--bg-tertiary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Warm Ambient Glow Effects - Blue instead of Purple */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(8, 145, 178, 0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(37, 99, 235, 0.15)',
            borderRadius: '9999px',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '1rem' }}>✨</span>
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600,
              color: 'var(--accent-primary)'
            }}>
              AI Image Generator
            </span>
          </div>
          
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
            lineHeight: 1.2
          }}>
            Create Stunning Images{' '}
            <span style={{
              color: 'var(--accent-primary)'
            }}>
              in Seconds
            </span>
          </h2>
          
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.0625rem', 
            maxWidth: '500px', 
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Transform your ideas into breathtaking visuals with our state-of-the-art AI
          </p>
        </div>

        {/* Main Generator Card */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '1.5rem',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.25rem',
            background: 'var(--bg-tertiary)',
            borderRadius: '12px',
            padding: '0.25rem',
            marginBottom: '1.5rem'
          }}>
            <button
              onClick={() => setActiveTab('text')}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: activeTab === 'text' ? 'var(--accent-primary)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: activeTab === 'text' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>🎨</span> Text to Image
            </button>
            <button
              onClick={() => setActiveTab('image')}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: activeTab === 'image' ? 'var(--accent-secondary)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: activeTab === 'image' ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>🔄</span> Image to Image
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'text' ? (
            <div>
              {/* Prompt Input */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create... A mystical forest with glowing mushrooms at twilight..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '1rem 1rem 2.5rem 1rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '16px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    resize: 'none',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '0.75rem',
                  right: '0.75rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  {prompt.length}/500
                </span>
              </div>

              {/* Sample Prompts */}
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                  Try these prompts:
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {samplePrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(p)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        background: 'rgba(37, 99, 235, 0.08)',
                        border: '1px solid rgba(37, 99, 235, 0.15)',
                        borderRadius: '9999px',
                        color: 'var(--accent-primary)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.25)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(37, 99, 235, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.15)';
                      }}
                    >
                      {p.substring(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                  Aspect Ratio
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      style={{
                        padding: '0.625rem',
                        background: aspectRatio === ratio.value ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                        border: aspectRatio === ratio.value ? 'none' : '1px solid var(--border-default)',
                        borderRadius: '10px',
                        color: aspectRatio === ratio.value ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{ratio.icon}</span>
                      <span>{ratio.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Image Upload Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileSelect(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? 'var(--accent-primary)' : uploadedImage ? '#22c55e' : 'var(--border-default)'}`,
                  borderRadius: '16px',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: uploadedImage ? 'rgba(34, 197, 94, 0.05)' : 'var(--bg-tertiary)',
                  marginBottom: '1rem'
                }}
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
                {uploadedImage ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '150px', 
                        borderRadius: '12px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      color: 'white'
                    }}>
                      ✓
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🖼️</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                      Drag & drop an image here
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      or click to browse • JPG, PNG, WebP
                    </p>
                  </>
                )}
              </div>

              {/* Remix Prompt */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <textarea
                  value={remixPrompt}
                  onChange={(e) => setRemixPrompt(e.target.value)}
                  placeholder="Describe how you want to transform this image..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '0.875rem 1rem 2rem 1rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    resize: 'none',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Strength Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                    Transformation Strength
                  </label>
                  <span style={{ color: 'var(--accent-secondary)', fontSize: '0.8125rem', fontWeight: 600 }}>
                    {Math.round(strength * 100)}%
                  </span>
                </div>
                <div style={{ position: 'relative', height: '6px' }}>
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '3px'
                  }} />
                  <div style={{
                    position: 'absolute',
                    width: `${strength * 100}%`,
                    height: '100%',
                    background: 'var(--accent-secondary)',
                    borderRadius: '3px',
                    transition: 'width 0.1s'
                  }} />
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={strength}
                    onChange={(e) => setStrength(parseFloat(e.target.value))}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                      margin: 0
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Keep Original</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Full Transform</span>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={
              isGenerating || 
              (activeTab === 'text' && !prompt.trim()) ||
              (activeTab === 'image' && (!uploadedImage || !remixPrompt.trim()))
            }
            style={{
              width: '100%',
              padding: '1rem',
              marginTop: '1.25rem',
              background: isGenerating ? 'var(--text-disabled)' : 'var(--accent-primary)',
              border: 'none',
              borderRadius: '14px',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: isGenerating ? 'none' : 'var(--shadow-glow-blue)'
            }}
          >
            {isGenerating ? (
              <>
                <span style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Generating...
              </>
            ) : (
              <>
                <span>✨</span>
                Generate Image
              </>
            )}
          </button>

          {/* Result */}
          {resultImage && (
            <div style={{
              marginTop: '1.5rem',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid var(--border-default)',
              animation: 'fadeIn 0.5s ease'
            }}>
              <img
                src={resultImage}
                alt="Generated"
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  display: 'block'
                }}
              />
              <div style={{
                padding: '0.75rem 1rem',
                background: 'var(--bg-tertiary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  Generated with Flux.1 Dev
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    padding: '0.375rem 0.75rem',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    color: '#22c55e',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}>
                    Download
                  </button>
                  <button style={{
                    padding: '0.375rem 0.75rem',
                    background: 'rgba(37, 99, 235, 0.1)',
                    border: '1px solid rgba(37, 99, 235, 0.2)',
                    borderRadius: '8px',
                    color: 'var(--accent-primary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}>
                    Remix
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          {[
            { value: '10s', label: 'Avg. Generation Time' },
            { value: '4K', label: 'Max Resolution' },
            { value: '50+', label: 'Art Styles' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--accent-primary)'
              }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
