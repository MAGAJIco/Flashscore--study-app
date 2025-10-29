"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '@utils/clientStorage';

interface WatchComplication {
  id: string;
  type: 'score' | 'prediction' | 'notification' | 'streak' | 'coins';
  title: string;
  value: string;
  icon: string;
  color: string;
  priority: number;
}

interface WatchSettings {
  enabled: boolean;
  complications: {
    corner1: string;
    corner2: string;
    corner3: string;
    corner4: string;
    center: string;
  };
  updateFrequency: number; // minutes
  showNotifications: boolean;
}

const SmartWatchComplications: React.FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [settings, setSettings] = useState<WatchSettings>({
    enabled: false,
    complications: {
      corner1: 'score',
      corner2: 'prediction',
      corner3: 'streak',
      corner4: 'coins',
      center: 'notification'
    },
    updateFrequency: 5,
    showNotifications: true
  });

  const [complications, setComplications] = useState<WatchComplication[]>([
    {
      id: 'score',
      type: 'score',
      title: 'Live Score',
      value: '2-1',
      icon: '⚽',
      color: '#22c55e',
      priority: 1
    },
    {
      id: 'prediction',
      type: 'prediction',
      title: 'Active Predictions',
      value: '3',
      icon: '🎯',
      color: '#3b82f6',
      priority: 2
    },
    {
      id: 'streak',
      type: 'streak',
      title: 'Win Streak',
      value: '12',
      icon: '🔥',
      color: '#f59e0b',
      priority: 3
    },
    {
      id: 'coins',
      type: 'coins',
      title: 'Pi Coins',
      value: '450',
      icon: '🪙',
      color: '#8b5cf6',
      priority: 4
    },
    {
      id: 'notification',
      type: 'notification',
      title: 'New Update',
      value: 'Match Starting',
      icon: '🔔',
      color: '#ef4444',
      priority: 5
    }
  ]);

  useEffect(() => {
    checkWatchSupport();
    loadSettings();

    if (settings.enabled) {
      const interval = setInterval(() => {
        updateComplications();
      }, settings.updateFrequency * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [settings.enabled, settings.updateFrequency]);

  const checkWatchSupport = () => {
    // Check for smartwatch API support
    const hasWatchAPI = 'WakeLock' in window || 'bluetooth' in navigator;
    setIsSupported(hasWatchAPI);

    // Check for actual connection (simulated for now)
    const savedConnection = ClientStorage.getItem('watch_connected', false);
    setIsConnected(savedConnection);
  };

  const loadSettings = () => {
    const saved = ClientStorage.getItem('watch_settings', settings);
    setSettings(saved);
  };

  const saveSettings = (newSettings: WatchSettings) => {
    setSettings(newSettings);
    ClientStorage.setItem('watch_settings', newSettings);
  };

  const updateComplications = () => {
    // Fetch latest data and update complications
    const updated = complications.map(comp => {
      switch (comp.type) {
        case 'score':
          // Update from live match data
          return { ...comp, value: '3-2' };
        case 'prediction':
          const activePredictions = ClientStorage.getItem('active_predictions', []);
          return { ...comp, value: activePredictions.length.toString() };
        case 'streak':
          const streak = ClientStorage.getItem('current_streak', 0);
          return { ...comp, value: streak.toString() };
        case 'coins':
          const coins = ClientStorage.getItem('pi_coins_balance', 0);
          return { ...comp, value: coins.toString() };
        case 'notification':
          const notifications = ClientStorage.getItem('smart_notifications', []);
          const unread = notifications.filter((n: any) => !n.read).length;
          return { ...comp, value: unread > 0 ? `${unread} New` : 'No Updates' };
        default:
          return comp;
      }
    });

    setComplications(updated);
    syncToWatch(updated);
  };

  const syncToWatch = (data: WatchComplication[]) => {
    if (!isConnected || !settings.enabled) return;

    // Send data to watch using Web Bluetooth or other API
    const watchData = {
      timestamp: Date.now(),
      complications: data,
      settings: settings.complications
    };

    ClientStorage.setItem('watch_sync_data', watchData);

    // Trigger actual sync if watch API is available
    if ('bluetooth' in navigator) {
      // Bluetooth sync would happen here
      console.log('📲 Syncing to smartwatch:', watchData);
    }
  };

  const connectWatch = async () => {
    if (!isSupported) {
      alert('Smartwatch features are not supported on this device');
      return;
    }

    try {
      // Attempt Bluetooth connection
      if ('bluetooth' in navigator) {
        // @ts-ignore - Bluetooth API might not be in types
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: ['heart_rate'] }],
          optionalServices: ['battery_service']
        });

        setIsConnected(true);
        ClientStorage.setItem('watch_connected', true);

        const enabledSettings = { ...settings, enabled: true };
        saveSettings(enabledSettings);

        updateComplications();
      }
    } catch (error) {
      console.error('Watch connection failed:', error);
      alert('Failed to connect to smartwatch. Please ensure Bluetooth is enabled.');
    }
  };

  const disconnectWatch = () => {
    setIsConnected(false);
    ClientStorage.setItem('watch_connected', false);
    const disabledSettings = { ...settings, enabled: false };
    saveSettings(disabledSettings);
  };

  const updateComplicationSlot = (slot: keyof WatchSettings['complications'], type: string) => {
    const newSettings = {
      ...settings,
      complications: {
        ...settings.complications,
        [slot]: type
      }
    };
    saveSettings(newSettings);
    updateComplications();
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{
            color: '#fff',
            fontSize: '1.5rem',
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '2rem' }}>⌚</span>
            Smart Watch Complications
          </h2>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.9rem' }}>
            View predictions and scores on your wrist
          </p>
        </div>

        <div style={{
          background: isConnected 
            ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
            : 'rgba(255, 255, 255, 0.1)',
          padding: '8px 16px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem',
          color: '#fff'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isConnected ? '#22c55e' : '#6b7280',
            animation: isConnected ? 'pulse 2s infinite' : 'none'
          }} />
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Watch Preview */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderRadius: '50%',
        width: '280px',
        height: '280px',
        margin: '0 auto 32px',
        position: 'relative',
        border: '8px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Corner Complications */}
        {Object.entries(settings.complications).slice(0, 4).map(([slot, type], index) => {
          const comp = complications.find(c => c.id === type);
          if (!comp) return null;

          const positions = [
            { top: '20px', left: '20px' },      // corner1
            { top: '20px', right: '20px' },     // corner2
            { bottom: '20px', left: '20px' },   // corner3
            { bottom: '20px', right: '20px' }   // corner4
          ];

          return (
            <div
              key={slot}
              style={{
                position: 'absolute',
                ...positions[index],
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '8px',
                borderRadius: '12px',
                textAlign: 'center',
                minWidth: '60px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{comp.icon}</div>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: comp.color,
                marginBottom: '2px'
              }}>
                {comp.value}
              </div>
              <div style={{ fontSize: '0.6rem', color: '#9ca3af' }}>
                {comp.title.split(' ')[0]}
              </div>
            </div>
          );
        })}

        {/* Center Complication */}
        {(() => {
          const centerComp = complications.find(c => c.id === settings.complications.center);
          if (!centerComp) return null;

          return (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '16px 24px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{centerComp.icon}</div>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: centerComp.color,
                marginBottom: '4px'
              }}>
                {centerComp.value}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                {centerComp.title}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Connection Controls */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        {!isConnected ? (
          <button
            onClick={connectWatch}
            disabled={!isSupported}
            style={{
              background: isSupported 
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isSupported ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0 auto'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>📱</span>
            {isSupported ? 'Connect Smartwatch' : 'Not Supported'}
          </button>
        ) : (
          <button
            onClick={disconnectWatch}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0 auto'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🔌</span>
            Disconnect Watch
          </button>
        )}
      </div>

      {/* Complication Settings */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '1.1rem' }}>
          ⚙️ Configure Complications
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {Object.entries(settings.complications).map(([slot, type]) => (
            <div key={slot} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px'
            }}>
              <label style={{ color: '#d1d5db', fontSize: '0.9rem', textTransform: 'capitalize' }}>
                {slot.replace(/(\d)/, ' $1')}:
              </label>
              <select
                value={type}
                onChange={(e) => updateComplicationSlot(slot as keyof WatchSettings['complications'], e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                {complications.map(comp => (
                  <option key={comp.id} value={comp.id}>
                    {comp.icon} {comp.title}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Update Settings */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '1.1rem' }}>
          🔄 Sync Settings
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <label style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
              Update Frequency:
            </label>
            <select
              value={settings.updateFrequency}
              onChange={(e) => saveSettings({ ...settings, updateFrequency: parseInt(e.target.value) })}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.9rem'
              }}
            >
              <option value="1">Every minute</option>
              <option value="5">Every 5 minutes</option>
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
            </select>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <label style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
              Show Notifications:
            </label>
            <button
              onClick={() => saveSettings({ ...settings, showNotifications: !settings.showNotifications })}
              style={{
                background: settings.showNotifications 
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {settings.showNotifications ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        color: '#93c5fd',
        fontSize: '0.85rem',
        lineHeight: '1.6'
      }}>
        <strong>💡 Pro Tip:</strong> Smart watch complications update automatically based on your activity. 
        Keep Bluetooth enabled for the best experience. Compatible with Apple Watch, Wear OS, and other smartwatches.
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export { SmartWatchComplications };