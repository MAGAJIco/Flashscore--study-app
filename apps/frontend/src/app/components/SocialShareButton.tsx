
"use client";

import React, { useState } from 'react';

interface ShareData {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
}

interface SocialShareButtonProps {
  data: ShareData;
  type?: 'prediction' | 'leaderboard' | 'match' | 'news';
}

export default function SocialShareButton({ data, type = 'prediction' }: SocialShareButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}${data.url}`;
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      setShowOptions(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'width=550,height=420');
  };

  const shareToWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${data.text} ${shareUrl}`)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="social-share-container">
      <button 
        onClick={handleNativeShare}
        className="share-button"
        aria-label="Share"
      >
        <span className="share-icon">📤</span>
        <span className="share-text">Share</span>
      </button>

      {showOptions && (
        <div className="share-options-dropdown">
          <button onClick={shareToTwitter} className="share-option">
            <span className="share-option-icon">🐦</span>
            <span>Twitter</span>
          </button>
          <button onClick={shareToFacebook} className="share-option">
            <span className="share-option-icon">📘</span>
            <span>Facebook</span>
          </button>
          <button onClick={shareToWhatsApp} className="share-option">
            <span className="share-option-icon">💬</span>
            <span>WhatsApp</span>
          </button>
          <button onClick={copyToClipboard} className="share-option">
            <span className="share-option-icon">{copied ? '✅' : '🔗'}</span>
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
          <button onClick={() => setShowOptions(false)} className="share-option close">
            <span className="share-option-icon">✕</span>
            <span>Close</span>
          </button>
        </div>
      )}

      <style jsx>{`
        .social-share-container {
          position: relative;
        }

        .share-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .share-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .share-icon {
          font-size: 1.1rem;
        }

        .share-text {
          font-size: 0.9rem;
        }

        .share-options-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 8px;
          min-width: 200px;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .share-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 4px;
        }

        .share-option:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(4px);
        }

        .share-option.close {
          background: rgba(239, 68, 68, 0.2);
          margin-top: 4px;
        }

        .share-option-icon {
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
}
