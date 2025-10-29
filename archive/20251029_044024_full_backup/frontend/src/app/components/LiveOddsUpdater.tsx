"use client";

import { useState, useEffect, useRef } from 'react';
import { haptic } from '@/app/components/HapticFeedback';

interface OddsData {
  home: number;
  draw?: number;
  away: number;
  trend?: 'up' | 'down' | 'stable';
}

interface LiveOddsUpdaterProps {
  matchId: string;
  initialOdds: OddsData;
  updateInterval?: number;
  onOddsChange?: (newOdds: OddsData) => void;
}

export function LiveOddsUpdater({
  matchId,
  initialOdds,
  updateInterval = 5000,
  onOddsChange
}: LiveOddsUpdaterProps) {
  const [currentOdds, setCurrentOdds] = useState<OddsData>(initialOdds);
  const [previousOdds, setPreviousOdds] = useState<OddsData>(initialOdds);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const animationRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/odds?matchId=${matchId}`);
        if (response.ok) {
          const newOdds = await response.json();

          if (JSON.stringify(newOdds) !== JSON.stringify(currentOdds)) {
            setPreviousOdds(currentOdds);
            setCurrentOdds(newOdds);
            setLastUpdate(new Date());
            if (typeof window !== 'undefined') {
              haptic.oddsChanged();
            }
            onOddsChange?.(newOdds);
          }
        }
      } catch (error) {
        console.error('Failed to fetch odds:', error);
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [matchId, updateInterval, isLive, currentOdds, onOddsChange]);

  const getOddsChange = (current: number, previous: number): 'up' | 'down' | 'stable' => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  const formatOdds = (odds: number) => odds.toFixed(2);

  const OddsItem = ({
    label,
    current,
    previous
  }: {
    label: string;
    current: number;
    previous: number;
  }) => {
    const change = getOddsChange(current, previous);
    const hasChanged = current !== previous;

    return (
      <div className={`odds-item ${hasChanged ? 'changed' : ''} ${change}`}>
        <div className="odds-label">{label}</div>
        <div className="odds-value-container">
          <div className={`odds-value ${hasChanged ? 'pulse' : ''}`}>
            {formatOdds(current)}
          </div>
          {hasChanged && (
            <div className={`odds-arrow ${change}`}>
              {change === 'up' ? '↑' : change === 'down' ? '↓' : ''}
            </div>
          )}
        </div>
        {hasChanged && (
          <div className="odds-diff">
            {change === 'up' ? '+' : ''}{(current - previous).toFixed(2)}
          </div>
        )}
      </div>
    );
  };

  const timeSinceUpdate = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className="live-odds-container">
      <div className="odds-header">
        <div className="live-indicator">
          <span className={`live-dot ${isLive ? 'active' : ''}`} />
          <span className="live-text">
            {isLive ? 'LIVE ODDS' : 'PAUSED'}
          </span>
        </div>
        <div className="last-update">
          Updated {timeSinceUpdate()}
        </div>
      </div>

      <div className="odds-grid">
        <OddsItem
          label="Home Win"
          current={currentOdds.home}
          previous={previousOdds.home}
        />
        {currentOdds.draw !== undefined && (
          <OddsItem
            label="Draw"
            current={currentOdds.draw}
            previous={previousOdds.draw || currentOdds.draw}
          />
        )}
        <OddsItem
          label="Away Win"
          current={currentOdds.away}
          previous={previousOdds.away}
        />
      </div>

      <button
        className="toggle-live-btn"
        onClick={() => {
          setIsLive(!isLive);
          haptic.light();
        }}
      >
        {isLive ? 'Pause Updates' : 'Resume Updates'}
      </button>

      <style jsx>{`
        .live-odds-container {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 16px;
          padding: 20px;
          color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .odds-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .live-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #6b7280;
          transition: all 0.3s ease;
        }

        .live-dot.active {
          background: #ef4444;
          box-shadow: 0 0 12px #ef4444;
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .live-text {
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: 0.5px;
        }

        .last-update {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .odds-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .odds-item {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .odds-item.changed {
          animation: highlight 0.5s ease;
        }

        @keyframes highlight {
          0%, 100% {
            background: rgba(255, 255, 255, 0.05);
          }
          50% {
            background: rgba(255, 255, 255, 0.15);
            transform: scale(1.05);
          }
        }

        .odds-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
          font-weight: 500;
        }

        .odds-value-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .odds-value {
          font-size: 1.75rem;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .odds-value.pulse {
          animation: valuePulse 0.5s ease;
        }

        @keyframes valuePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        .odds-arrow {
          font-size: 1.5rem;
          font-weight: 700;
          animation: slideIn 0.5s ease;
        }

        .odds-arrow.up {
          color: #10b981;
        }

        .odds-arrow.down {
          color: #ef4444;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .odds-diff {
          font-size: 0.75rem;
          margin-top: 4px;
          font-weight: 600;
        }

        .odds-item.up .odds-diff {
          color: #10b981;
        }

        .odds-item.down .odds-diff {
          color: #ef4444;
        }

        .toggle-live-btn {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-live-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .toggle-live-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .live-odds-container {
            padding: 16px;
          }

          .odds-grid {
            gap: 12px;
          }

          .odds-value {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}