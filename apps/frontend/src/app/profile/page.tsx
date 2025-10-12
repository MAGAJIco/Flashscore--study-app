
"use client";

import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Award, Coins, Settings, Shield } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  piCoins: number;
  level: number;
  createdAt: string;
  lastActive: string;
  age?: number;
  ageVerified: boolean;
  preferences: {
    favoriteLeagues: string[];
    notifications: boolean;
    theme: 'light' | 'dark';
  };
  accessRestrictions: {
    bettingAllowed: boolean;
    paymentsAllowed: boolean;
    fullContentAccess: boolean;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    favoriteLeagues: [] as string[],
    notifications: true,
    theme: 'light' as 'light' | 'dark'
  });

  useEffect(() => {
    // Load user data from localStorage or API
    const loadUserProfile = () => {
      const currentUserId = localStorage.getItem('current_user_id');
      if (currentUserId) {
        const usersData = localStorage.getItem('sports_users');
        if (usersData) {
          const users = JSON.parse(usersData);
          const currentUser = users.find((u: any) => u.id === currentUserId);
          if (currentUser) {
            setUser(currentUser);
            setFormData({
              username: currentUser.username,
              email: currentUser.email || '',
              favoriteLeagues: currentUser.preferences?.favoriteLeagues || [],
              notifications: currentUser.preferences?.notifications ?? true,
              theme: currentUser.preferences?.theme || 'light'
            });
          }
        }
      }
    };

    loadUserProfile();
  }, []);

  const handleSave = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      username: formData.username,
      email: formData.email,
      preferences: {
        ...user.preferences,
        favoriteLeagues: formData.favoriteLeagues,
        notifications: formData.notifications,
        theme: formData.theme
      }
    };

    // Update in localStorage
    const usersData = localStorage.getItem('sports_users');
    if (usersData) {
      const users = JSON.parse(usersData);
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('sports_users', JSON.stringify(users));
        setUser(updatedUser);
        setIsEditing(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                <p className="text-gray-300 flex items-center gap-2">
                  <Mail size={16} />
                  {user.email || 'No email set'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Settings size={18} />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Coins className="text-yellow-400" size={32} />
              <div>
                <p className="text-gray-300 text-sm">Pi Coins</p>
                <p className="text-2xl font-bold text-white">{user.piCoins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Award className="text-purple-400" size={32} />
              <div>
                <p className="text-gray-300 text-sm">Level</p>
                <p className="text-2xl font-bold text-white">{user.level}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-green-400" size={32} />
              <div>
                <p className="text-gray-300 text-sm">Member Since</p>
                <p className="text-sm font-medium text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Profile Information</h2>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Theme</label>
                <select
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value as 'light' | 'dark' })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={formData.notifications}
                  onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="notifications" className="text-gray-300">
                  Enable Notifications
                </label>
              </div>

              <button
                onClick={handleSave}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-gray-300">
              <p><strong>Age Verified:</strong> {user.ageVerified ? 'Yes' : 'No'}</p>
              <p><strong>Last Active:</strong> {new Date(user.lastActive).toLocaleString()}</p>
              <p><strong>Theme:</strong> {user.preferences.theme}</p>
              <p><strong>Notifications:</strong> {user.preferences.notifications ? 'Enabled' : 'Disabled'}</p>
            </div>
          )}
        </div>

        {/* Access Restrictions */}
        {(!user.accessRestrictions.bettingAllowed || !user.accessRestrictions.paymentsAllowed) && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="text-yellow-400 mt-1" size={24} />
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Account Restrictions</h3>
                <ul className="text-gray-300 space-y-1">
                  {!user.accessRestrictions.bettingAllowed && <li>• Betting is restricted</li>}
                  {!user.accessRestrictions.paymentsAllowed && <li>• Payments are restricted</li>}
                  {!user.accessRestrictions.fullContentAccess && <li>• Limited content access</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
