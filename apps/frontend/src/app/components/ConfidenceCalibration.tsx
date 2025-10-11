
"use client";

import React, { useState } from 'react';

export default function ConfidenceCalibration() {
  const [features, setFeatures] = useState<number[]>([0.7, 0.65, 0.6, 0.75, 0.7, 0.5, 0.8]);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const featureLabels = [
    'Home Strength',
    'Away Strength',
    'Home Advantage',
    'Home Form',
    'Away Form',
    'Head-to-Head',
    'Injury Factor'
  ];

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ml/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
      });

      const result = await response.json();
      setPrediction(result.prediction);
    } catch (error) {
      alert('Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '20px' }}>
        🎯 Prediction Tester
      </h3>

      <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
        {features.map((value, index) => (
          <div key={index}>
            <label style={{ color: '#9ca3af', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>
              {featureLabels[index]}: {value.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={value}
              onChange={(e) => {
                const newFeatures = [...features];
                newFeatures[index] = parseFloat(e.target.value);
                setFeatures(newFeatures);
              }}
              style={{ width: '100%' }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handlePredict}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '16px',
        }}
      >
        {loading ? 'Predicting...' : 'Get Prediction'}
      </button>

      {prediction && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <div style={{ color: '#3b82f6', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '12px' }}>
            Prediction: {prediction.prediction?.toUpperCase() || 'N/A'}
          </div>
          <div style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '8px' }}>
            Confidence: {((prediction.confidence || 0) * 100).toFixed(1)}%
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <ProbBar label="Home" value={prediction.probabilities?.home || 0} color="#22c55e" />
            <ProbBar label="Draw" value={prediction.probabilities?.draw || 0} color="#9ca3af" />
            <ProbBar label="Away" value={prediction.probabilities?.away || 0} color="#ef4444" />
          </div>
        </div>
      )}
    </div>
  );
}

function ProbBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '4px' }}>{label}</div>
      <div style={{
        height: '40px',
        background: `${color}33`,
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${color}`,
      }}>
        <span style={{ color, fontWeight: 'bold', fontSize: '0.9rem' }}>
          {(value * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
