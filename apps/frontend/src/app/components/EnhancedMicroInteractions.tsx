"use client";

import { useState } from 'react';
import { ConfidenceSlider } from './ConfidenceSlider';
import { LiveOddsUpdater } from './LiveOddsUpdater';
import PullToRefreshWrapper from './PullToRefreshWrapper';
import { useGestureControls, useSwipeableItem } from '../hooks/useGestureControls';
import { haptic } from './HapticFeedback';

export default function EnhancedMicroInteractions() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [confidenceFactors] = useState([
    {
      name: 'Home Form',
      impact: 15,
      description: 'Team has won 4 of last 5 home games'
    },
    {
      name: 'Head to Head',
      impact: -8,
      description: 'Lost last 2 meetings against this opponent'
    },
    {
      name: 'Injuries',
      impact: -5,
      description: 'Missing 2 key players'
    },
    {
      name: 'Weather',
      impact: 3,
      description: 'Favorable conditions for home team'
    }
  ]);

  const [matchOdds] = useState({
    home: 2.15,
    draw: 3.40,
    away: 3.25
  });

  const tabs = ['Confidence', 'Live Odds', 'Predictions'];

  useGestureControls({
    onSwipeLeft: () => {
      setSelectedTab(prev => Math.min(prev + 1, tabs.length - 1));
    },
    onSwipeRight: () => {
      setSelectedTab(prev => Math.max(prev - 1, 0));
    }
  });

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Data refreshed!');
  };

  const SwipeableCard = ({ title, onAction }: { title: string; onAction: (direction: 'left' | 'right') => void }) => {
    const { offset, isDragging, handlers } = useSwipeableItem(onAction);
    const [showPlaceBet, setShowPlaceBet] = useState(false);

    return (
      <div className="swipeable-card-wrapper">
        <div 
          className={`swipeable-card ${isDragging ? 'dragging' : ''}`}
          style={{
            transform: `translateX(${offset}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease'
          }}
          {...handlers}
        >
          <div className="card-content">
            <h4>{title}</h4>
            <p>Swipe left or right for actions</p>
            {!showPlaceBet && (
              <button 
                className="place-bet-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPlaceBet(true);
                  haptic.predictionPlaced();
                  setTimeout(() => setShowPlaceBet(false), 2000);
                }}
              >
                Place Prediction
              </button>
            )}
            {showPlaceBet && (
              <div className="prediction-placed">✓ Prediction Placed!</div>
            )}
          </div>
        </div>

        <div className="swipe-actions">
          <div 
            className="swipe-action left"
            style={{ opacity: offset < -50 ? 1 : 0 }}
          >
            Archive
          </div>
          <div 
            className="swipe-action right"
            style={{ opacity: offset > 50 ? 1 : 0 }}
          >
            Favorite
          </div>
        </div>
      </div>
    );
  };

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh}>
      <div className="enhanced-interactions-container">
        <header className="interactions-header">
          <h2>Enhanced Micro-Interactions</h2>
          <p className="subtitle">Swipe, pull, and interact with live data</p>
        </header>

        <div className="tabs-container">
          <div className="tabs">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`tab ${selectedTab === index ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTab(index);
                  haptic.selection();
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="tab-indicator" style={{ left: `${(selectedTab / tabs.length) * 100}%` }} />
        </div>

        <div className="content-area">
          {selectedTab === 0 && (
            <div className="tab-content">
              <ConfidenceSlider
                baseConfidence={65}
                factors={confidenceFactors}
                onConfidenceChange={(confidence) => {
                  console.log('Confidence changed:', confidence);
                }}
                showFactors={true}
              />
            </div>
          )}

          {selectedTab === 1 && (
            <div className="tab-content">
              <LiveOddsUpdater
                matchId="match-123"
                initialOdds={matchOdds}
                updateInterval={5000}
                onOddsChange={(odds) => {
                  console.log('Odds updated:', odds);
                }}
              />
            </div>
          )}

          {selectedTab === 2 && (
            <div className="tab-content">
              <div className="predictions-section">
                <h3>Your Predictions</h3>
                <div className="predictions-list">
                  <SwipeableCard
                    title="Manchester United vs Liverpool"
                    onAction={(direction) => {
                      if (direction === 'left') {
                        console.log('Archived prediction');
                        haptic.swipeAction();
                      } else {
                        console.log('Favorited prediction');
                        haptic.swipeAction();
                      }
                    }}
                  />
                  <SwipeableCard
                    title="Barcelona vs Real Madrid"
                    onAction={(direction) => {
                      if (direction === 'left') {
                        console.log('Archived prediction');
                        haptic.swipeAction();
                      } else {
                        console.log('Favorited prediction');
                        haptic.swipeAction();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="features-info">
          <h3>Available Interactions</h3>
          <ul>
            <li>📱 <strong>Haptic Feedback:</strong> Feel vibrations on key actions</li>
            <li>📊 <strong>Confidence Slider:</strong> Visual confidence with factors</li>
            <li>⚡ <strong>Live Odds:</strong> Real-time updates with animations</li>
            <li>👆 <strong>Swipe Gestures:</strong> Quick actions on predictions</li>
            <li>🔄 <strong>Pull to Refresh:</strong> Native mobile-style refresh</li>
          </ul>
        </div>

        <style jsx>{`
          .enhanced-interactions-container {
            min-height: 100vh;
            background: linear-gradient(to bottom, #0f172a, #1e293b);
            color: white;
            padding: 20px;
          }

          .interactions-header {
            text-align: center;
            margin-bottom: 32px;
            padding-top: 20px;
          }

          .interactions-header h2 {
            font-size: 2rem;
            font-weight: 700;
            margin: 0 0 8px 0;
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .subtitle {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.95rem;
            margin: 0;
          }

          .tabs-container {
            position: relative;
            margin-bottom: 24px;
          }

          .tabs {
            display: flex;
            gap: 8px;
            background: rgba(255, 255, 255, 0.05);
            padding: 4px;
            border-radius: 12px;
            position: relative;
          }

          .tab {
            flex: 1;
            padding: 12px;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            z-index: 2;
          }

          .tab.active {
            color: white;
            background: rgba(59, 130, 246, 0.3);
          }

          .tab-indicator {
            position: absolute;
            bottom: 0;
            width: 33.33%;
            height: 3px;
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
            border-radius: 3px;
            transition: left 0.3s ease;
          }

          .content-area {
            margin-bottom: 24px;
          }

          .tab-content {
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .predictions-section {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 20px;
          }

          .predictions-section h3 {
            margin: 0 0 16px 0;
            font-size: 1.25rem;
          }

          .predictions-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .swipeable-card-wrapper {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
          }

          .swipeable-card {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 12px;
            position: relative;
            z-index: 2;
            touch-action: pan-y;
          }

          .swipeable-card.dragging {
            cursor: grabbing;
          }

          .card-content {
            padding: 20px;
          }

          .card-content h4 {
            margin: 0 0 8px 0;
            font-size: 1.1rem;
          }

          .card-content p {
            margin: 0;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
          }

          .place-bet-btn {
            margin-top: 12px;
            padding: 8px 16px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .place-bet-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
          }

          .place-bet-btn:active {
            transform: translateY(0);
          }

          .prediction-placed {
            margin-top: 12px;
            padding: 8px 16px;
            background: rgba(16, 185, 129, 0.2);
            border: 2px solid #10b981;
            border-radius: 8px;
            color: #10b981;
            font-weight: 600;
            animation: fadeInScale 0.3s ease;
          }

          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .swipe-actions {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: space-between;
            z-index: 1;
          }

          .swipe-action {
            display: flex;
            align-items: center;
            padding: 0 24px;
            font-weight: 700;
            font-size: 1rem;
            transition: opacity 0.2s ease;
          }

          .swipe-action.left {
            background: #ef4444;
          }

          .swipe-action.right {
            background: #10b981;
          }

          .features-info {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 20px;
            margin-top: 24px;
          }

          .features-info h3 {
            margin: 0 0 16px 0;
            font-size: 1.1rem;
          }

          .features-info ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .features-info li {
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 0.95rem;
            line-height: 1.5;
          }

          .features-info li:last-child {
            border-bottom: none;
          }

          @media (max-width: 640px) {
            .enhanced-interactions-container {
              padding: 16px;
            }

            .interactions-header h2 {
              font-size: 1.5rem;
            }

            .tab {
              padding: 10px;
              font-size: 0.9rem;
            }
          }
        `}</style>
      </div>
    </PullToRefreshWrapper>
  );
}

export { EnhancedMicroInteractions };