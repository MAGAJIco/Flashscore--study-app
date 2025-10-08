
"use client";

import React from 'react';
import CrossPlatformSync from '../components/CrossPlatformSync';
import SmartNotifications from '../components/SmartNotifications';
import LanguageSettings from '../components/LanguageSettings';

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

        {/* Language Settings Section */}
        <div style={{ marginBottom: '24px' }}>
          <LanguageSettings />
        </div>

        {/* Notification Settings Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            color: '#fff',
            fontSize: '1.5rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span>🔔</span>
            Notification Preferences
          </h2>
          <p style={{
            color: '#9ca3af',
            fontSize: '0.95rem',
            marginBottom: '20px'
          }}>
            Customize how and when you receive alerts about matches, predictions, and achievements
          </p>
          <SmartNotifications />
        </div>

        <CrossPlatformSync />
      </div>
    </div>
  );
}
