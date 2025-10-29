
"use client";
import React, { useState, useEffect } from 'react';
import { SecurityUtils } from '@magajico/shared/utils';

interface PaymentVerificationProps {
  amount: number;
  onVerify: (code: string) => void;
  onCancel: () => void;
  userId?: string;
  userAge?: number;
  isMinor?: boolean;
}

interface BiometricSupport {
  available: boolean;
  type?: 'fingerprint' | 'face' | 'iris';
}

export const PaymentVerification: React.FC<PaymentVerificationProps> = ({ 
  amount, 
  onVerify, 
  onCancel,
  userId,
  userAge,
  isMinor 
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [biometricSupport, setBiometricSupport] = useState<BiometricSupport>({ available: false });
  const [use2FA, setUse2FA] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'code' | 'biometric' | '2fa'>('code');
  const [transactionRisk, setTransactionRisk] = useState<'low' | 'medium' | 'high'>('low');

  const HIGH_VALUE_THRESHOLD = 100;
  const MEDIUM_VALUE_THRESHOLD = 50;
  const MAX_ATTEMPTS = 3;
  const LOCK_DURATION = 300; // 5 minutes in seconds
  const MINOR_TRANSACTION_LIMIT = 50;

  useEffect(() => {
    // Check for biometric support
    checkBiometricSupport();
    
    // Calculate transaction risk
    assessTransactionRisk();
    
    // Auto-approve small transactions for verified users
    if (amount < MEDIUM_VALUE_THRESHOLD && !isMinor && userAge && userAge >= 18) {
      setTimeout(() => onVerify('AUTO_APPROVED'), 100);
    }
  }, [amount, isMinor, userAge]);

  useEffect(() => {
    if (isLocked && lockTimer > 0) {
      const timer = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockTimer]);

  const checkBiometricSupport = async () => {
    if (typeof window !== 'undefined' && 'credentials' in navigator) {
      try {
        const available = await (window as any).PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable();
        if (available) {
          setBiometricSupport({ available: true, type: 'fingerprint' });
        }
      } catch (err) {
        console.log('Biometric not supported');
      }
    }
  };

  const assessTransactionRisk = () => {
    let risk: 'low' | 'medium' | 'high' = 'low';
    
    if (isMinor) {
      risk = 'high';
    } else if (amount > HIGH_VALUE_THRESHOLD) {
      risk = 'high';
    } else if (amount > MEDIUM_VALUE_THRESHOLD) {
      risk = 'medium';
    }

    // Check user behavior patterns
    if (userId) {
      const rateLimitCheck = SecurityUtils.checkRateLimit(`payment_${userId}`, 5, 3600000);
      if (!rateLimitCheck) {
        risk = 'high';
      }
    }

    setTransactionRisk(risk);
  };

  const handleBiometricVerification = async () => {
    try {
      setError('');
      // Simulate biometric verification
      // In production, use WebAuthn API
      const verified = await simulateBiometricAuth();
      if (verified) {
        onVerify('BIOMETRIC_VERIFIED');
      } else {
        setError('Biometric verification failed');
        handleFailedAttempt();
      }
    } catch (err) {
      setError('Biometric verification error');
      handleFailedAttempt();
    }
  };

  const simulateBiometricAuth = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(Math.random() > 0.1), 1000);
    });
  };

  const handleVerify = () => {
    if (isLocked) {
      setError(`Account locked. Try again in ${Math.floor(lockTimer / 60)}:${(lockTimer % 60).toString().padStart(2, '0')}`);
      return;
    }

    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      setError('Code must contain only numbers');
      return;
    }

    // Check minor transaction limits
    if (isMinor && amount > MINOR_TRANSACTION_LIMIT) {
      setError(`Minors cannot make transactions over $${MINOR_TRANSACTION_LIMIT}`);
      return;
    }

    // Log verification attempt
    SecurityUtils.logSecurityEvent('payment_verification_attempt', {
      userId,
      amount,
      risk: transactionRisk,
      timestamp: new Date().toISOString()
    });

    // Simulate verification (replace with actual backend call)
    const isValid = verifyCode(code);
    
    if (isValid) {
      onVerify(code);
    } else {
      handleFailedAttempt();
    }
  };

  const verifyCode = (inputCode: string): boolean => {
    // In production, verify with backend
    // This is a simulation
    return inputCode === '123456' || inputCode.length === 6;
  };

  const handleFailedAttempt = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (newAttempts >= MAX_ATTEMPTS) {
      setIsLocked(true);
      setLockTimer(LOCK_DURATION);
      setError('Too many failed attempts. Account locked for 5 minutes.');
      
      SecurityUtils.logSecurityEvent('payment_verification_locked', {
        userId,
        attempts: newAttempts,
        timestamp: new Date().toISOString()
      });
    } else {
      setError(`Invalid code. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
    }
  };

  const requiresVerification = amount >= MEDIUM_VALUE_THRESHOLD || isMinor || transactionRisk !== 'low';

  if (!requiresVerification) {
    return null;
  }

  const getRiskColor = () => {
    switch (transactionRisk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#22c55e';
    }
  };

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
      zIndex: 2000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#1a1a1a' }}>🔒 Payment Verification</h3>
          <span style={{
            background: getRiskColor(),
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>
            {transactionRisk} Risk
          </span>
        </div>

        <p style={{ marginBottom: '24px', color: '#6b7280', fontSize: '0.95rem' }}>
          {isMinor && '⚠️ Minor account - Parental verification required. '}
          This transaction requires verification (Amount: ${amount.toFixed(2)})
        </p>

        {/* Verification Method Selector */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => setVerificationMethod('code')}
              style={{
                flex: 1,
                padding: '10px',
                background: verificationMethod === 'code' ? '#3b82f6' : '#f3f4f6',
                color: verificationMethod === 'code' ? 'white' : '#1a1a1a',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              📱 Code
            </button>
            {biometricSupport.available && (
              <button
                onClick={() => setVerificationMethod('biometric')}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: verificationMethod === 'biometric' ? '#3b82f6' : '#f3f4f6',
                  color: verificationMethod === 'biometric' ? 'white' : '#1a1a1a',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                👆 Biometric
              </button>
            )}
          </div>
        </div>

        {/* Code Input */}
        {verificationMethod === 'code' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#1a1a1a', fontWeight: '600' }}>
              Enter 6-Digit Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              disabled={isLocked}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1.3rem',
                letterSpacing: '0.3em',
                textAlign: 'center',
                border: `2px solid ${error ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '8px',
                opacity: isLocked ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            />
            {error && (
              <div style={{ 
                color: '#ef4444', 
                fontSize: '0.9rem', 
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                ⚠️ {error}
              </div>
            )}
          </div>
        )}

        {/* Biometric Verification */}
        {verificationMethod === 'biometric' && (
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <button
              onClick={handleBiometricVerification}
              disabled={isLocked}
              style={{
                width: '100%',
                padding: '20px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
                opacity: isLocked ? 0.5 : 1
              }}
            >
              👆 Authenticate with {biometricSupport.type}
            </button>
          </div>
        )}

        {/* Transaction Details */}
        <div style={{ 
          background: '#f8fafc', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Amount:</span>
            <span style={{ fontWeight: '700', color: '#1a1a1a' }}>${amount.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Account Type:</span>
            <span style={{ fontWeight: '600', color: '#1a1a1a' }}>
              {isMinor ? '🧒 Minor' : '👤 Adult'}
            </span>
          </div>
          {isMinor && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Remaining Limit:</span>
              <span style={{ fontWeight: '600', color: '#f59e0b' }}>
                ${Math.max(0, MINOR_TRANSACTION_LIMIT - amount).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              background: '#f1f5f9',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            Cancel
          </button>
          {verificationMethod === 'code' && (
            <button
              onClick={handleVerify}
              disabled={isLocked || code.length !== 6}
              style={{
                flex: 1,
                padding: '14px',
                background: isLocked || code.length !== 6 ? '#cbd5e1' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isLocked || code.length !== 6 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              {isLocked ? '🔒 Locked' : 'Verify'}
            </button>
          )}
        </div>

        {/* Security Info */}
        <div style={{ 
          marginTop: '20px', 
          padding: '14px', 
          background: '#eff6ff', 
          borderRadius: '8px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <p style={{ fontSize: '0.85rem', color: '#1e40af', margin: 0, lineHeight: '1.5' }}>
            🔐 <strong>Security Notice:</strong> {verificationMethod === 'code' 
              ? 'Code sent to your registered email/phone'
              : 'Your biometric data never leaves your device'}
          </p>
        </div>
      </div>
    </div>
  );
};
