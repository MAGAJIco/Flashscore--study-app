
"use client";
import React, { useState } from 'react';

interface PaymentVerificationProps {
  amount: number;
  onVerify: (code: string) => void;
  onCancel: () => void;
}

export const PaymentVerification: React.FC<PaymentVerificationProps> = ({ amount, onVerify, onCancel }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const HIGH_VALUE_THRESHOLD = 100;
  const requiresVerification = amount >= HIGH_VALUE_THRESHOLD;

  const handleVerify = () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    onVerify(code);
  };

  if (!requiresVerification) {
    onVerify('AUTO_APPROVED');
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#1a1a1a' }}>Payment Verification Required</h3>
        <p style={{ marginBottom: '24px', color: '#6b7280' }}>
          This transaction requires verification due to the amount (${amount.toFixed(2)})
        </p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1a1a1a', fontWeight: '600' }}>
            Enter 6-Digit Code
          </label>
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1.2rem',
              letterSpacing: '0.3em',
              textAlign: 'center',
              border: '2px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '8px' }}>{error}</div>}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              background: '#e5e7eb',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            style={{
              flex: 1,
              padding: '12px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Verify
          </button>
        </div>

        <div style={{ marginTop: '20px', padding: '12px', background: '#eff6ff', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.85rem', color: '#1e40af', margin: 0 }}>
            💡 Code sent to your registered email/phone
          </p>
        </div>
      </div>
    </div>
  );
};
