import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Prediction {
  id?: string;
  title?: string;
  match?: string;
  prediction?: string;
  content?: string;
  confidence?: number | string;
  status?: 'pending' | 'won' | 'lost' | 'active' | 'completed';
  sport?: string;
  source?: string;
}

interface PredictionsTableProps {
  predictions: Prediction[];
}

const PredictionsTable: React.FC<PredictionsTableProps> = ({ predictions }) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '2rem',
        margin: '0 0 30px 0',
        background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🔮 Sports Predictions
      </h2>

      {predictions.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#ccc', padding: '40px' }}>
          <h3>No predictions available</h3>
          <p>Check back later for expert sports predictions!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {predictions.map((prediction, index) => {
            const predictionId = prediction.id || `pred-${index}`;
            const match = prediction.match || prediction.title || 'Unknown Match';
            const predictionText = prediction.prediction || prediction.content || 'No prediction available';
            const confidence = typeof prediction.confidence === 'string'
              ? prediction.confidence
              : `${prediction.confidence || 0}%`;
            const status = prediction.status || 'pending';

            return (
              <div
                key={predictionId}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ color: '#22c55e', margin: '0 0 8px 0' }}>
                      {match}
                    </h3>
                    <p style={{ color: '#d1fae5', margin: '0 0 8px 0' }}>
                      {predictionText}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ color: '#06b6d4' }}>
                        Confidence: {confidence}
                      </span>
                      {prediction.sport && (
                        <span style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
                          {prediction.sport}
                        </span>
                      )}
                      <span
                        style={{
                          background: status === 'won' || status === 'completed' ? '#22c55e' :
                                    status === 'lost' ? '#ef4444' : '#f59e0b',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}
                      >
                        {status}
                      </span>
                      {prediction.source && (
                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                          {prediction.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PredictionsTable;
"use client";

import React from 'react';

interface Prediction {
  id: string;
  match: string;
  prediction: string;
  confidence: number;
  status: string;
}

export default function PredictionsTable() {
  const [predictions] = React.useState<Prediction[]>([
    {
      id: '1',
      match: 'Manchester United vs Liverpool',
      prediction: 'Over 2.5 Goals',
      confidence: 85,
      status: 'Active'
    },
    {
      id: '2',
      match: 'Barcelona vs Real Madrid',
      prediction: 'Both Teams To Score',
      confidence: 78,
      status: 'Completed'
    }
  ]);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Latest Predictions</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left py-2">Match</th>
              <th className="text-left py-2">Prediction</th>
              <th className="text-left py-2">Confidence</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((prediction) => (
              <tr key={prediction.id} className="border-b border-gray-700">
                <td className="py-3">{prediction.match}</td>
                <td className="py-3">{prediction.prediction}</td>
                <td className="py-3">{prediction.confidence}%</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    prediction.status === 'Active' ? 'bg-green-600' : 'bg-gray-600'
                  }`}>
                    {prediction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
