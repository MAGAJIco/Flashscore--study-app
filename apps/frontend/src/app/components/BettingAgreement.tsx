"use client";
import React from 'react';

interface BettingAgreementProps {
  isVisible: boolean;
}

const BettingAgreement: React.FC<BettingAgreementProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '16px 20px',
      maxWidth: '320px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      zIndex: 100,
      animation: 'slideInFromRight 0.5s ease-out'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px'
        }}>
          🪙
        </div>
        <div>
          <h4 style={{
            margin: '0',
            color: '#1f2937',
            fontSize: '1rem',
            fontWeight: '700'
          }}>
            Betting Agreement
          </h4>
          <div style={{
            fontSize: '0.8rem',
            color: '#6b7280',
            margin: '2px 0 0 0'
          }}>
            Active & Acknowledged
          </div>
        </div>
        <div style={{
          marginLeft: 'auto',
          color: '#22c55e',
          fontSize: '16px'
        }}>
          ✓
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        border: '1px solid #bbf7d0',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px'
      }}>
        <div style={{
          color: '#166534',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '6px'
        }}>
          📋 You Agreed To:
        </div>
        <ul style={{
          margin: '0',
          paddingLeft: '16px',
          color: '#15803d',
          fontSize: '0.8rem',
          lineHeight: '1.4'
        }}>
          <li>Bet responsibly and within limits</li>
          <li>Use Pi coins for entertainment only</li>
          <li>Follow community guidelines</li>
          <li>Seek help if needed</li>
        </ul>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: '#6b7280'
      }}>
        <span>Agreement Status: Active</span>
        <span style={{
          color: '#22c55e',
          fontWeight: '600'
        }}>
          ✓ Compliant
        </span>
      </div>

      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export { BettingAgreement };
