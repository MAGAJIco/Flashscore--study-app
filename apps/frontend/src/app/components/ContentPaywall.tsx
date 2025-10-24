"use client";
import React, { useState } from 'react';
import { VisitorManager } from '@magajico/shared/utils';

interface ContentPaywallProps {
  contentType: 'predictions' | 'live_data' | 'statistics' | 'premium_analysis';
  title: string;
  preview?: string;
  onUpgrade?: () => void;
  onRegister?: () => void;
}

const ContentPaywall: React.FC<ContentPaywallProps> = ({
  contentType,
  title,
  preview,
  onUpgrade,
  onRegister
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const paywallData = VisitorManager.generatePaywallMessage(contentType);
  const visitorData = VisitorManager.getVisitorData();

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'predictions': return '🔮';
      case 'live_data': return '📊';
      case 'statistics': return '📈';
      case 'premium_analysis': return '⭐';
      default: return '🔒';
    }
  };

  const getGradientColors = (type: string) => {
    switch (type) {
      case 'predictions': return 'from-purple-600 to-blue-600';
      case 'live_data': return 'from-green-600 to-teal-600';
      case 'statistics': return 'from-orange-600 to-red-600';
      case 'premium_analysis': return 'from-yellow-600 to-amber-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const handleAction = () => {
    switch (paywallData.ctaAction) {
      case 'register':
        onRegister?.();
        break;
      case 'upgrade':
        onUpgrade?.();
        break;
      case 'wait':
        // Show wait message
        break;
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, ${getGradientColors(contentType)})`,
        opacity: 0.1,
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Lock Icon */}
        <div style={{
          fontSize: '4rem',
          marginBottom: '20px',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
        }}>
          🔒
        </div>

        {/* Title */}
        <h2 style={{
          color: '#fff',
          fontSize: '2rem',
          marginBottom: '16px',
          background: `linear-gradient(135deg, ${getGradientColors(contentType).replace('from-', '').replace('to-', ', ')})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {paywallData.title}
        </h2>

        {/* Message */}
        <p style={{
          color: '#d1fae5',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          marginBottom: '24px',
          maxWidth: '500px',
          margin: '0 auto 24px'
        }}>
          {paywallData.message}
        </p>

        {/* Content Preview */}
        {preview && (
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => setShowPreview(!showPreview)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginBottom: '12px'
              }}
            >
              {showPreview ? '👁️ Hide Preview' : '👀 Show Preview'}
            </button>

            {showPreview && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                color: '#ccc',
                fontSize: '0.9rem',
                filter: 'blur(1px)',
                position: 'relative'
              }}>
                {preview}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.8rem'
                }}>
                  {getContentIcon(contentType)} Preview Only
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {visitorData && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px'
          }}>
            <div>
              <div style={{ color: '#22c55e', fontSize: '1.2rem', fontWeight: '700' }}>
                {visitorData.visitCount}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Visits</div>
            </div>
            <div>
              <div style={{ color: '#06b6d4', fontSize: '1.2rem', fontWeight: '700' }}>
                {visitorData.accessLevel}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Access Level</div>
            </div>
            <div>
              <div style={{ color: '#f59e0b', fontSize: '1.2rem', fontWeight: '700' }}>
                {visitorData.contentAccessed.length}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Content Accessed</div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleAction}
          style={{
            background: `linear-gradient(135deg, ${getGradientColors(contentType).replace('from-', '').replace('to-', ', ')})`,
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            marginBottom: '16px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
          }}
        >
          {paywallData.ctaText}
        </button>

        {/* Alternative Options */}
        <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
          {visitorData?.accessLevel === 'guest' ? (
            <p>
              ✨ Free signup includes: 15 daily predictions, 25 live updates, 10 statistics views
            </p>
          ) : (
            <p>
              ⭐ Premium includes: Unlimited access, exclusive analysis, priority support
            </p>
          )}
        </div>

        {/* Trust Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '24px',
          fontSize: '0.8rem',
          color: '#6b7280'
        }}>
          <span>🔐 Secure</span>
          <span>📱 Mobile Friendly</span>
          <span>⚡ Instant Access</span>
          <span>🎯 94% Accuracy</span>
        </div>
      </div>
    </div>
  );
};

export default ContentPaywall;