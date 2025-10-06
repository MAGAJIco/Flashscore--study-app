
"use client";

import React from 'react';
import CrossPlatformSync from '../components/CrossPlatformSync';

export default function SettingsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          color: '#fff',
          fontSize: '2.5rem',
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Settings
        </h1>
        <p style={{
          color: '#9ca3af',
          fontSize: '1.1rem',
          marginBottom: '30px'
        }}>
          Manage your account preferences and cross-platform sync
        </p>

        <CrossPlatformSync />
      </div>
    </div>
  );
}
