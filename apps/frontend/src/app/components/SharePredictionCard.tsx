
"use client";
import React, { useState } from 'react';

interface SharePredictionCardProps {
  match: {
    homeTeam: string;
    awayTeam: string;
    league: string;
    predictedWinner: string;
    confidence: number;
  };
}

const SharePredictionCard: React.FC<SharePredictionCardProps> = ({ match }) => {
  const [copied, setCopied] = useState(false);

  const shareText = `🔮 My Prediction: ${match.homeTeam} vs ${match.awayTeam}
${match.predictedWinner} to win!
Confidence: ${match.confidence}%

Join me on MagajiCo! 🚀`;

  const shareUrl = `https://magajico.com/share?match=${encodeURIComponent(match.homeTeam + ' vs ' + match.awayTeam)}`;

  const handleShare = async (platform: string) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    };

    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareText + '\n' + shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (navigator.vibrate) navigator.vibrate(50);
      return;
    }

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      maxWidth: '400px'
    }}>
      {/* Match Card Preview */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '12px' }}>
          {match.league}
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏟️</div>
            <div style={{ color: 'white', fontWeight: 'bold' }}>{match.homeTeam}</div>
          </div>
          
          <div style={{ 
            fontSize: '2rem', 
            color: '#3b82f6',
            fontWeight: 'bold'
          }}>
            VS
          </div>
          
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏟️</div>
            <div style={{ color: 'white', fontWeight: 'bold' }}>{match.awayTeam}</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(59, 130, 246, 0.3)',
          padding: '12px',
          borderRadius: '12px',
          marginTop: '16px'
        }}>
          <div style={{ color: '#3b82f6', fontSize: '0.85rem', marginBottom: '4px' }}>
            My Prediction
          </div>
          <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {match.predictedWinner}
          </div>
          <div style={{
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <div style={{ 
              flex: 1,
              height: '6px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${match.confidence}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                borderRadius: '3px'
              }} />
            </div>
            <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {match.confidence}%
            </span>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          fontSize: '0.75rem',
          color: '#9ca3af'
        }}>
          🔮 Powered by MagajiCo AI
        </div>
      </div>

      {/* Share Buttons */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '12px' }}>
          Share your prediction:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <button
            onClick={() => handleShare('twitter')}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #1DA1F2, #0d8bd9)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>𝕏</span> Twitter
          </button>

          <button
            onClick={() => handleShare('facebook')}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #1877F2, #0d65d9)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>f</span> Facebook
          </button>

          <button
            onClick={() => handleShare('whatsapp')}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #25D366, #1da851)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>📱</span> WhatsApp
          </button>

          <button
            onClick={() => handleShare('telegram')}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #0088cc, #006ba6)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>✈️</span> Telegram
          </button>
        </div>
      </div>

      {/* Copy Link */}
      <button
        onClick={() => handleShare('copy')}
        style={{
          width: '100%',
          padding: '12px',
          background: copied 
            ? 'linear-gradient(135deg, #10b981, #059669)'
            : 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          color: 'white',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        {copied ? '✅ Copied!' : '📋 Copy Link'}
      </button>
    </div>
  );
};

export default SharePredictionCard;
