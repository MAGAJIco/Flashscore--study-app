
"use client";
import React, { useState } from 'react';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    siteName: 'Sports Central',
    siteDescription: 'AI-powered sports predictions and analysis',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
    aiPredictionThreshold: 75,
    maxDailyPredictions: 50,
    piCoinExchangeRate: 0.01,
    premiumPricing: 29.99,
    freeTrialDays: 7,
    maxUsersPerPlan: 1000
  });

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(err => console.error('Error loading settings:', err));
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">General Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="maintenanceMode" className="text-sm text-gray-700">
                Maintenance Mode
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="registrationEnabled"
                checked={settings.registrationEnabled}
                onChange={(e) => handleSettingChange('registrationEnabled', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="registrationEnabled" className="text-sm text-gray-700">
                Enable User Registration
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Notification Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="emailNotifications" className="text-sm text-gray-700">
                Email Notifications
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="pushNotifications"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="pushNotifications" className="text-sm text-gray-700">
                Push Notifications
              </label>
            </div>
          </div>
        </div>

        {/* AI Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">AI Prediction Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AI Prediction Threshold (%)
              </label>
              <input
                type="number"
                value={settings.aiPredictionThreshold}
                onChange={(e) => handleSettingChange('aiPredictionThreshold', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                max="100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum confidence level for AI predictions to be published
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Daily Predictions
              </label>
              <input
                type="number"
                value={settings.maxDailyPredictions}
                onChange={(e) => handleSettingChange('maxDailyPredictions', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Pricing Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pricing & Monetization</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pi Coin Exchange Rate (USD)
              </label>
              <input
                type="number"
                step="0.001"
                value={settings.piCoinExchangeRate}
                onChange={(e) => handleSettingChange('piCoinExchangeRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Premium Subscription Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.premiumPricing}
                onChange={(e) => handleSettingChange('premiumPricing', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Free Trial Days
              </label>
              <input
                type="number"
                value={settings.freeTrialDays}
                onChange={(e) => handleSettingChange('freeTrialDays', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Users Per Plan
              </label>
              <input
                type="number"
                value={settings.maxUsersPerPlan}
                onChange={(e) => handleSettingChange('maxUsersPerPlan', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">System Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Database</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">API Services</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">AI Engine</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
