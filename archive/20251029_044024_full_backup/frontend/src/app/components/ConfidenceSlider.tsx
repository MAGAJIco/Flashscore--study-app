"use client";

import { useState, useEffect } from 'react';
import { haptic } from '@/app/components/HapticFeedback';

interface ConfidenceFactor {
  name: string;
  impact: number;
  description: string;
}

interface ConfidenceSliderProps {
  baseConfidence: number;
  factors: ConfidenceFactor[];
  onConfidenceChange?: (newConfidence: number) => void;
  showFactors?: boolean;
}

export function ConfidenceSlider({
  baseConfidence,
  factors = [],
  onConfidenceChange,
  showFactors = true
}: ConfidenceSliderProps) {
  const [userAdjustment, setUserAdjustment] = useState(0);
  const [adjustedConfidence, setAdjustedConfidence] = useState(baseConfidence);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setUserAdjustment(0);
  }, [baseConfidence]);

  useEffect(() => {
    const totalImpact = factors.reduce((sum, factor) => sum + factor.impact, 0);
    const newConfidence = Math.max(0, Math.min(100, baseConfidence + totalImpact + userAdjustment));
    setAdjustedConfidence(newConfidence);
    onConfidenceChange?.(newConfidence);
  }, [baseConfidence, factors, userAdjustment, onConfidenceChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setUserAdjustment(value);
    haptic.confidenceAdjust();
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return '#10b981';
    if (confidence >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'Very High';
    if (confidence >= 60) return 'High';
    if (confidence >= 40) return 'Medium';
    if (confidence >= 20) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="confidence-slider-container">
      <div className="confidence-header">
        <h3>Prediction Confidence</h3>
        <div
          className="confidence-badge"
          style={{ backgroundColor: getConfidenceColor(adjustedConfidence) }}
        >
          {Math.round(adjustedConfidence)}%
        </div>
      </div>

      <div className="confidence-visual">
        <div className="confidence-bar-bg">
          <div
            className={`confidence-bar-fill ${isDragging ? 'dragging' : ''}`}
            style={{
              width: `${adjustedConfidence}%`,
              backgroundColor: getConfidenceColor(adjustedConfidence),
              transition: isDragging ? 'none' : 'all 0.3s ease'
            }}
          >
            <div className="confidence-glow" />
          </div>
        </div>

        <div className="confidence-labels">
          <span>0%</span>
          <span className="confidence-level">{getConfidenceLabel(adjustedConfidence)}</span>
          <span>100%</span>
        </div>
      </div>

      <div className="user-adjustment">
        <label htmlFor="confidence-adjuster">
          Manual Adjustment: {userAdjustment > 0 ? '+' : ''}{userAdjustment}%
        </label>
        <input
          id="confidence-adjuster"
          type="range"
          min="-20"
          max="20"
          value={userAdjustment}
          onChange={handleSliderChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="confidence-adjuster-slider"
        />
      </div>

      {showFactors && factors.length > 0 && (
        <div className="confidence-factors">
          <h4>Influencing Factors</h4>
          <div className="factors-list">
            {factors.map((factor, index) => (
              <div
                key={index}
                className="factor-item"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="factor-header">
                  <span className="factor-name">{factor.name}</span>
                  <span
                    className={`factor-impact ${factor.impact >= 0 ? 'positive' : 'negative'}`}
                  >
                    {factor.impact > 0 ? '+' : ''}{factor.impact}%
                  </span>
                </div>
                <p className="factor-description">{factor.description}</p>
                <div className="factor-bar">
                  <div
                    className="factor-bar-fill"
                    style={{
                      width: `${Math.abs(factor.impact) * 2}%`,
                      backgroundColor: factor.impact >= 0 ? '#10b981' : '#ef4444'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .confidence-slider-container {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .confidence-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .confidence-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .confidence-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .confidence-visual {
          margin-bottom: 24px;
        }

        .confidence-bar-bg {
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          margin-bottom: 12px;
        }

        .confidence-bar-fill {
          height: 100%;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .confidence-bar-fill.dragging {
          transform: scale(1.02);
        }

        .confidence-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .confidence-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .confidence-level {
          font-weight: 600;
          color: white;
        }

        .user-adjustment {
          margin-bottom: 20px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .user-adjustment label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 12px;
          color: rgba(255, 255, 255, 0.9);
        }

        .confidence-adjuster-slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          -webkit-appearance: none;
          appearance: none;
          cursor: pointer;
        }

        .confidence-adjuster-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: grab;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
          transition: transform 0.2s ease;
        }

        .confidence-adjuster-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.2);
        }

        .confidence-adjuster-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: grab;
          border: none;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
          transition: transform 0.2s ease;
        }

        .confidence-adjuster-slider::-moz-range-thumb:active {
          cursor: grabbing;
          transform: scale(1.2);
        }

        .confidence-factors {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 20px;
        }

        .confidence-factors h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 16px 0;
        }

        .factors-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .factor-item {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 12px;
          animation: slideIn 0.5s ease-out both;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .factor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .factor-name {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .factor-impact {
          font-weight: 700;
          font-size: 0.9rem;
          padding: 4px 8px;
          border-radius: 8px;
        }

        .factor-impact.positive {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .factor-impact.negative {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .factor-description {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 8px 0;
        }

        .factor-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .factor-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        @media (max-width: 640px) {
          .confidence-slider-container {
            padding: 16px;
          }

          .confidence-header h3 {
            font-size: 1.1rem;
          }

          .confidence-badge {
            font-size: 1rem;
            padding: 6px 12px;
          }
        }
      `}</style>
    </div>
  );
}