
"use client";
import React, { useState } from 'react';

const PreviewManager: React.FC = () => {
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const previewItems = [
    { id: '1', title: 'NBA Predictions', type: 'predictions' },
    { id: '2', title: 'Live Matches', type: 'matches' },
    { id: '3', title: 'User Analytics', type: 'analytics' }
  ];

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem'
        }}>
          👁️
        </div>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          margin: 0,
          color: 'white'
        }}>
          Preview Manager
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {previewItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePreview(activePreview === item.id ? null : item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              background: activePreview === item.id ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: `1px solid ${activePreview === item.id ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`
            }}
          >
            <span style={{ color: 'white', fontWeight: '500' }}>
              {item.title}
            </span>
            <span style={{
              color: activePreview === item.id ? '#22c55e' : '#9ca3af',
              fontSize: '1.2rem'
            }}>
              {activePreview === item.id ? '✓' : '▶'}
            </span>
          </div>
        ))}
      </div>

      {activePreview && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <p style={{ color: '#22c55e', fontWeight: '500', margin: 0 }}>
            Preview for: {previewItems.find(item => item.id === activePreview)?.title}
          </p>
        </div>
      )}
    </div>
  );
};

export default PreviewManager;
