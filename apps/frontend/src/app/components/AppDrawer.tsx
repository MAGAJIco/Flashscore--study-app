
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export const AppDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const apps = [
    { name: 'Predictions', icon: '🎯', href: '/predictions' },
    { name: 'Live Matches', icon: '⚽', href: '/live/matches' },
    { name: 'Social Feed', icon: '👥', href: '/social/feed' },
    { name: 'Rewards', icon: '🏆', href: '/rewards/achievements' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#667eea',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        ⋮
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1998
            }}
          />
          <div style={{
            position: 'fixed',
            top: '130px',
            right: '20px',
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            zIndex: 1999
          }}>
            <h3 style={{ marginBottom: '15px' }}>Apps</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {apps.map(app => (
                <Link
                  key={app.name}
                  href={app.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '15px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#333',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{app.icon}</div>
                  <span style={{ fontSize: '0.85rem' }}>{app.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};
