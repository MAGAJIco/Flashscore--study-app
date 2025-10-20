
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'ai' | 'social' | 'analytics' | 'education' | 'safety';
  status: 'live' | 'beta' | 'coming-soon';
  link?: string;
}

export default function FeatureShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const features: Feature[] = [
    {
      id: 'ai-predictions',
      title: 'AI-Powered Predictions',
      description: 'Get real-time predictions with 87% accuracy using advanced ML models',
      icon: '🤖',
      category: 'ai',
      status: 'live',
      link: '/empire/ai-ceo'
    },
    {
      id: 'live-chat',
      title: 'ChatGPT-like Interface',
      description: 'Chat naturally with MagajiCo AI for predictions and insights',
      icon: '💬',
      category: 'ai',
      status: 'live',
      link: '/empire/ai-ceo'
    },
    {
      id: 'coach-assistant',
      title: 'AI Coach Assistant',
      description: 'Personal AI coach analyzes your predictions and helps you improve',
      icon: '🎓',
      category: 'education',
      status: 'live'
    },
    {
      id: 'ar-predictions',
      title: 'AR Prediction Overlay',
      description: 'Augmented reality overlay for real-time match predictions',
      icon: '🥽',
      category: 'ai',
      status: 'beta'
    },
    {
      id: 'social-challenges',
      title: 'Friend Challenges',
      description: 'Challenge friends to prediction battles and climb leaderboards',
      icon: '🏆',
      category: 'social',
      status: 'live'
    },
    {
      id: 'live-match-chat',
      title: 'Live Match Chat',
      description: 'Real-time chat during matches with other predictors',
      icon: '⚡',
      category: 'social',
      status: 'live'
    },
    {
      id: 'advanced-analytics',
      title: 'Advanced Analytics',
      description: 'Deep dive into your prediction patterns and performance',
      icon: '📊',
      category: 'analytics',
      status: 'live',
      link: '/analytics'
    },
    {
      id: 'confidence-evolution',
      title: 'Confidence Evolution',
      description: 'Track how your confidence levels change and improve over time',
      icon: '📈',
      category: 'analytics',
      status: 'live'
    },
    {
      id: 'kids-mode',
      title: 'Kids Safe Mode',
      description: 'COPPA-compliant safe environment for young users',
      icon: '👶',
      category: 'safety',
      status: 'live'
    },
    {
      id: 'parental-dashboard',
      title: 'Parental Dashboard',
      description: 'Real-time monitoring and controls for parents',
      icon: '👨‍👩‍👧',
      category: 'safety',
      status: 'live'
    },
    {
      id: 'blockchain-verify',
      title: 'Blockchain Verification',
      description: 'Immutable prediction records on blockchain',
      icon: '🔗',
      category: 'analytics',
      status: 'beta'
    },
    {
      id: 'voice-predictions',
      title: 'Voice-Activated Predictions',
      description: 'Make predictions using voice commands',
      icon: '🎤',
      category: 'ai',
      status: 'coming-soon'
    },
    {
      id: 'multilingual',
      title: 'Multi-Language Support',
      description: 'Platform available in 50+ languages',
      icon: '🌍',
      category: 'education',
      status: 'live'
    },
    {
      id: 'offline-mode',
      title: 'Offline Predictions',
      description: 'Make predictions even without internet connection',
      icon: '📴',
      category: 'ai',
      status: 'live'
    },
    {
      id: 'expert-follow',
      title: 'Follow Experts',
      description: 'Learn from top predictors and copy their strategies',
      icon: '⭐',
      category: 'social',
      status: 'live'
    },
    {
      id: 'achievement-system',
      title: 'Achievement System',
      description: 'Earn badges and rewards for milestones',
      icon: '🏅',
      category: 'education',
      status: 'live'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Features', icon: '🌟' },
    { id: 'ai', label: 'AI & ML', icon: '🤖' },
    { id: 'social', label: 'Social', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'education', label: 'Learning', icon: '📚' },
    { id: 'safety', label: 'Safety', icon: '🛡️' }
  ];

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(f => f.category === activeCategory);

  return (
    <div className="feature-showcase">
      <div className="showcase-header">
        <h2 className="showcase-title">Explore MagajiCo Features</h2>
        <p className="showcase-subtitle">
          Discover all the powerful tools at your fingertips
        </p>
      </div>

      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
          >
            <span className="category-icon">{cat.icon}</span>
            <span className="category-label">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="features-grid">
        {filteredFeatures.map(feature => (
          <div key={feature.id} className="feature-card">
            <div className="feature-header">
              <div className="feature-icon">{feature.icon}</div>
              <div className={`feature-status ${feature.status}`}>
                {feature.status === 'live' && '✅ Live'}
                {feature.status === 'beta' && '🧪 Beta'}
                {feature.status === 'coming-soon' && '🚀 Soon'}
              </div>
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            {feature.link && (
              <Link href={feature.link} className="feature-link">
                Try it now →
              </Link>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .feature-showcase {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }

        .showcase-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .showcase-title {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 12px 0;
        }

        .showcase-subtitle {
          color: #94a3b8;
          font-size: 18px;
          margin: 0;
        }

        .category-filters {
          display: flex;
          gap: 12px;
          margin-bottom: 40px;
          overflow-x: auto;
          padding: 8px;
          scrollbar-width: none;
        }

        .category-filters::-webkit-scrollbar {
          display: none;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 20px;
          color: #94a3b8;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .category-btn:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-2px);
        }

        .category-btn.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
          border-color: rgba(99, 102, 241, 0.5);
          color: white;
        }

        .category-icon {
          font-size: 20px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .feature-card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.3s ease;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-card:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .feature-status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .feature-status.live {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .feature-status.beta {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .feature-status.coming-soon {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .feature-title {
          color: white;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 12px 0;
        }

        .feature-description {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 16px 0;
        }

        .feature-link {
          display: inline-flex;
          align-items: center;
          color: #60a5fa;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .feature-link:hover {
          color: #93c5fd;
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .showcase-title {
            font-size: 32px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
