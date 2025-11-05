"use client";

import React, { useState, useEffect } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiKeyStatus {
  name: string;
  status: 'active' | 'error' | 'missing' | 'checking';
  message?: string;
  lastChecked: string;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [language, setLanguage] = useState('en');
  const [apiKeys, setApiKeys] = useState<ApiKeyStatus[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);

  const fetchApiKeyStatus = async () => {
    setLoadingKeys(true);
    try {
      const response = await fetch('/api/health/keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.keys || []);
      }
    } catch (error) {
      console.error('Failed to fetch API key status:', error);
    } finally {
      setLoadingKeys(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchApiKeyStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              ⚙️ Settings
            </h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-150px)] space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Theme</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      theme === 'light' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ☀️ Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      theme === 'dark' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🌙 Dark
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Language</span>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-indigo-600"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="fr">🇫🇷 Français</option>
                  <option value="de">🇩🇪 Deutsch</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Push Notifications</div>
                  <div className="text-sm text-gray-500">Receive alerts for live matches</div>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Auto-play Videos</div>
                  <div className="text-sm text-gray-500">Automatically play video highlights</div>
                </div>
                <button 
                  onClick={() => setAutoPlay(!autoPlay)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    autoPlay ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    autoPlay ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Privacy & Security</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-indigo-600 font-medium">Privacy Policy →</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-indigo-600 font-medium">Terms of Service →</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-indigo-600 font-medium">Data Management →</div>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">API Keys Health</h3>
              <button 
                onClick={fetchApiKeyStatus}
                disabled={loadingKeys}
                className="px-3 py-1 text-sm rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium transition-colors disabled:opacity-50"
              >
                {loadingKeys ? '⏳ Checking...' : '🔄 Refresh'}
              </button>
            </div>
            <div className="space-y-3">
              {apiKeys.length === 0 && !loadingKeys ? (
                <div className="text-center text-gray-500 py-4">
                  Click refresh to check API key status
                </div>
              ) : (
                apiKeys.map((key) => (
                  <div 
                    key={key.name}
                    className="p-4 rounded-lg border-2 transition-all hover:shadow-md"
                    style={{
                      borderColor: 
                        key.status === 'active' ? '#10b981' : 
                        key.status === 'error' ? '#ef4444' : 
                        key.status === 'missing' ? '#f59e0b' : '#9ca3af',
                      backgroundColor:
                        key.status === 'active' ? '#f0fdf4' : 
                        key.status === 'error' ? '#fef2f2' : 
                        key.status === 'missing' ? '#fffbeb' : '#f9fafb'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {key.status === 'active' ? '✅' : 
                           key.status === 'error' ? '❌' : 
                           key.status === 'missing' ? '⚠️' : '⏳'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{key.name}</div>
                          <div className="text-sm text-gray-600">{key.message}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(key.lastChecked).toLocaleTimeString()}
                      </div>
                    </div>
                    {key.status === 'error' && key.name === 'OpenAI' && key.message?.includes('Quota') && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm font-medium text-red-900 mb-1">🔧 How to Fix:</div>
                        <ol className="text-xs text-red-800 space-y-1 list-decimal list-inside">
                          <li>Visit <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" className="underline font-medium">platform.openai.com/account/billing</a></li>
                          <li>Check your usage and add credits or upgrade plan</li>
                          <li>Refresh this page after updating billing</li>
                        </ol>
                      </div>
                    )}
                    {key.status === 'missing' && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="text-xs text-amber-800">
                          💡 This API key is not configured. Add it to your environment variables to enable this feature.
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="border-t p-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
