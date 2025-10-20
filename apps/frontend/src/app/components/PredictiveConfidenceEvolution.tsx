
"use client";
import React, { useState, useEffect } from 'react';

interface ConfidenceFactor {
  name: string;
  impact: number;
  timestamp: Date;
  description: string;
}

interface ConfidenceSnapshot {
  timestamp: Date;
  confidence: number;
  factors: ConfidenceFactor[];
}

interface ConfidenceEvolution {
  predictionId: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  initialPrediction: string;
  currentPrediction: string;
  timeline: ConfidenceSnapshot[];
  currentConfidence: number;
  initialConfidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  keyEvents: string[];
}

const PredictiveConfidenceEvolution: React.FC = () => {
  const [evolutions, setEvolutions] = useState<ConfidenceEvolution[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [replayTimestamp, setReplayTimestamp] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfidenceEvolutions();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      updateConfidenceScores();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchConfidenceEvolutions = async () => {
    try {
      // Mock data - replace with actual API call
      const mockEvolutions: ConfidenceEvolution[] = [
        {
          predictionId: 'pred_001',
          matchId: 'match_001',
          homeTeam: 'Manchester United',
          awayTeam: 'Liverpool',
          initialPrediction: 'Over 2.5 Goals',
          currentPrediction: 'Over 2.5 Goals',
          timeline: [
            {
              timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
              confidence: 75,
              factors: [
                { name: 'Initial Analysis', impact: 0, timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), description: 'Based on team statistics' }
              ]
            },
            {
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
              confidence: 65,
              factors: [
                { name: 'Injury Report', impact: -10, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), description: 'Key striker ruled out' }
              ]
            },
            {
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
              confidence: 70,
              factors: [
                { name: 'Weather Update', impact: 5, timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), description: 'Favorable conditions expected' }
              ]
            },
            {
              timestamp: new Date(),
              confidence: 72,
              factors: [
                { name: 'Market Movement', impact: 2, timestamp: new Date(), description: 'Betting markets shifting favorably' }
              ]
            }
          ],
          currentConfidence: 72,
          initialConfidence: 75,
          trend: 'increasing',
          keyEvents: ['Star player injured (-10%)', 'Weather improved (+5%)', 'Market shift (+2%)']
        }
      ];

      setEvolutions(mockEvolutions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching confidence evolutions:', error);
      setLoading(false);
    }
  };

  const updateConfidenceScores = async () => {
    // Simulate real-time updates
    setEvolutions(prev => prev.map(evolution => {
      const variance = (Math.random() - 0.5) * 5;
      const newConfidence = Math.max(0, Math.min(100, evolution.currentConfidence + variance));
      
      const newSnapshot: ConfidenceSnapshot = {
        timestamp: new Date(),
        confidence: newConfidence,
        factors: [
          {
            name: 'Live Update',
            impact: variance,
            timestamp: new Date(),
            description: variance > 0 ? 'Positive market signals' : 'Market uncertainty'
          }
        ]
      };

      return {
        ...evolution,
        timeline: [...evolution.timeline, newSnapshot],
        currentConfidence: newConfidence,
        trend: variance > 1 ? 'increasing' : variance < -1 ? 'decreasing' : 'stable'
      };
    }));
  };

  const getReplayConfidence = (evolution: ConfidenceEvolution, timestamp: number): number => {
    const snapshot = evolution.timeline.find((_, index) => index === timestamp);
    return snapshot?.confidence || evolution.initialConfidence;
  };

  const renderConfidenceTimeline = (evolution: ConfidenceEvolution) => {
    const selectedEvolution = evolutions.find(e => e.predictionId === selectedPrediction);
    const displayConfidence = replayTimestamp !== null && selectedEvolution
      ? getReplayConfidence(selectedEvolution, replayTimestamp)
      : evolution.currentConfidence;

    return (
      <div style={{ marginTop: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h4 style={{ color: '#3b82f6', fontSize: '1rem', margin: 0 }}>
            Confidence Evolution Timeline
          </h4>
          <div style={{
            background: evolution.trend === 'increasing' ? 'rgba(34, 197, 94, 0.2)' : 
                       evolution.trend === 'decreasing' ? 'rgba(239, 68, 68, 0.2)' : 
                       'rgba(156, 163, 175, 0.2)',
            border: `1px solid ${evolution.trend === 'increasing' ? 'rgba(34, 197, 94, 0.4)' : 
                                evolution.trend === 'decreasing' ? 'rgba(239, 68, 68, 0.4)' : 
                                'rgba(156, 163, 175, 0.4)'}`,
            padding: '4px 12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: evolution.trend === 'increasing' ? '#22c55e' : 
                   evolution.trend === 'decreasing' ? '#ef4444' : '#9ca3af'
          }}>
            {evolution.trend === 'increasing' ? '📈' : evolution.trend === 'decreasing' ? '📉' : '➡️'} {evolution.trend.toUpperCase()}
          </div>
        </div>

        {/* Confidence Graph */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'end',
            gap: '4px',
            height: '120px',
            marginBottom: '12px'
          }}>
            {evolution.timeline.map((snapshot, index) => {
              const height = (snapshot.confidence / 100) * 100;
              const isActive = replayTimestamp === index;
              
              return (
                <div
                  key={index}
                  onClick={() => setReplayTimestamp(replayTimestamp === index ? null : index)}
                  style={{
                    flex: 1,
                    height: `${height}%`,
                    background: isActive ? '#3b82f6' : 
                               snapshot.confidence > evolution.initialConfidence ? '#22c55e' : 
                               snapshot.confidence < evolution.initialConfidence ? '#ef4444' : '#9ca3af',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    opacity: isActive ? 1 : 0.7
                  }}
                  title={`${snapshot.confidence.toFixed(1)}% at ${snapshot.timestamp.toLocaleString()}`}
                >
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#3b82f6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap'
                    }}>
                      {snapshot.confidence.toFixed(1)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Timeline Labels */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#9ca3af'
          }}>
            <span>{evolution.timeline[0]?.timestamp.toLocaleDateString()}</span>
            <span>Now</span>
          </div>

          {/* Confidence Display */}
          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>
                  {replayTimestamp !== null ? 'Replay Confidence' : 'Current Confidence'}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {displayConfidence.toFixed(1)}%
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>
                  Initial Confidence
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6b7280' }}>
                  {evolution.initialConfidence}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Events */}
        {evolution.keyEvents.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h5 style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '8px' }}>
              📋 Key Confidence Factors
            </h5>
            {evolution.keyEvents.map((event, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  marginBottom: '6px',
                  fontSize: '0.85rem',
                  color: '#fbbf24'
                }}
              >
                {event}
              </div>
            ))}
          </div>
        )}

        {/* Replay Controls */}
        {replayTimestamp !== null && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#60a5fa' }}>
              🔄 Viewing prediction from {evolution.timeline[replayTimestamp]?.timestamp.toLocaleString()}
            </div>
            <button
              onClick={() => setReplayTimestamp(null)}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}
            >
              Exit Replay
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ color: '#9ca3af' }}>Loading confidence evolution data...</div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem'
        }}>
          📊
        </div>
        <h3 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>
          Predictive Confidence Evolution
        </h3>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {evolutions.map(evolution => (
          <div
            key={evolution.predictionId}
            style={{
              background: selectedPrediction === evolution.predictionId 
                ? 'rgba(59, 130, 246, 0.1)' 
                : 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${selectedPrediction === evolution.predictionId ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setSelectedPrediction(
              selectedPrediction === evolution.predictionId ? null : evolution.predictionId
            )}
          >
            {/* Match Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <div>
                <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '600' }}>
                  {evolution.homeTeam} vs {evolution.awayTeam}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>
                  {evolution.currentPrediction}
                </div>
              </div>
              <div style={{
                background: evolution.currentConfidence >= evolution.initialConfidence 
                  ? 'rgba(34, 197, 94, 0.2)' 
                  : 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${evolution.currentConfidence >= evolution.initialConfidence 
                  ? 'rgba(34, 197, 94, 0.4)' 
                  : 'rgba(239, 68, 68, 0.4)'}`,
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: evolution.currentConfidence >= evolution.initialConfidence ? '#22c55e' : '#ef4444'
              }}>
                {evolution.currentConfidence >= evolution.initialConfidence ? '+' : ''}
                {(evolution.currentConfidence - evolution.initialConfidence).toFixed(1)}%
              </div>
            </div>

            {/* Expanded View */}
            {selectedPrediction === evolution.predictionId && renderConfidenceTimeline(evolution)}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: 'rgba(59, 130, 246, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(59, 130, 246, 0.2)'
      }}>
        <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
          💡 <strong>Tip:</strong> Click on timeline bars to replay prediction confidence at different points in time.
          This helps you understand how various factors influenced the prediction over time.
        </div>
      </div>
    </div>
  );
};

export default PredictiveConfidenceEvolution;
