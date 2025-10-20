"use client";

import React, { useState } from 'react';
import { ShareImageGenerator } from '../utils/shareImageGenerator';
import { QRCodeGenerator } from '../utils/qrCodeGenerator';
import { DeepLinkAnalytics } from '../utils/deepLinkAnalytics';

interface ShareData {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
  prediction?: {
    match: string;
    confidence: number;
    prediction: string;
    sport: string;
  };
}

interface SocialShareButtonProps {
  data: ShareData;
  type?: 'prediction' | 'leaderboard' | 'match' | 'news';
}

export default function SocialShareButton({ data, type = 'prediction' }: SocialShareButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');

  const shareUrl = `${window.location.origin}${data.url}?source=share`;

  const handleNativeShare = async () => {
    DeepLinkAnalytics.trackDeepLink({ type, id: data.url, source: 'social' });

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

  const generateShareImage = async () => {
    if (!data.prediction) return;

    const blob = await ShareImageGenerator.generatePredictionImage(data.prediction);
    await ShareImageGenerator.shareImage(blob, {
      title: data.title,
      text: data.text
    });
  };

  const generateQRCode = async () => {
    const qr = await QRCodeGenerator.generateDeepLinkQR({
      type,
      id: data.url.split('/').pop() || '',
      title: data.title
    });
    setQrCode(qr);
    setShowQR(true);
    DeepLinkAnalytics.trackDeepLink({ type, id: data.url, source: 'qr' });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  // Placeholder functions for social sharing - implement actual logic
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(data.text)}`;
    window.open(twitterUrl, '_blank');
    DeepLinkAnalytics.trackDeepLink({ type, id: data.url, source: 'twitter' });
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
    DeepLinkAnalytics.trackDeepLink({ type, id: data.url, source: 'facebook' });
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(data.text + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
    DeepLinkAnalytics.trackDeepLink({ type, id: data.url, source: 'whatsapp' });
  };

  return (
    <div className="social-share-container">
      <button onClick={handleNativeShare} className="native-share-button">
        Share
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
          {data.prediction && (
            <button onClick={generateShareImage} className="share-option">
              <span className="share-option-icon">🖼️</span>
              <span>Share Image</span>
            </button>
          )}
          <button onClick={generateQRCode} className="share-option">
            <span className="share-option-icon">📱</span>
            <span>QR Code</span>
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

      {showQR && (
        <div className="qr-modal" onClick={() => setShowQR(false)}>
          <div className="qr-content" onClick={(e) => e.stopPropagation()}>
            <h3>Scan to Share</h3>
            <img src={qrCode} alt="QR Code" style={{ width: '300px', height: '300px' }} />
            <p>{data.title}</p>
            <button onClick={() => setShowQR(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}