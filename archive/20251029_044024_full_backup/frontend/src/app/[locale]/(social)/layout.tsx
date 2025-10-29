
'use client';

import React from 'react';

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="social-app">
      <div className="social-header bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 mb-4">
        <h2 className="text-xl font-bold">👥 Social & Community</h2>
        <p className="text-sm opacity-90">Connect with Sports Fans</p>
      </div>
      <div className="social-content">
        {children}
      </div>
    </div>
  );
}
