"use client";

import React, { useEffect, useState } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward?: number;
}

interface AchievementCelebrationProps {
  achievement: Achievement | null;
  onComplete: () => void;
}

export function AchievementCelebration({ achievement, onComplete }: AchievementCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 300);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [achievement, onComplete]);

  if (!achievement || !isVisible) return null;

  const rarityColors = {
    common: { bg: '#4ade80', glow: 'rgba(74, 222, 128, 0.4)' },
    rare: { bg: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
    epic: { bg: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
    legendary: { bg: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
  };

  const color = rarityColors[achievement.rarity];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        pointerEvents: 'none',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.3s ease-out',
        }}
      />

      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: particle.id % 3 === 0 ? '12px' : '8px',
            height: particle.id % 3 === 0 ? '12px' : '8px',
            borderRadius: particle.id % 2 === 0 ? '50%' : '0%',
            background: particle.id % 4 === 0 ? '#fbbf24' : color.bg,
            transform: `translate(${particle.x}px, ${particle.y}px) rotate(${particle.id * 45}deg)`,
            opacity: 0,
            animation: `particleExplosion 1.5s ease-out ${particle.delay}s, sparkle 0.5s ease-in-out ${particle.delay}s infinite`,
            boxShadow: `0 0 15px ${color.glow}, 0 0 25px ${particle.id % 2 === 0 ? '#fff' : color.glow}`,
          }}
        />
      ))}

      <div
        style={{
          position: 'relative',
          background: `linear-gradient(135deg, rgba(13, 17, 23, 0.95), rgba(30, 30, 30, 0.95))`,
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '400px',
          textAlign: 'center',
          border: `2px solid ${color.bg}`,
          boxShadow: `0 20px 60px ${color.glow}, 0 0 100px ${color.glow}`,
          animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div
          style={{
            fontSize: '5rem',
            marginBottom: '20px',
            animation: 'bounce 1s ease-in-out infinite',
          }}
        >
          {achievement.icon}
        </div>

        <div
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '20px',
            background: color.bg,
            color: '#000',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '16px',
          }}
        >
          {achievement.rarity}
        </div>

        <h2
          style={{
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '12px',
            animation: 'slideUp 0.6s ease-out 0.2s both',
          }}
        >
          Achievement Unlocked!
        </h2>

        <h3
          style={{
            color: color.bg,
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '12px',
            animation: 'slideUp 0.6s ease-out 0.3s both',
          }}
        >
          {achievement.title}
        </h3>

        <p
          style={{
            color: '#aaa',
            fontSize: '1rem',
            lineHeight: '1.5',
            marginBottom: '20px',
            animation: 'slideUp 0.6s ease-out 0.4s both',
          }}
        >
          {achievement.description}
        </p>

        {achievement.reward && (
          <div
            style={{
              background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              animation: 'slideUp 0.6s ease-out 0.5s both',
            }}
          >
            <div style={{ color: '#ffd700', fontSize: '0.9rem', marginBottom: '4px' }}>
              Reward
            </div>
            <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>
              🪙 {achievement.reward} Pi Coins
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }

        @keyframes particleExplosion {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--x), var(--y)) scale(0);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(2);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export function useAchievements() {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  const triggerAchievement = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
  };

  const clearAchievement = () => {
    setCurrentAchievement(null);
  };

  return {
    currentAchievement,
    triggerAchievement,
    clearAchievement,
  };
}
