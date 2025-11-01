
"use client";

import React, { useState } from 'react';

interface SharePredictionProps {
  prediction: {
    homeTeam: string;
    awayTeam: string;
    prediction: string;
    confidence: number;
  };
}

export function SharePrediction({ prediction }: SharePredictionProps) {
  const [copied, setCopied] = useState(false);

  const generateShareText = () => {
    const outcome = prediction.prediction === 'home' 
      ? prediction.homeTeam 
      : prediction.prediction === 'away' 
        ? prediction.awayTeam 
        : 'Draw';
    
    return `🎯 My Prediction: ${prediction.homeTeam} vs ${prediction.awayTeam}\n✅ ${outcome} to win\n📊 Confidence: ${prediction.confidence}%\n\n#SportsCentral #AIPredict`;
  };

  const shareToTwitter = () => {
    const text = generateShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700">
      <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
        📤 Share This Prediction
      </h4>
      
      <div className="flex gap-2">
        <button
          onClick={shareToTwitter}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <span>𝕏</span> Twitter
        </button>
        
        <button
          onClick={shareToFacebook}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <span>f</span> Facebook
        </button>
        
        <button
          onClick={copyToClipboard}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
    </div>
  );
}
