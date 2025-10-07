
'use client';
import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface AgeRestrictionGuardProps {
  children: React.ReactNode;
  feature: 'betting' | 'payments' | 'fullContent';
  fallback?: React.ReactNode;
}

const AgeRestrictionGuard: React.FC<AgeRestrictionGuardProps> = ({ 
  children, 
  feature,
  fallback 
}) => {
  const { user } = useAuth();

  // Check if user has access to the feature
  const hasAccess = () => {
    if (!user) return false;

    const userAge = (user as any).age;
    const isMinor = (user as any).isMinor;
    const accessRestrictions = (user as any).accessRestrictions;

    // Under 18 restrictions
    if (isMinor || userAge < 18) {
      switch (feature) {
        case 'betting':
          return accessRestrictions?.bettingAllowed || false;
        case 'payments':
          return accessRestrictions?.paymentsAllowed || false;
        case 'fullContent':
          return accessRestrictions?.fullContentAccess !== false;
        default:
          return true;
      }
    }

    return true;
  };

  if (!hasAccess()) {
    return (
      fallback || (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔞</div>
          <h3 style={{ color: '#ef4444', marginBottom: '12px' }}>
            Age Restricted Content
          </h3>
          <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '16px' }}>
            This feature is restricted for users under 18 years old in compliance with responsible gaming policies.
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.85rem',
            color: '#9ca3af'
          }}>
            <p>✓ Educational content is available</p>
            <p>✓ You can view predictions and analytics</p>
            <p>✓ Full access granted when you turn 18</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default AgeRestrictionGuard;
