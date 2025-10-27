"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ width: '20px', height: '2px', background: '#5f6368', borderRadius: '2px' }} />
            <span style={{ width: '20px', height: '2px', background: '#5f6368', borderRadius: '2px' }} />
            <span style={{ width: '20px', height: '2px', background: '#5f6368', borderRadius: '2px' }} />
          </div>
        </button>

        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 600, color: '#667eea', textDecoration: 'none' }}>
          ⚽ MagajiCo
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link href="/portal" style={{ padding: '8px 16px', textDecoration: 'none', color: '#5f6368' }}>
          Portal
        </Link>
        <Link href="/predictions" style={{ padding: '8px 16px', textDecoration: 'none', color: '#5f6368' }}>
          Predictions
        </Link>
      </div>
    </nav>
  );
};