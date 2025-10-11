
"use client";

import React, { useState } from 'react';

interface EnhancedSocialShareProps {
  prediction: {
    id: string;
    matchName: string;
    prediction: string;
    confidence: number;
    sport: string;
  };
}

export default function EnhancedSocialShare({ prediction }: EnhancedSocialShareProps) {
  const [copied, setCopied] = useState(false);

  const generateOGImageUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({
      title: prediction.matchName,
      prediction: prediction.prediction,
      confidence: prediction.confidence.toString(),
      sport: prediction.sport
    });
    return `${baseUrl}/api/og-image?${params.toString()}`;
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `I predict ${prediction.prediction} for ${prediction.matchName} with ${prediction.confidence}% confidence! 🎯`;

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: '🐦',
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: '#4267B2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: '#0088cc',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: '#0077B5',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '1.1rem' }}>
        📤 Share Your Prediction
      </h3>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {socialPlatforms.map(platform => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px',
              background: `${platform.color}15`,
              border: `1px solid ${platform.color}40`,
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.background = `${platform.color}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = `${platform.color}15`;
            }}
          >
            <span style={{ fontSize: '2rem', marginBottom: '8px' }}>
              {platform.icon}
            </span>
            <span style={{ 
              color: platform.color, 
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              {platform.name}
            </span>
          </a>
        ))}
      </div>

      <button
        onClick={copyToClipboard}
        style={{
          width: '100%',
          padding: '12px',
          background: copied ? '#22c55e' : 'rgba(59, 130, 246, 0.2)',
          border: `1px solid ${copied ? '#22c55e' : 'rgba(59, 130, 246, 0.3)'}`,
          borderRadius: '10px',
          color: '#fff',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        {copied ? '✓ Copied!' : '🔗 Copy Link'}
      </button>

      {/* OG Image Preview */}
      <div style={{ marginTop: '16px', display: 'none' }}>
        <img 
          src={generateOGImageUrl()} 
          alt="Preview" 
          style={{ width: '100%', borderRadius: '8px' }}
        />
      </div>
    </div>
  );
}
