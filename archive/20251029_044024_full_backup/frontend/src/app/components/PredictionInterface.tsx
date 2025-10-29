
"use client";

import React, { useState } from 'react';

export const PredictionInterface: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  const [prediction, setPrediction] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(50);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMatch || !prediction) {
      alert('Please select a match and make a prediction');
      return;
    }

    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedMatch, prediction, confidence })
      });

      if (response.ok) {
        alert('Prediction submitted successfully!');
        setSelectedMatch('');
        setPrediction('');
        setConfidence(50);
      }
    } catch (error) {
      console.error('Error submitting prediction:', error);
      alert('Failed to submit prediction');
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
        🎯 Make Your Prediction
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
            Select Match
          </label>
          <select
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              fontSize: '14px'
            }}
          >
            <option value="">Choose a match...</option>
            <option value="match1">Team A vs Team B</option>
            <option value="match2">Team C vs Team D</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
            Your Prediction
          </label>
          <input
            type="text"
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            placeholder="e.g., Team A to win 2-1"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
            Confidence: {confidence}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Submit Prediction
        </button>
      </form>
    </div>
  );
};
