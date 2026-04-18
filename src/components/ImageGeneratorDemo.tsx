'use client';

import { useState, useRef } from 'react';

const ICONS = {
  sparkles: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
  paintbrush: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/>
      <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/>
      <path d="M14.5 17.5 4.5 15"/>
    </svg>
  ),
  refresh: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  ),
  image: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  ),
  upload: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" x2="12" y1="3" y2="15"/>
    </svg>
  ),
  check: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
};

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
  const [model, setModel] = useState('flux-dev');
  const [quality, setQuality] = useState('standard');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [qualityDropdownOpen, setQualityDropdownOpen] = useState(false);
  const [aspectDropdownOpen, setAspectDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatios = [
    { label: 'Square', value: '1:1' },
    { label: 'Portrait', value: '3:4' },
    { label: 'Landscape', value: '4:3' },
    { label: 'Wide', value: '16:9' },
  ];

  const modelOptions = [
    { label: 'Flux.1 Schnell', value: 'flux-schnell', description: 'Fast, 4 steps' },
    { label: 'Flux.1 Dev', value: 'flux-dev', description: 'Best quality' },
    { label: 'Flux.1 Pro', value: 'flux-pro', description: 'Premium quality' },
  ];

  const qualityOptions = [
    { label: 'Standard', value: 'standard', description: 'Fast generation' },
    { label: 'HD', value: 'hd', description: 'Enhanced details' },
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
    <section id="generator" className="section-padded" style={{
      background: 'var(--bg-tertiary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient Glow Effects */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255, 140, 66, 0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(255, 140, 66, 0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1100px' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 140, 66, 0.08)',
            border: '1px solid rgba(255, 140, 66, 0.15)',
            borderRadius: '9999px',
            marginBottom: '1rem',
            color: 'var(--accent-primary)'
          }}>
            <span style={{ display: 'flex' }}>{ICONS.sparkles}</span>
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

        {/* Main Generator Card - Premium UI */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '2rem',
          border: '1px solid var(--border-default)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle top gradient line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)'
          }} />

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.25rem',
            background: 'var(--bg-tertiary)',
            borderRadius: '14px',
            padding: '0.25rem',
            marginBottom: '1.75rem'
          }}>
            <button
              onClick={() => setActiveTab('text')}
              style={{
                flex: 1,
                padding: '0.875rem 1rem',
                background: activeTab === 'text' ? 'var(--accent-primary)' : 'transparent',
                border: 'none',
                borderRadius: '10px',
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
              <span style={{ display: 'flex' }}>{ICONS.paintbrush}</span>
              Text to Image
            </button>
            <button
              onClick={() => setActiveTab('image')}
              style={{
                flex: 1,
                padding: '0.875rem 1rem',
                background: activeTab === 'image' ? 'var(--accent-secondary)' : 'transparent',
                border: 'none',
                borderRadius: '10px',
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
              <span style={{ display: 'flex' }}>{ICONS.refresh}</span>
              Image to Image
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'text' ? (
            <div>
              {/* Prompt Input */}
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create... A mystical forest with glowing mushrooms at twilight..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '1.25rem 1rem 2.5rem 1rem',
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
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.625rem' }}>
                  Try these prompts:
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {samplePrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(p)}
                      style={{
                        padding: '0.5rem 0.875rem',
                        background: 'rgba(255, 140, 66, 0.08)',
                        border: '1px solid rgba(255, 140, 66, 0.15)',
                        borderRadius: '9999px',
                        color: 'var(--accent-primary)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 140, 66, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(255, 140, 66, 0.25)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 140, 66, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 140, 66, 0.15)';
                      }}
                    >
                      {p.substring(0, 35)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings Row - Model, Quality, Aspect Ratio */}
              <div className="settings-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* Model Selector */}
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                    AI Model
                  </label>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => { setModelDropdownOpen(!modelDropdownOpen); setQualityDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.875rem',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: 'var(--gradient-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          flexShrink: 0
                        }}>
                          {model.split('-')[1]?.toUpperCase()?.substring(0, 2) || 'FX'}
                        </span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {modelOptions.find(m => m.value === model)?.label.split(' ')[1] || model}
                        </span>
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
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
                        zIndex: 10,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                      }}>
                        {modelOptions.map((option) => (
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
                              gap: '0.5rem',
                              marginBottom: '2px'
                            }}
                          >
                            <span style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              background: model === option.value ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: model === option.value ? 'white' : 'var(--text-secondary)',
                              fontSize: '0.625rem',
                              fontWeight: 700
                            }}>
                              {option.value.split('-')[1]?.toUpperCase()?.substring(0, 2) || 'FX'}
                            </span>
                            <span style={{ flex: 1, textAlign: 'left' }}>
                              <span style={{ fontWeight: 600, display: 'block', fontSize: '0.8125rem' }}>{option.label.split(' ')[1]}</span>
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

                {/* Quality Selector */}
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Quality
                  </label>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => { setQualityDropdownOpen(!qualityDropdownOpen); setModelDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.875rem',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem'
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>
                        {qualityOptions.find(q => q.value === quality)?.label}
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
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
                        zIndex: 10,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                      }}>
                        {qualityOptions.map((option) => (
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
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => { setAspectDropdownOpen(!aspectDropdownOpen); setModelDropdownOpen(false); setQualityDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.875rem',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem'
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>
                        {aspectRatios.find(r => r.value === aspectRatio)?.label} ({aspectRatio})
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
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
                        zIndex: 10,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                      }}>
                        {aspectRatios.map((ratio) => (
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
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', fontFamily: 'Georgia, serif' }}>{ratio.value}</span>
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

              <style>{`
                @media (max-width: 640px) {
                  .settings-row {
                    grid-template-columns: 1fr !important;
                  }
                }
              `}</style>
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
                  border: `2px dashed ${isDragging ? 'var(--accent-primary)' : uploadedImage ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                  borderRadius: '18px',
                  padding: '2.5rem 2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: uploadedImage ? 'rgba(255, 140, 66, 0.05)' : 'var(--bg-tertiary)',
                  marginBottom: '1.25rem'
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
                      top: '-10px',
                      right: '-10px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {ICONS.check}
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>{ICONS.upload}</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '0.375rem', fontWeight: 500 }}>
                      Drag & drop an image here
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      or click to browse — JPG, PNG, WebP
                    </p>
                  </>
                )}
              </div>

              {/* Remix Prompt */}
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <textarea
                  value={remixPrompt}
                  onChange={(e) => setRemixPrompt(e.target.value)}
                  placeholder="Describe how you want to transform this image..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '1rem 1rem 2rem 1rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '14px',
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
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }}>
                    Transformation Strength
                  </label>
                  <span style={{ color: 'var(--accent-secondary)', fontSize: '0.8125rem', fontWeight: 600 }}>
                    {Math.round(strength * 100)}%
                  </span>
                </div>
                <div style={{ position: 'relative', height: '8px' }}>
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '4px'
                  }} />
                  <div style={{
                    position: 'absolute',
                    width: `${strength * 100}%`,
                    height: '100%',
                    background: 'var(--accent-secondary)',
                    borderRadius: '4px',
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Keep Original</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Full Transform</span>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button - Premium */}
          <button
            onClick={handleGenerate}
            disabled={
              isGenerating || 
              (activeTab === 'text' && !prompt.trim()) ||
              (activeTab === 'image' && (!uploadedImage || !remixPrompt.trim()))
            }
            style={{
              width: '100%',
              padding: '1.125rem',
              marginTop: '1.5rem',
              background: isGenerating 
                ? 'var(--text-disabled)' 
                : 'linear-gradient(135deg, var(--accent-primary) 0%, #E67A35 100%)',
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
              boxShadow: isGenerating ? 'none' : '0 10px 25px -5px rgba(255, 140, 66, 0.4)',
              transform: isGenerating ? 'none' : 'translateY(0)'
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
                <span style={{ display: 'flex' }}>{ICONS.sparkles}</span>
                Generate Image
              </>
            )}
          </button>

          {/* Result */}
          {resultImage && (
            <div style={{
              marginTop: '1.75rem',
              borderRadius: '18px',
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
                padding: '1rem 1.25rem',
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
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 140, 66, 0.1)',
                    border: '1px solid rgba(255, 140, 66, 0.3)',
                    borderRadius: '10px',
                    color: 'var(--accent-primary)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}>
                    Download
                  </button>
                  <button style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 140, 66, 0.1)',
                    border: '1px solid rgba(255, 140, 66, 0.2)',
                    borderRadius: '10px',
                    color: 'var(--accent-primary)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem'
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
          gap: '3.5rem',
          marginTop: '2.5rem',
          flexWrap: 'wrap'
        }}>
          {[
            { value: '10s', label: 'Avg. Generation Time' },
            { value: '4K', label: 'Max Resolution' },
            { value: '50+', label: 'Art Styles' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                letterSpacing: '-0.02em'
              }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}