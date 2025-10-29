"use client";

import React from 'react';

export function PredictionCardSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{
        height: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        marginBottom: '12px',
        width: '70%',
      }} />
      <div style={{
        height: '16px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        marginBottom: '16px',
        width: '40%',
      }} />
      <div style={{
        height: '40px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        marginBottom: '12px',
      }} />
      <div style={{
        display: 'flex',
        gap: '8px',
      }}>
        <div style={{
          flex: 1,
          height: '32px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
        }} />
        <div style={{
          flex: 1,
          height: '32px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
        }} />
      </div>
    </div>
  );
}

export function LiveScoreCardSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <div style={{
          height: '16px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          width: '100px',
        }} />
        <div style={{
          height: '14px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          width: '60px',
        }} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            height: '18px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            marginBottom: '8px',
            width: '80%',
          }} />
          <div style={{
            height: '18px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            width: '80%',
          }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            height: '32px',
            width: '48px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            marginBottom: '8px',
          }} />
          <div style={{
            height: '32px',
            width: '48px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
          }} />
        </div>
      </div>
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{
        height: '140px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        marginBottom: '12px',
      }} />
      <div style={{
        height: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        marginBottom: '8px',
      }} />
      <div style={{
        height: '16px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        marginBottom: '8px',
        width: '90%',
      }} />
      <div style={{
        height: '14px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        width: '60%',
      }} />
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{
        height: '24px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        marginBottom: '20px',
        width: '50%',
      }} />
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }} />
          <div style={{ flex: 1 }}>
            <div style={{
              height: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              marginBottom: '6px',
              width: '70%',
            }} />
            <div style={{
              height: '14px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              width: '40%',
            }} />
          </div>
          <div style={{
            height: '24px',
            width: '60px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
          }} />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div style={{ padding: '20px' }}>
      <div
        className="animate-pulse"
        style={{
          height: '48px',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '12px',
          marginBottom: '24px',
          width: '300px',
        }}
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
      }}>
        <PredictionCardSkeleton />
        <PredictionCardSkeleton />
        <LiveScoreCardSkeleton />
        <NewsCardSkeleton />
        <LeaderboardSkeleton />
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
