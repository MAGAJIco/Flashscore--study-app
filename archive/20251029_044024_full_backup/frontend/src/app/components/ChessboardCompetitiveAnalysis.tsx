"use client";

import React, { useState, useEffect } from 'react';

interface CompetitorPiece {
  name: string;
  position: string;
  strength: number;
  marketShare: number;
  weaknesses: string[];
  ourAdvantage: string;
}

interface ChessPosition {
  piece: string;
  advantage: 'strong' | 'moderate' | 'developing';
  description: string;
}

export function ChessboardCompetitiveAnalysis() {
  const [gamePhase, setGamePhase] = useState<'opening' | 'middlegame' | 'endgame'>('opening');
  const [ourPosition, setOurPosition] = useState<number>(72);

  const competitors: CompetitorPiece[] = [
    {
      name: 'Traditional Betting Sites',
      position: 'Rook (powerful but predictable)',
      strength: 85,
      marketShare: 45,
      weaknesses: ['No AI predictions', 'Poor mobile UX', 'High fees'],
      ourAdvantage: 'AI-powered ML predictions with 87% accuracy'
    },
    {
      name: 'Sports Analytics Apps',
      position: 'Bishop (specialized diagonal attack)',
      strength: 70,
      marketShare: 25,
      weaknesses: ['Data-heavy, slow', 'No real-time updates', 'Desktop-focused'],
      ourAdvantage: 'Real-time ML predictions + mobile-first PWA'
    },
    {
      name: 'Social Prediction Platforms',
      position: 'Knight (unpredictable movement)',
      strength: 65,
      marketShare: 20,
      weaknesses: ['No ML backing', 'Community bias', 'Accuracy issues'],
      ourAdvantage: 'Hybrid AI + community predictions'
    },
    {
      name: 'Fantasy Sports Apps',
      position: 'Pawn (numerous but limited)',
      strength: 55,
      marketShare: 10,
      weaknesses: ['Complex setup', 'Seasonal only', 'High barrier to entry'],
      ourAdvantage: 'Instant predictions, any sport, any time'
    }
  ];

  const ourChessPosition: ChessPosition[] = [
    {
      piece: '♕ Queen (MagajiCo AI)',
      advantage: 'strong',
      description: '87% ML accuracy - Most powerful piece on the board'
    },
    {
      piece: '♖ Rook (PWA Technology)',
      advantage: 'strong',
      description: 'Works offline, installs like native app, cross-platform'
    },
    {
      piece: '♗ Bishop (Real-time Updates)',
      advantage: 'moderate',
      description: 'Live match tracking with WebSocket integration'
    },
    {
      piece: '♘ Knight (Kids Mode)',
      advantage: 'developing',
      description: 'Unique COPPA-compliant educational approach'
    },
    {
      piece: '♙ Pawns (Features)',
      advantage: 'strong',
      description: 'Collaborative predictions, marketplace, social sharing'
    }
  ];

  const calculateWinProbability = () => {
    const ourStrength = ourPosition;
    const avgCompetitorStrength = competitors.reduce((acc, c) => acc + c.strength, 0) / competitors.length;
    return ((ourStrength / (ourStrength + avgCompetitorStrength)) * 100).toFixed(1);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, marginBottom: '8px' }}>
            ♟️ Chess Board Analysis
          </h2>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            Your competitive position in the sports prediction market
          </p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          padding: '16px 24px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {calculateWinProbability()}%
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
            Win Probability
          </div>
        </div>
      </div>

      {/* Chess Board Visual */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h3 style={{ color: '#60a5fa', marginBottom: '16px' }}>🎯 Our Position</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          {ourChessPosition.map((pos, idx) => (
            <div
              key={idx}
              style={{
                background: pos.advantage === 'strong' 
                  ? 'rgba(34, 197, 94, 0.1)'
                  : pos.advantage === 'moderate'
                  ? 'rgba(251, 191, 36, 0.1)'
                  : 'rgba(59, 130, 246, 0.1)',
                border: `1px solid ${
                  pos.advantage === 'strong' 
                    ? 'rgba(34, 197, 94, 0.3)'
                    : pos.advantage === 'moderate'
                    ? 'rgba(251, 191, 36, 0.3)'
                    : 'rgba(59, 130, 246, 0.3)'
                }`,
                padding: '12px',
                borderRadius: '8px'
              }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px' }}>
                {pos.piece}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                {pos.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitor Analysis */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h3 style={{ color: '#f87171', marginBottom: '16px' }}>⚔️ Opponent Pieces</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {competitors.map((comp, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '16px',
                borderRadius: '8px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '16px',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{comp.name}</div>
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem'
                  }}>
                    {comp.position}
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
                  <strong>Their weaknesses:</strong> {comp.weaknesses.join(', ')}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#22c55e' }}>
                  <strong>✓ Our advantage:</strong> {comp.ourAdvantage}
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: `conic-gradient(#ef4444 ${comp.strength * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {comp.strength}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {comp.marketShare}% market
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}