
"use client";
import React, { useState, useEffect } from 'react';

export default function AnalyticsManager() {
  const [analytics, setAnalytics] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalPredictions: 3456,
    accuracyRate: 87.3,
    revenue: 15234.56,
    newSignups: 89
  });

  const [timeframe, setTimeframe] = useState('7d');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <select 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="1d">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalUsers.toLocaleString()}</p>
          <span className="text-sm text-green-500">+12% from last period</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-green-600">{analytics.activeUsers.toLocaleString()}</p>
          <span className="text-sm text-green-500">+8% from last period</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Predictions</h3>
          <p className="text-3xl font-bold text-purple-600">{analytics.totalPredictions.toLocaleString()}</p>
          <span className="text-sm text-green-500">+23% from last period</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Accuracy Rate</h3>
          <p className="text-3xl font-bold text-orange-600">{analytics.accuracyRate}%</p>
          <span className="text-sm text-green-500">+2.1% from last period</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-indigo-600">${analytics.revenue.toLocaleString()}</p>
          <span className="text-sm text-green-500">+15% from last period</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">New Signups</h3>
          <p className="text-3xl font-bold text-pink-600">{analytics.newSignups}</p>
          <span className="text-sm text-green-500">+34% from last period</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">User Engagement</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Daily Active Users</span>
              <span className="font-semibold">892</span>
            </div>
            <div className="flex justify-between">
              <span>Average Session Duration</span>
              <span className="font-semibold">12:34</span>
            </div>
            <div className="flex justify-between">
              <span>Pages per Session</span>
              <span className="font-semibold">4.7</span>
            </div>
            <div className="flex justify-between">
              <span>Bounce Rate</span>
              <span className="font-semibold">23.4%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Top Performing Predictions</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Premier League</span>
              <span className="font-semibold text-green-600">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span>Champions League</span>
              <span className="font-semibold text-green-600">91.8%</span>
            </div>
            <div className="flex justify-between">
              <span>NFL</span>
              <span className="font-semibold text-green-600">89.3%</span>
            </div>
            <div className="flex justify-between">
              <span>NBA</span>
              <span className="font-semibold text-green-600">86.7%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
