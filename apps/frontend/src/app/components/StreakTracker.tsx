
"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '../utils/clientStorage';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPredictionDate: string;
  totalPredictions: number;
  correctPredictions: number;
}

const StreakTracker: React.FC = () => {
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastPredictionDate: '',
    totalPredictions: 0,
    correctPredictions: 0
  });

  useEffect(() => {
    loadStreak();
  }, []);

  const loadStreak = () => {
    const savedStreak = ClientStorage.getItem('prediction_streak', {
      currentStreak: 0,
      longestStreak: 0,
      lastPredictionDate: '',
      totalPredictions: 0,
      correctPredictions: 0
    });
    setStreak(savedStreak);
  };

  const accuracy = streak.totalPredictions > 0 
    ? Math.round((streak.correctPredictions / streak.totalPredictions) * 100)
    : 0;

  const getStreakEmoji = (days: number) => {
    if (days === 0) return '⚪';
    if (days < 3) return '🔥';
    if (days < 7) return '💥';
    if (days < 14) return '⚡';
    if (days < 30) return '👑';
    return '🏆';
  };

  const getStreakMessage = (days: number) => {
    if (days === 0) return 'Start your streak today!';
    if (days === 1) return 'Great start! Keep it going!';
    if (days < 7) return `${days} day streak! You're on fire!`;
    if (days < 14) return `${days} days! Incredible consistency!`;
    if (days < 30) return `${days} days! You're a prediction legend!`;
    return `${days} days! LEGENDARY STATUS! 🏆`;
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{
          fontSize: '3rem',
          animation: 'pulse 2s infinite'
        }}>
          {getStreakEmoji(streak.currentStreak)}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            color: 'white',
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            {streak.currentStreak} Day Streak
          </h3>
          <p style={{
            color: '#d1d5db',
            margin: '4px 0 0 0',
            fontSize: '0.9rem'
          }}>
            {getStreakMessage(streak.currentStreak)}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginTop: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {streak.longestStreak}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
            Best Streak
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
            {accuracy}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
            Accuracy
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {streak.totalPredictions}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
            Total Bets
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
        borderRadius: '12px',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '1.5rem' }}>🎯</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>
              Daily Challenge
            </div>
            <div style={{ color: '#d1d5db', fontSize: '0.85rem' }}>
              Make 3 predictions today to keep your streak alive!
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default StreakTracker;
