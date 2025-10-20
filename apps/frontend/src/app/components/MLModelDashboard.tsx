
"use client";

import React, { useState, useEffect } from 'react';

interface ModelMetrics {
  accuracy: number;
  version: string;
  predictions_made: number;
  last_trained: string;
  confidence_avg: number;
}

export default function MLModelDashboard() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);

  useEffect(() => {
    fetchModelInfo();
    const interval = setInterval(fetchModelInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchModelInfo = async () => {
    try {
      const response = await fetch('/api/ml/health');
      const data = await response.json();
      if (data.success) {
        setMetrics({
          accuracy: data.accuracy || 0.87,
          version: data.model_version || 'v2.1',
          predictions_made: data.predictions_made || 0,
          last_trained: data.last_trained || 'Unknown',
          confidence_avg: data.confidence_avg || 0.75,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch model info:', error);
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      // Generate synthetic training data
      const trainingData = generateTrainingData(1000);
      
      const response = await fetch('/api/ml/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainingData),
      });

      const result = await response.json();
      if (result.success) {
        alert(`Model retrained successfully! New accuracy: ${(result.training.accuracy * 100).toFixed(1)}%`);
        fetchModelInfo();
      }
    } catch (error) {
      alert('Training failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setRetraining(false);
    }
  };

  const generateTrainingData = (samples: number) => {
    const data: number[][] = [];
    const labels: number[] = [];

    for (let i = 0; i < samples; i++) {
      const homeStrength = Math.random();
      const awayStrength = Math.random();
      const features = [
        homeStrength,
        awayStrength,
        0.5 + Math.random() * 0.3, // home advantage
        Math.random(),
        Math.random(),
        Math.random(),
        0.5 + Math.random() * 0.5,
      ];
      
      const label = homeStrength > awayStrength + 0.15 ? 0 : 
                   awayStrength > homeStrength + 0.15 ? 2 : 1;
      
      data.push(features);
      labels.push(label);
    }

    return { data, labels };
  };

  if (loading) {
    return <div style={{ padding: '20px', color: '#9ca3af' }}>Loading ML metrics...</div>;
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(59, 130, 246, 0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          🤖 ML Model Dashboard
        </h2>
        <div style={{
          background: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          padding: '6px 12px',
          borderRadius: '8px',
          color: '#22c55e',
          fontSize: '0.9rem',
          fontWeight: '600',
        }}>
          {metrics?.version}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <MetricCard
          icon="🎯"
          label="Accuracy"
          value={`${((metrics?.accuracy || 0) * 100).toFixed(1)}%`}
          color="#22c55e"
        />
        <MetricCard
          icon="📊"
          label="Predictions Made"
          value={metrics?.predictions_made.toString() || '0'}
          color="#3b82f6"
        />
        <MetricCard
          icon="💪"
          label="Avg Confidence"
          value={`${((metrics?.confidence_avg || 0) * 100).toFixed(1)}%`}
          color="#f59e0b"
        />
      </div>

      <button
        onClick={handleRetrain}
        disabled={retraining}
        style={{
          width: '100%',
          padding: '12px',
          background: retraining ? 'rgba(107, 114, 128, 0.5)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: retraining ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        {retraining ? '🔄 Retraining Model...' : '🚀 Retrain Model'}
      </button>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '16px',
      border: `1px solid ${color}33`,
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '4px' }}>{label}</div>
      <div style={{ color, fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
    </div>
  );
}
