"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '@utils/clientStorage';
import { UserManager } from '@magajico/shared/utils';
import { useAuth } from '@hooks/useAuth';

interface User {
  id: string;
  username: string;
  email?: string;
  createdAt?: Date;
  lastLogin?: Date;
  sessionToken?: string;
  loginAttempts?: number;
  lockedUntil?: Date;
  emailVerified?: boolean;
  role?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'prediction' | 'trivia';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  participants: string[];
  winner?: string;
  status: 'active' | 'completed';
  createdBy: string;
  createdAt: Date;
  endDate: Date;
}

interface ChallengeSystemProps {
  currentUser: User | null;
}

const ChallengeSystem: React.FC<ChallengeSystemProps> = ({ currentUser }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    type: 'quiz' as 'quiz' | 'prediction' | 'trivia',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    reward: 10
  });

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = () => {
    const stored = ClientStorage.getItem('sports_central_challenges', []);
    setChallenges(stored);
  };

  const saveChallenges = (challengeList: Challenge[]) => {
    ClientStorage.setItem('sports_central_challenges', challengeList);
    setChallenges(challengeList);
  };

  const createChallenge = () => {
    if (!currentUser || !newChallenge.title.trim()) return;

    const challenge: Challenge = {
      id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newChallenge.title,
      description: newChallenge.description,
      type: newChallenge.type,
      difficulty: newChallenge.difficulty,
      reward: newChallenge.reward,
      participants: [],
      status: 'active',
      createdBy: currentUser.id,
      createdAt: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    };

    const updatedChallenges = [...challenges, challenge];
    saveChallenges(updatedChallenges);

    setNewChallenge({
      title: '',
      description: '',
      type: 'quiz',
      difficulty: 'medium',
      reward: 10
    });
    setShowCreateChallenge(false);
  };

  const joinChallenge = (challengeId: string) => {
    if (!currentUser) return;

    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === challengeId && !challenge.participants.includes(currentUser.id)) {
        return {
          ...challenge,
          participants: [...challenge.participants, currentUser.id]
        };
      }
      return challenge;
    });

    saveChallenges(updatedChallenges);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '🧠';
      case 'prediction': return '🔮';
      case 'trivia': return '🎯';
      default: return '🎮';
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{
          color: '#fff',
          fontSize: '2rem',
          margin: '0',
          background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🏆 Challenge Zone
        </h2>

        {currentUser && (
          <button
            onClick={() => setShowCreateChallenge(!showCreateChallenge)}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
            }}
          >
            ✨ Create Challenge
          </button>
        )}
      </div>

      {showCreateChallenge && currentUser && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ color: '#22c55e', marginBottom: '20px' }}>Create New Challenge</h3>

          <div style={{ display: 'grid', gap: '16px' }}>
            <input
              type="text"
              placeholder="Challenge Title"
              value={newChallenge.title}
              onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px'
              }}
            />

            <textarea
              placeholder="Challenge Description"
              value={newChallenge.description}
              onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <select
                value={newChallenge.type}
                onChange={(e) => setNewChallenge({ ...newChallenge, type: e.target.value as any })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '16px'
                }}
              >
                <option value="quiz">🧠 Quiz</option>
                <option value="prediction">🔮 Prediction</option>
                <option value="trivia">🎯 Trivia</option>
              </select>

              <select
                value={newChallenge.difficulty}
                onChange={(e) => setNewChallenge({ ...newChallenge, difficulty: e.target.value as any })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '16px'
                }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <input
                type="number"
                placeholder="Reward (π coins)"
                value={newChallenge.reward}
                onChange={(e) => setNewChallenge({ ...newChallenge, reward: parseInt(e.target.value) || 10 })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateChallenge(false)}
                style={{
                  background: 'transparent',
                  color: '#ccc',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={createChallenge}
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Create Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        {challenges.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#ccc', padding: '40px' }}>
            <h3>No challenges yet!</h3>
            <p>Be the first to create a challenge and compete with other users.</p>
          </div>
        ) : (
          challenges.map(challenge => (
            <div
              key={challenge.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ color: '#22c55e', margin: '0 0 8px 0', fontSize: '1.3rem' }}>
                    {getTypeIcon(challenge.type)} {challenge.title}
                  </h3>
                  <p style={{ color: '#d1fae5', margin: '0 0 12px 0' }}>
                    {challenge.description}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span
                      style={{
                        background: getDifficultyColor(challenge.difficulty),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      {challenge.difficulty.toUpperCase()}
                    </span>
                    <span style={{ color: '#ffd700', fontWeight: '600' }}>
                      π{challenge.reward} reward
                    </span>
                    <span style={{ color: '#06b6d4' }}>
                      {challenge.participants.length} participants
                    </span>
                  </div>
                </div>

                {currentUser && challenge.status === 'active' && (
                  <button
                    onClick={() => joinChallenge(challenge.id)}
                    disabled={challenge.participants.includes(currentUser.id)}
                    style={{
                      background: challenge.participants.includes(currentUser.id)
                        ? 'rgba(34, 197, 94, 0.3)'
                        : 'linear-gradient(135deg, #06b6d4, #0369a1)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: challenge.participants.includes(currentUser.id) ? 'default' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}
                  >
                    {challenge.participants.includes(currentUser.id) ? '✅ Joined' : '🚀 Join Challenge'}
                  </button>
                )}
              </div>

              <div style={{ 
                fontSize: '0.8rem', 
                color: '#9ca3af',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Created: {new Date(challenge.createdAt).toLocaleDateString()}</span>
                <span>Ends: {new Date(challenge.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { ChallengeSystem };