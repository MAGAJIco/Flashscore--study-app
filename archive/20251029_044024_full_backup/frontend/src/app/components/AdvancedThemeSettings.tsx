
"use client";

import React, { useState, useEffect } from 'react';
import { useThemeScheduler } from '@hooks/useThemeScheduler';
import { useColorBlindMode } from '@hooks/useColorBlindMode';
import { ThemeSyncManager } from '@utils/themeSyncManager';

export function AdvancedThemeSettings() {
  const { updateSchedule, toggleScheduler } = useThemeScheduler();
  const { mode, setColorBlindMode } = useColorBlindMode();
  const [schedulerEnabled, setSchedulerEnabled] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);

  useEffect(() => {
    setSchedulerEnabled(localStorage.getItem('theme_scheduler_enabled') === 'true');
  }, []);

  const handleSchedulerToggle = (enabled: boolean) => {
    setSchedulerEnabled(enabled);
    toggleScheduler(enabled);
  };

  const handleSyncToggle = async (enabled: boolean) => {
    setSyncEnabled(enabled);
    if (enabled) {
      await ThemeSyncManager.enableAutoSync(5);
      await ThemeSyncManager.syncFromCloud();
    }
  };

  return (
    <div className="advanced-theme-settings glass-card" style={{ padding: '24px', margin: '20px 0' }}>
      <h2 style={{ color: '#fff', marginBottom: '24px' }}>⚙️ Advanced Theme Settings</h2>

      {/* Theme Scheduler */}
      <div className="setting-section" style={{ marginBottom: '24px' }}>
        <h3 style={{ color: '#00ff88', marginBottom: '12px' }}>⏰ Auto Theme Scheduler</h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1' }}>
          <input
            type="checkbox"
            checked={schedulerEnabled}
            onChange={(e) => handleSchedulerToggle(e.target.checked)}
          />
          <span>Auto-switch themes based on time of day</span>
        </label>
      </div>

      {/* Color Blind Modes */}
      <div className="setting-section" style={{ marginBottom: '24px' }}>
        <h3 style={{ color: '#00ff88', marginBottom: '12px' }}>👁️ Color Blindness Support</h3>
        <select
          value={mode}
          onChange={(e) => setColorBlindMode(e.target.value as any)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <option value="none">No Filter</option>
          <option value="deuteranopia">Deuteranopia (Red-Green)</option>
          <option value="protanopia">Protanopia (Red-Weak)</option>
          <option value="tritanopia">Tritanopia (Blue-Yellow)</option>
          <option value="achromatopsia">Achromatopsia (Grayscale)</option>
        </select>
      </div>

      {/* Cloud Sync */}
      <div className="setting-section" style={{ marginBottom: '24px' }}>
        <h3 style={{ color: '#00ff88', marginBottom: '12px' }}>☁️ Cross-Platform Sync</h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1' }}>
          <input
            type="checkbox"
            checked={syncEnabled}
            onChange={(e) => handleSyncToggle(e.target.checked)}
          />
          <span>Sync theme preferences across devices</span>
        </label>
      </div>

      <style jsx>{`
        .setting-section {
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}
