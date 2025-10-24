"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '@utils/clientStorage';

interface SyncDevice {
  id: string;
  name: string;
  type: 'browser' | 'discord' | 'telegram' | 'email' | 'mobile' | 'smartwatch';
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: Date;
  icon: string;
}

interface SyncData {
  predictions: any[];
  balance: number;
  settings: any;
  notifications: any[];
  timestamp: Date;
}

const CrossPlatformSync: React.FC = () => {
  const [devices, setDevices] = useState<SyncDevice[]>([
    {
      id: 'browser_ext',
      name: 'Browser Extension',
      type: 'browser',
      status: 'disconnected',
      lastSync: new Date(),
      icon: '🌐'
    },
    {
      id: 'discord_bot',
      name: 'Discord Bot',
      type: 'discord',
      status: 'disconnected',
      lastSync: new Date(),
      icon: '💬'
    },
    {
      id: 'telegram_bot',
      name: 'Telegram Bot',
      type: 'telegram',
      status: 'disconnected',
      lastSync: new Date(),
      icon: '✈️'
    },
    {
      id: 'email_digest',
      name: 'Email Digest',
      type: 'email',
      status: 'disconnected',
      lastSync: new Date(),
      icon: '📧'
    }
  ]);

  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncInterval: 5, // minutes
    syncPredictions: true,
    syncBalance: true,
    syncNotifications: true,
    syncSettings: true
  });

  const [browserExtUrl, setBrowserExtUrl] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    loadSyncSettings();

    if (syncSettings.autoSync) {
      const interval = setInterval(() => {
        syncAllDevices();
      }, syncSettings.syncInterval * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [syncSettings.autoSync, syncSettings.syncInterval]);

  const loadSyncSettings = () => {
    try {
      const saved = ClientStorage.getItem('cross_platform_sync', {
        settings: syncSettings,
        devices: devices
      });

      if (saved && saved.settings) {
        setSyncSettings(saved.settings);
      }

      if (saved && saved.devices && Array.isArray(saved.devices) && saved.devices.length > 0) {
        setDevices(saved.devices);
      }
    } catch (e) {
      console.warn('Failed to load sync settings:', e);
    }
  };

  const saveSyncSettings = () => {
    ClientStorage.setItem('cross_platform_sync', {
      devices,
      settings: syncSettings
    });
  };

  const connectDevice = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    // Validate connection requirements
    if (device.type === 'browser' && !browserExtUrl) {
      alert('Please install the browser extension first');
      return;
    }
    if (device.type === 'discord' && !discordWebhook) {
      alert('Please provide Discord webhook URL');
      return;
    }
    if (device.type === 'telegram' && !telegramBotToken) {
      alert('Please provide Telegram bot token');
      return;
    }
    if (device.type === 'email' && !emailAddress) {
      alert('Please provide email address');
      return;
    }

    // Update device status
    setDevices(devices.map(d =>
      d.id === deviceId
        ? { ...d, status: 'syncing' as const }
        : d
    ));

    // Simulate connection
    setTimeout(() => {
      setDevices(devices.map(d =>
        d.id === deviceId
          ? { ...d, status: 'connected' as const, lastSync: new Date() }
          : d
      ));

      saveSyncSettings();
      syncDevice(deviceId);
    }, 1500);
  };

  const disconnectDevice = (deviceId: string) => {
    setDevices(devices.map(d =>
      d.id === deviceId
        ? { ...d, status: 'disconnected' as const }
        : d
    ));
    saveSyncSettings();
  };

  const getSyncData = (): SyncData => {
    return {
      predictions: ClientStorage.getItem('active_predictions', []),
      balance: ClientStorage.getItem('pi_coins_balance', 0),
      settings: ClientStorage.getItem('user_settings', {}),
      notifications: ClientStorage.getItem('smart_notifications', []),
      timestamp: new Date()
    };
  };

  const syncDevice = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device || device.status !== 'connected') return;

    const syncData = getSyncData();

    switch (device.type) {
      case 'browser':
        await syncBrowserExtension(syncData);
        break;
      case 'discord':
        await syncDiscord(syncData);
        break;
      case 'telegram':
        await syncTelegram(syncData);
        break;
      case 'email':
        await syncEmail(syncData);
        break;
    }

    setDevices(devices.map(d =>
      d.id === deviceId
        ? { ...d, lastSync: new Date() }
        : d
    ));

    setLastSyncTime(new Date());
  };

  const syncAllDevices = () => {
    devices
      .filter(d => d.status === 'connected')
      .forEach(d => syncDevice(d.id));
  };

  const syncBrowserExtension = async (data: SyncData) => {
    // Use localStorage for browser extension sync
    localStorage.setItem('magajico_sync_data', JSON.stringify(data));

    // Trigger custom event for extension
    window.dispatchEvent(new CustomEvent('magajico-sync', { detail: data }));

    console.log('🌐 Browser extension synced');
  };

  const syncDiscord = async (data: SyncData) => {
    if (!discordWebhook) return;

    const message = {
      embeds: [{
        title: '🎯 MagajiCo Prediction Update',
        description: `Latest predictions and account status`,
        color: 3447003,
        fields: [
          {
            name: '💰 Balance',
            value: `π${data.balance}`,
            inline: true
          },
          {
            name: '🎲 Active Predictions',
            value: `${data.predictions.length}`,
            inline: true
          },
          {
            name: '🔔 Notifications',
            value: `${data.notifications.filter((n: any) => !n.read).length} unread`,
            inline: true
          }
        ],
        timestamp: new Date().toISOString()
      }]
    };

    try {
      await fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
      console.log('💬 Discord synced');
    } catch (error) {
      console.error('Discord sync failed:', error);
    }
  };

  const syncTelegram = async (data: SyncData) => {
    // Telegram bot API integration would go here
    console.log('✈️ Telegram synced', data);
  };

  const syncEmail = async (data: SyncData) => {
    if (!emailAddress) return;

    // Email digest generation
    const digest = {
      to: emailAddress,
      subject: 'MagajiCo Daily Prediction Digest',
      predictions: data.predictions,
      balance: data.balance,
      notifications: data.notifications
    };

    console.log('📧 Email digest prepared:', digest);
    // In production, this would call an API endpoint to send email
  };

  const installBrowserExtension = () => {
    window.open('https://github.com/yourusername/magajico-extension', '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#22c55e';
      case 'syncing': return '#eab308';
      case 'disconnected': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'syncing': return 'Syncing...';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      margin: '20px 0'
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '2rem',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🔄 Cross-Platform Sync
      </h2>

      {/* Sync Status Banner */}
      {lastSyncTime && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '20px',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#22c55e' }}>
            ✅ Last synced: {lastSyncTime.toLocaleTimeString()}
          </span>
          <button
            onClick={syncAllDevices}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🔄 Sync Now
          </button>
        </div>
      )}

      {/* Devices Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {devices.map(device => (
          <div key={device.id} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '20px',
            border: `2px solid ${getStatusColor(device.status)}40`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '2.5rem' }}>{device.icon}</div>
              <div style={{
                background: getStatusColor(device.status),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                {getStatusLabel(device.status)}
              </div>
            </div>

            <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.1rem' }}>
              {device.name}
            </h3>

            {device.status === 'connected' && (
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '12px' }}>
                Last sync: {device.lastSync.toLocaleTimeString()}
              </p>
            )}

            {/* Connection Inputs */}
            {device.status === 'disconnected' && (
              <div style={{ marginBottom: '12px' }}>
                {device.type === 'browser' && (
                  <div>
                    <button
                      onClick={installBrowserExtension}
                      style={{
                        width: '100%',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#3b82f6',
                        border: '1px solid #3b82f6',
                        padding: '8px',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      📥 Install Extension
                    </button>
                    <input
                      type="text"
                      placeholder="Extension ID (auto-detected)"
                      value={browserExtUrl}
                      onChange={(e) => setBrowserExtUrl(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                )}

                {device.type === 'discord' && (
                  <input
                    type="text"
                    placeholder="Discord Webhook URL"
                    value={discordWebhook}
                    onChange={(e) => setDiscordWebhook(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                )}

                {device.type === 'telegram' && (
                  <input
                    type="text"
                    placeholder="Telegram Bot Token"
                    value={telegramBotToken}
                    onChange={(e) => setTelegramBotToken(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                )}

                {device.type === 'email' && (
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {device.status === 'disconnected' ? (
                <button
                  onClick={() => connectDevice(device.id)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  Connect
                </button>
              ) : (
                <>
                  <button
                    onClick={() => syncDevice(device.id)}
                    disabled={device.status === 'syncing'}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: device.status === 'syncing' ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      opacity: device.status === 'syncing' ? 0.5 : 1
                    }}
                  >
                    Sync
                  </button>
                  <button
                    onClick={() => disconnectDevice(device.id)}
                    style={{
                      flex: 1,
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    Disconnect
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sync Settings */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>⚙️ Sync Settings</h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#d1d5db' }}>Auto-sync enabled</span>
            <input
              type="checkbox"
              checked={syncSettings.autoSync}
              onChange={(e) => setSyncSettings({ ...syncSettings, autoSync: e.target.checked })}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#d1d5db' }}>Sync interval (minutes)</span>
            <select
              value={syncSettings.syncInterval}
              onChange={(e) => setSyncSettings({ ...syncSettings, syncInterval: Number(e.target.value) })}
              style={{
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="1">1</option>
              <option value="5">5</option>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="60">60</option>
            </select>
          </label>

          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#d1d5db' }}>Sync predictions</span>
            <input
              type="checkbox"
              checked={syncSettings.syncPredictions}
              onChange={(e) => setSyncSettings({ ...syncSettings, syncPredictions: e.target.checked })}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#d1d5db' }}>Sync balance</span>
            <input
              type="checkbox"
              checked={syncSettings.syncBalance}
              onChange={(e) => setSyncSettings({ ...syncSettings, syncBalance: e.target.checked })}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#d1d5db' }}>Sync notifications</span>
            <input
              type="checkbox"
              checked={syncSettings.syncNotifications}
              onChange={(e) => setSyncSettings({ ...syncSettings, syncNotifications: e.target.checked })}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </label>
        </div>

        <button
          onClick={saveSyncSettings}
          style={{
            width: '100%',
            marginTop: '16px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          💾 Save Settings
        </button>
      </div>
    </div>
  );
};

export { CrossPlatformSync };export default CrossPlatformSync;
