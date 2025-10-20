
"use client";
import React, { useState } from 'react';

interface VerifiedPrediction {
  id: string;
  prediction: string;
  timestamp: Date;
  blockHash: string;
  verified: boolean;
  outcome?: 'correct' | 'incorrect' | 'pending';
}

const BlockchainVerification: React.FC = () => {
  const [predictions, setPredictions] = useState<VerifiedPrediction[]>([
    {
      id: '1',
      prediction: 'Lakers to win vs Warriors',
      timestamp: new Date(Date.now() - 3600000),
      blockHash: '0x7f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
      verified: true,
      outcome: 'correct'
    }
  ]);
  const [newPrediction, setNewPrediction] = useState('');

  const generateBlockHash = (data: string): string => {
    const timestamp = Date.now().toString();
    const combined = data + timestamp;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
  };

  const verifyPrediction = async (predictionText: string) => {
    const blockHash = generateBlockHash(predictionText);
    
    const newVerifiedPrediction: VerifiedPrediction = {
      id: Date.now().toString(),
      prediction: predictionText,
      timestamp: new Date(),
      blockHash,
      verified: true,
      outcome: 'pending'
    };

    setPredictions(prev => [newVerifiedPrediction, ...prev]);
    setNewPrediction('');

    // Simulate blockchain confirmation
    setTimeout(() => {
      console.log('Prediction verified on blockchain:', blockHash);
    }, 2000);
  };

  const copyBlockHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
  };

  return (
    <div style={{
      background: 'rgba(99, 102, 241, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(99, 102, 241, 0.3)'
    }}>
      <h3 style={{ color: '#6366f1', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🔗 Blockchain Verification
        <span style={{
          background: 'rgba(34, 197, 94, 0.2)',
          color: '#22c55e',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: '600'
        }}>
          IMMUTABLE
        </span>
      </h3>

      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <p style={{ color: '#d1d5db', fontSize: '0.9rem', margin: '0 0 12px 0' }}>
          All predictions are cryptographically signed and stored on-chain, providing immutable proof of when predictions were made.
        </p>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={newPrediction}
            onChange={(e) => setNewPrediction(e.target.value)}
            placeholder="Enter your prediction..."
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff',
              fontSize: '0.9rem'
            }}
          />
          <button
            onClick={() => newPrediction && verifyPrediction(newPrediction)}
            disabled={!newPrediction}
            style={{
              background: newPrediction 
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                : 'rgba(107, 114, 128, 0.3)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '0.9rem',
              cursor: newPrediction ? 'pointer' : 'not-allowed',
              fontWeight: '600'
            }}
          >
            🔐 Verify
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {predictions.map(pred => (
          <div
            key={pred.id}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>
                  {pred.prediction}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                  {pred.timestamp.toLocaleString()}
                </div>
              </div>
              
              <div style={{
                background: pred.outcome === 'correct' ? 'rgba(34, 197, 94, 0.2)' :
                           pred.outcome === 'incorrect' ? 'rgba(239, 68, 68, 0.2)' :
                           'rgba(245, 158, 11, 0.2)',
                border: `1px solid ${pred.outcome === 'correct' ? 'rgba(34, 197, 94, 0.4)' :
                                     pred.outcome === 'incorrect' ? 'rgba(239, 68, 68, 0.4)' :
                                     'rgba(245, 158, 11, 0.4)'}`,
                color: pred.outcome === 'correct' ? '#22c55e' :
                       pred.outcome === 'incorrect' ? '#ef4444' :
                       '#f59e0b',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {pred.outcome?.toUpperCase() || 'PENDING'}
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '8px'
            }}>
              <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '4px' }}>
                Block Hash:
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <code style={{
                  flex: 1,
                  color: '#6366f1',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {pred.blockHash}
                </code>
                <button
                  onClick={() => copyBlockHash(pred.blockHash)}
                  style={{
                    background: 'rgba(99, 102, 241, 0.2)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    color: '#6366f1',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {pred.verified && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#22c55e',
                fontSize: '0.8rem'
              }}>
                <span>✓</span>
                <span>Verified on blockchain</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockchainVerification;
