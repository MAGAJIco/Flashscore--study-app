'use client';

import React, { useState, useEffect } from 'react';
import timeZoneService from '@/app/[locale]/services/timeZoneService';

export function TimeZoneSettings() {
  const [timezone, setTimezone] = useState('');
  const [format24h, setFormat24h] = useState(true);
  const [showLocalTime, setShowLocalTime] = useState(true);
  const [exampleTime, setExampleTime] = useState('');

  useEffect(() => {
    setTimezone(timeZoneService.getUserTimezone());
    updateExampleTime();
  }, []);

  const updateExampleTime = () => {
    const now = new Date();
    const formatted = timeZoneService.formatMatchTime(now);
    setExampleTime(formatted);
  };

  const handleTimezoneChange = (newTimezone: string) => {
    setTimezone(newTimezone);
    timeZoneService.savePreferences({ timezone: newTimezone });
    updateExampleTime();
  };

  const handleFormatChange = (use24h: boolean) => {
    setFormat24h(use24h);
    timeZoneService.savePreferences({ format24h: use24h });
    updateExampleTime();
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      padding: '24px',
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
        <span>🕐</span>
        Time Zone Settings
      </h2>

      <p style={{
        color: '#9ca3af',
        fontSize: '0.95rem',
        marginBottom: '24px'
      }}>
        Customize how match times are displayed based on your location
      </p>

      {/* Timezone Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          color: '#d1d5db',
          fontSize: '0.9rem',
          fontWeight: '600',
          marginBottom: '8px',
          display: 'block'
        }}>
          Your Time Zone
        </label>
        <select
          value={timezone}
          onChange={(e) => handleTimezoneChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '0.95rem'
          }}
        >
          {timeZoneService.getAllTimezones().map(tz => (
            <option key={tz} value={tz} style={{ background: '#1f2937' }}>
              {tz.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Time Format */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          color: '#d1d5db',
          fontSize: '0.9rem',
          fontWeight: '600',
          marginBottom: '12px',
          display: 'block'
        }}>
          Time Format
        </label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => handleFormatChange(false)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: `2px solid ${!format24h ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
              background: !format24h ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            12-hour (3:00 PM)
          </button>
          <button
            onClick={() => handleFormatChange(true)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: `2px solid ${format24h ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
              background: format24h ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            24-hour (15:00)
          </button>
        </div>
      </div>

      {/* Example */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <div style={{
          color: '#60a5fa',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>
          Example
        </div>
        <div style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
          Match time: {exampleTime}
        </div>
        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '4px' }}>
          Timezone: {timezone}
        </div>
      </div>

      {/* Notification Settings */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: 'rgba(16, 185, 129, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#10b981',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={showLocalTime}
            onChange={(e) => {
              setShowLocalTime(e.target.checked);
              timeZoneService.savePreferences({ showLocalTime: e.target.checked });
            }}
            style={{ width: '18px', height: '18px' }}
          />
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
              Enable Smart Notifications
            </div>
            <div style={{ color: '#6ee7b7', fontSize: '0.8rem' }}>
              Get notified 15 minutes before matches in your timezone
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

export default TimeZoneSettings;