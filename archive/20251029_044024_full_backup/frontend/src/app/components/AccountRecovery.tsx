"use client";
import React, { useState } from 'react';
import { UserManager } from '@magajico/shared/utils';

interface AccountRecoveryProps {
  isOpen: boolean;
  onClose: () => void;
  onRecoverySuccess: (user: any) => void;
}

const AccountRecovery: React.FC<AccountRecoveryProps> = ({ isOpen, onClose, onRecoverySuccess }) => {
  const [step, setStep] = useState<'request' | 'recover'>('request');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestRecovery = async () => {
    if (!username.trim()) {
      setMessage('Please enter your username');
      return;
    }

    setIsLoading(true);
    const result = UserManager.initiateAccountRecovery(username, email);
    
    if (result.success) {
      setGeneratedCode(result.recoveryCode || '');
      setMessage(result.message);
      setStep('recover');
    } else {
      setMessage(result.message);
    }
    setIsLoading(false);
  };

  const handleRecover = async () => {
    if (!recoveryCode.trim()) {
      setMessage('Please enter the recovery code');
      return;
    }

    setIsLoading(true);
    const result = UserManager.recoverAccount(username, recoveryCode);
    
    if (result.success && result.user) {
      setMessage(result.message);
      onRecoverySuccess(result.user);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } else {
      setMessage(result.message);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setStep('request');
    setUsername('');
    setEmail('');
    setRecoveryCode('');
    setGeneratedCode('');
    setMessage('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        width: '90%',
        maxWidth: '500px',
        background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
        borderRadius: '16px',
        padding: '30px',
        color: '#fff'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
            🔑 Account Recovery
          </h2>
          <button
            onClick={() => { onClose(); resetForm(); }}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {step === 'request' ? (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#e8f5e8' }}>
              Step 1: Request Recovery Code
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#d1fae5' }}>
                Username *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#d1fae5' }}>
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for verification"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>

            <button
              onClick={handleRequestRecovery}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: isLoading ? '#666' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Generating...' : 'Generate Recovery Code'}
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#e8f5e8' }}>
              Step 2: Enter Recovery Code
            </h3>

            {generatedCode && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Your Recovery Code:</div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  fontFamily: 'monospace',
                  letterSpacing: '2px',
                  color: '#22c55e'
                }}>
                  {generatedCode}
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '8px', color: '#d1fae5' }}>
                  Save this code! It expires in 24 hours.
                </div>
              </div>
            )}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#d1fae5' }}>
                Recovery Code
              </label>
              <input
                type="text"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                placeholder="Enter the 8-character recovery code"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  letterSpacing: '1px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setStep('request')}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button
                onClick={handleRecover}
                disabled={isLoading}
                style={{
                  flex: 2,
                  padding: '14px',
                  background: isLoading ? '#666' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Recovering...' : 'Recover Account'}
              </button>
            </div>
          </div>
        )}

        {message && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '8px',
            background: message.includes('success') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${message.includes('success') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: message.includes('success') ? '#22c55e' : '#ef4444',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export { AccountRecovery };
