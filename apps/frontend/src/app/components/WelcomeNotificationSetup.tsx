"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '../utils/clientStorage';

interface WelcomeNotificationSetupProps {
  onComplete: (enabled: boolean) => void;
}

const WelcomeNotificationSetup: React.FC<WelcomeNotificationSetupProps> = ({ onComplete }) => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if this is the first time the user is using the app
    const hasSeenWelcome = ClientStorage.getItem('notification_welcome_seen', false);
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      const enabled = permission === 'granted';

      // Mark welcome as seen
      ClientStorage.setItem('notification_welcome_seen', true);
      setShowWelcome(false);
      onComplete(enabled);
    }
  };

  const handleSkip = () => {
    ClientStorage.setItem('notification_welcome_seen', true);
    setShowWelcome(false);
    onComplete(false);
  };

  if (!showWelcome) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onComplete(false);
        }
      }}
    >
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '400px',
        width: '90%',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        touchAction: 'manipulation'
      }}>
        <button
          onClick={() => onComplete(false)}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
          title="Close"
        >
          ✕
        </button>

        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔔</div>

        <h2 style={{
          margin: '0 0 16px 0',
          background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Stay Updated!
        </h2>

        <p style={{
          margin: '0 0 24px 0',
          color: '#d1fae5',
          lineHeight: '1.5',
          fontSize: '0.95rem'
        }}>
          Get notified about match updates, achievements, and important sports news.
          You can customize your notification preferences anytime.
        </p>

        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#d1fae5' }}>
            ✅ Match score updates<br/>
            🏆 Achievement unlocks<br/>
            📱 Smart reminders<br/>
            🔕 Quiet hours support
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button
            onClick={handleEnableNotifications}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              padding: '14px 24px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔔 Enable Notifications
          </button>

          <button
            onClick={handleSkip}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#9ca3af',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Maybe Later
          </button>
        </div>

        <p style={{
          fontSize: '0.75rem',
          color: '#6b7280',
          marginTop: '16px',
          margin: '16px 0 0 0'
        }}>
          You can change these settings anytime in the notification panel
        </p>
      </div>
    </div>
  );
};

export { WelcomeNotificationSetup };