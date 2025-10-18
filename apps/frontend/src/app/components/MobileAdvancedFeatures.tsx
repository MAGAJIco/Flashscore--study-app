
"use client";
import React, { useState, useEffect } from 'react';

const MobileAdvancedFeatures: React.FC = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [swipeGestures, setSwipeGestures] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [voiceCommands, setVoiceCommands] = useState(false);

  useEffect(() => {
    // PWA install prompt detection
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const triggerHaptic = () => {
    if (navigator.vibrate && hapticFeedback) {
      navigator.vibrate([50]);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(168, 85, 247, 0.1))',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(236, 72, 153, 0.3)',
      margin: '20px 0'
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '2rem',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #C8102E, #F6EB61)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🏆 Liverpool Mobile Hub
      </h2>

      {/* PWA Installation */}
      {isInstallable && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <h3 style={{ color: '#22c55e', marginBottom: '12px' }}>
            📲 Install Sports Central App
          </h3>
          <p style={{ color: '#86efac', marginBottom: '16px' }}>
            Get the full native app experience with offline support, push notifications, and more!
          </p>
          <button
            onClick={handleInstallApp}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            🚀 Install Now
          </button>
        </div>
      )}

      {/* Gesture Controls */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#ec4899', marginBottom: '16px' }}>
          🤏 Smart Gestures
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px'
          }}>
            <span style={{ color: '#fff' }}>👈 Swipe Navigation</span>
            <button
              onClick={() => setSwipeGestures(!swipeGestures)}
              style={{
                width: '40px',
                height: '20px',
                borderRadius: '10px',
                border: 'none',
                background: swipeGestures ? '#22c55e' : '#6b7280',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '2px',
                left: swipeGestures ? '22px' : '2px',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px'
          }}>
            <span style={{ color: '#fff' }}>📳 Haptic Feedback</span>
            <button
              onClick={() => {
                setHapticFeedback(!hapticFeedback);
                triggerHaptic();
              }}
              style={{
                width: '40px',
                height: '20px',
                borderRadius: '10px',
                border: 'none',
                background: hapticFeedback ? '#22c55e' : '#6b7280',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '2px',
                left: hapticFeedback ? '22px' : '2px',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px'
          }}>
            <span style={{ color: '#fff' }}>🎤 Voice Commands</span>
            <button
              onClick={() => setVoiceCommands(!voiceCommands)}
              style={{
                width: '40px',
                height: '20px',
                borderRadius: '10px',
                border: 'none',
                background: voiceCommands ? '#22c55e' : '#6b7280',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '2px',
                left: voiceCommands ? '22px' : '2px',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#a855f7', marginBottom: '16px' }}>
          ⚡ Quick Actions
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          {[
            { icon: '🎯', label: 'Quick Predict', color: '#C8102E' },
            { icon: '🧠', label: 'Flash Quiz', color: '#F6EB61' },
            { icon: '📊', label: 'Live Scores', color: '#C8102E' },
            { icon: '💰', label: 'Pi Wallet', color: '#F6EB61' }
          ].map(action => (
            <button
              key={action.label}
              onClick={triggerHaptic}
              style={{
                background: `${action.color}20`,
                border: `1px solid ${action.color}40`,
                borderRadius: '12px',
                padding: '16px',
                color: action.color,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'transform 0.2s ease'
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                {action.icon}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                {action.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <div style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={triggerHaptic}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C8102E, #a00d26)',
            border: '2px solid #F6EB61',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(200, 16, 46, 0.6)',
            transition: 'transform 0.2s ease'
          }}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = 'scale(0.9)';
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ⚡
        </button>
      </div>

      {/* Voice Command Hint */}
      {voiceCommands && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎤</div>
          <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>Voice Commands Active</div>
          <div style={{ color: '#93c5fd', fontSize: '0.9rem' }}>
            Try: "Show NBA predictions" or "Open my wallet"
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAdvancedFeatures;
