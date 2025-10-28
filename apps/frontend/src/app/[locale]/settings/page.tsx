"use client";

import React from 'react';
import { CrossPlatformSync } from '@/app/components/CrossPlatformSync';
import { SmartNotifications } from '@/app/components/SmartNotifications';
import { LanguageSettings } from '@/app/components/LanguageSettings';
import TimeZoneSettings from '@/app/components/TimeZoneSettings';
import { SmartNewsFeed } from '@/app/components/SmartNewsFeed';

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
        {/* Navigation Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
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
            }}>
              Manage your account preferences and cross-platform sync
            </p>
          </div>
          
          {/* Quick Links */}
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <a
              href="/"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '10px 20px',
                borderRadius: '12px',
                color: '#9ca3af',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              <span>🏠</span>
              <span>Portal</span>
            </a>
            <a
              href="/management"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '10px 20px',
                borderRadius: '12px',
                color: '#3b82f6',
                textDecoration: 'none',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
              }}
            >
              <span>🎛️</span>
              <span>Management</span>
            </a>
          </div>
        </div>

        {/* Language Settings Section */}
        <div style={{ marginBottom: '24px' }}>
          <LanguageSettings />

        <TimeZoneSettings />
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

        {/* Smart News Feed Section */}
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
            <span>📰</span>
            Personalized News Feed
          </h2>
          <p style={{
            color: '#9ca3af',
            fontSize: '0.95rem',
            marginBottom: '20px'
          }}>
            Customize your news preferences and stay updated with sports content that matters to you
          </p>
          <SmartNewsFeed />
        </div>

        <CrossPlatformSync />
      </div>
    </div>
  );
}

