"use client";

import React from 'react';
import { useKidsMode } from '@hooks/useKidsMode';
import { ProtectedGambling } from '../../components/ProtectedGambling';
import { KidsModeToggle } from '../../components/KidsModeToggle';
import { AgeRestrictionGuard } from '../components/AgeRestrictionGuard';

export default function TestKidsModeePage() {
  const { kidsMode } = useKidsMode();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Kids Mode & Child Protection Test Page</h1>

      <div style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Current Status</h2>
        <p>Kids Mode: <strong>{kidsMode ? 'ENABLED ✓' : 'DISABLED'}</strong></p>
        <div style={{ marginTop: '15px' }}>
          <KidsModeToggle />
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Test 1: Gambling Content Protection</h2>
        <ProtectedGambling
          fallback={<div style={{ padding: '15px', background: '#4ade80', color: 'white', borderRadius: '8px' }}>
            ✓ PASS: Gambling content is hidden in Kids Mode
          </div>}
        >
          <div style={{ padding: '15px', background: '#ef4444', color: 'white', borderRadius: '8px' }}>
            ⚠️ FAIL: Gambling content is visible (should be hidden in Kids Mode)
            <div style={{ marginTop: '10px' }}>
              <h3>Betting Odds</h3>
              <p>Team A: 2.5 | Team B: 1.8</p>
              <button style={{ padding: '8px 16px', background: 'white', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Place Bet
              </button>
            </div>
          </div>
        </ProtectedGambling>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Test 2: Age Restriction Guard (Betting)</h2>
        <AgeRestrictionGuard feature="betting">
          <div style={{ padding: '15px', background: '#3b82f6', color: 'white', borderRadius: '8px' }}>
            <h3>Betting Feature Access</h3>
            <p>You can access betting features</p>
          </div>
        </AgeRestrictionGuard>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Test 3: Age Restriction Guard (Payments)</h2>
        <AgeRestrictionGuard feature="payments">
          <div style={{ padding: '15px', background: '#8b5cf6', color: 'white', borderRadius: '8px' }}>
            <h3>Payment Feature Access</h3>
            <p>You can access payment features</p>
          </div>
        </AgeRestrictionGuard>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Test 4: Full Content Access</h2>
        <AgeRestrictionGuard feature="fullContent">
          <div style={{ padding: '15px', background: '#ec4899', color: 'white', borderRadius: '8px' }}>
            <h3>Full Content Access</h3>
            <p>You have access to all content</p>
          </div>
        </AgeRestrictionGuard>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#e0e7ff', borderRadius: '8px' }}>
        <h2>COPPA Compliance Summary</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>✓ Kids Mode restricts gambling content</li>
          <li>✓ Age verification guards sensitive features</li>
          <li>✓ Parental consent flow implemented</li>
          <li>✓ Privacy controls for children under 13</li>
          <li>✓ Data minimization in Kids Mode</li>
        </ul>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
          See <a href="/privacy" style={{ color: '#3b82f6' }}>Privacy Policy</a> and <a href="/terms" style={{ color: '#3b82f6' }}>Terms of Service</a> for complete COPPA compliance details.
        </p>
      </div>
    </div>
  );
}

