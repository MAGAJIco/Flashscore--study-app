
'use client';

import React, { useState, useEffect } from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';

interface Source {
  prediction: string;
  confidence: number;
  odds?: number;
  probabilities?: any;
}

interface AggregatedPrediction {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  sources: {
    ml?: Source;
    scraper?: Source;
    database?: Source;
  };
  consensus?: {
    prediction: string;
    averageConfidence: number;
    agreement: number;
  };
  matchDate?: string;
  league?: string;
}

export function MultiSourcePredictions() {
  const [predictions, setPredictions] = useState<AggregatedPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<'all' | 'ml' | 'scraper' | 'database'>('all');

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';
      const response = await fetch(`${BACKEND_URL}/api/predictions/multi-source?limit=50`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch multi-source predictions');
      }

      const data = await response.json();
      setPredictions(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError('Failed to load predictions from all sources');
    } finally {
      setLoading(false);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'ml': return '🤖';
      case 'scraper': return '🌐';
      case 'database': return '💾';
      default: return '📊';
    }
  };

  const getAgreementColor = (agreement: number) => {
    if (agreement >= 100) return '#00ff88';
    if (agreement >= 67) return '#feca57';
    return '#ff6b6b';
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        background: 'rgba(255, 107, 107, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 107, 107, 0.3)',
        color: '#ff6b6b',
        textAlign: 'center'
      }}>
        {error}
        <button
          onClick={fetchPredictions}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: 'white', fontSize: '1.8rem', margin: 0 }}>
          🎯 Multi-Source Predictions
        </h2>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'ml', 'scraper', 'database'].map(source => (
            <button
              key={source}
              onClick={() => setSelectedSource(source as any)}
              style={{
                padding: '8px 16px',
                background: selectedSource === source 
                  ? 'linear-gradient(135deg, #00ff88, #00d4ff)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: selectedSource === source ? '#000' : '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}
            >
              {getSourceIcon(source)} {source}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {predictions.map((pred) => (
          <div
            key={pred.matchId}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '20px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 255, 136, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Match Header */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '5px'
              }}>
                {pred.homeTeam} vs {pred.awayTeam}
              </div>
              {pred.league && (
                <div style={{ fontSize: '0.9rem', color: '#888' }}>
                  {pred.league}
                </div>
              )}
            </div>

            {/* Consensus */}
            {pred.consensus && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 212, 255, 0.1))',
                padding: '12px',
                borderRadius: '12px',
                marginBottom: '15px',
                border: '1px solid rgba(0, 255, 136, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                    Consensus: {pred.consensus.prediction}
                  </span>
                  <span style={{
                    color: getAgreementColor(pred.consensus.agreement),
                    fontWeight: 'bold'
                  }}>
                    {pred.consensus.agreement}% agree
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${pred.consensus.averageConfidence}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
                    transition: 'width 0.5s'
                  }} />
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#888',
                  marginTop: '4px'
                }}>
                  {pred.consensus.averageConfidence}% average confidence
                </div>
              </div>
            )}

            {/* Individual Sources */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(pred.sources).map(([source, data]) => {
                if (!data || (selectedSource !== 'all' && selectedSource !== source)) {
                  return null;
                }

                return (
                  <div
                    key={source}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '5px'
                    }}>
                      <span style={{
                        fontSize: '0.9rem',
                        color: '#00d4ff',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {getSourceIcon(source)} {source}
                      </span>
                      <span style={{
                        fontSize: '0.9rem',
                        color: data.confidence >= 70 ? '#00ff88' : '#feca57'
                      }}>
                        {data.confidence}%
                      </span>
                    </div>
                    <div style={{ fontSize: '0.95rem', color: 'white' }}>
                      {data.prediction}
                    </div>
                    {data.odds && (
                      <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                        Odds: {data.odds}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {predictions.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#888',
          fontSize: '1.1rem'
        }}>
          No predictions available from any source
        </div>
      )}
    </div>
  );
}
