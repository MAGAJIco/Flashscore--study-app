
"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '../utils/clientStorage';
import { PiCoinManager } from '../../../../../packages/shared/src/libs/utils/piCoinManager';
import UserManager from '../../../../../packages/shared/src/libs/utils/userManager';

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
  challenger: {
    id: string;
    username: string;
  };
  challenged: {
    id: string;
    username: string;
  };
  matchId: string;
  matchName: string;
  sport: string;
  piStake: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  challengerPrediction?: {
    outcome: string;
    confidence: number;
  };
  challengedPrediction?: {
    outcome: string;
    confidence: number;
  };
  winner?: string;
  result?: string;
  createdAt: Date;
  expiresAt: Date;
}

interface ChallengeFriendsProps {
  currentUser: User | null;
}

const ChallengeFriends: React.FC<ChallengeFriendsProps> = ({ currentUser }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<string>('');
  const [newChallenge, setNewChallenge] = useState({
    matchName: '',
    sport: 'Football',
    piStake: 50,
    prediction: '',
    confidence: 75
  });

  useEffect(() => {
    loadChallenges();
    loadFriends();
  }, [currentUser]);

  const loadChallenges = () => {
    if (!currentUser) return;
    const stored = ClientStorage.getItem('prediction_challenges', []);
    const userChallenges = stored.filter((c: Challenge) => 
      c.challenger.id === currentUser.id || c.challenged.id === currentUser.id
    );
    setChallenges(userChallenges);
  };

  const loadFriends = () => {
    // Mock friends data - would come from API in production
    const mockFriends: User[] = [
      { id: 'friend_1', username: 'soccerfan23', email: 'friend1@example.com' },
      { id: 'friend_2', username: 'basketballpro', email: 'friend2@example.com' },
      { id: 'friend_3', username: 'tennislover', email: 'friend3@example.com' }
    ];
    setFriends(mockFriends);
  };

  const saveChallenges = (updatedChallenges: Challenge[]) => {
    const allChallenges = ClientStorage.getItem('prediction_challenges', []);
    const otherChallenges = allChallenges.filter((c: Challenge) => 
      !updatedChallenges.find(uc => uc.id === c.id)
    );
    ClientStorage.setItem('prediction_challenges', [...otherChallenges, ...updatedChallenges]);
    setChallenges(updatedChallenges);
  };

  const createChallenge = () => {
    if (!currentUser || !selectedFriend || !newChallenge.matchName) return;

    const friend = friends.find(f => f.id === selectedFriend);
    if (!friend) return;

    const challenge: Challenge = {
      id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      challenger: {
        id: currentUser.id,
        username: currentUser.username
      },
      challenged: {
        id: friend.id,
        username: friend.username
      },
      matchId: `match_${Date.now()}`,
      matchName: newChallenge.matchName,
      sport: newChallenge.sport,
      piStake: newChallenge.piStake,
      status: 'pending',
      challengerPrediction: {
        outcome: newChallenge.prediction,
        confidence: newChallenge.confidence
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    // Deduct Pi stake
    PiCoinManager.addTransaction(
      currentUser.id,
      -newChallenge.piStake,
      'bonus',
      `Challenge stake: ${newChallenge.matchName}`
    );

    saveChallenges([challenge, ...challenges]);
    setShowCreateChallenge(false);
    setNewChallenge({
      matchName: '',
      sport: 'Football',
      piStake: 50,
      prediction: '',
      confidence: 75
    });
    setSelectedFriend('');
  };

  const acceptChallenge = (challengeId: string, prediction: string, confidence: number) => {
    if (!currentUser) return;

    const updatedChallenges = challenges.map(c => {
      if (c.id === challengeId) {
        // Deduct Pi stake from challenged user
        PiCoinManager.addTransaction(
          currentUser.id,
          -c.piStake,
          'bonus',
          `Challenge stake: ${c.matchName}`
        );

        return {
          ...c,
          status: 'accepted' as const,
          challengedPrediction: {
            outcome: prediction,
            confidence: confidence
          }
        };
      }
      return c;
    });

    saveChallenges(updatedChallenges);
  };

  const rejectChallenge = (challengeId: string) => {
    const updatedChallenges = challenges.map(c => {
      if (c.id === challengeId) {
        // Refund Pi stake to challenger
        const challenge = challenges.find(ch => ch.id === challengeId);
        if (challenge) {
          PiCoinManager.addTransaction(
            challenge.challenger.id,
            challenge.piStake,
            'bonus',
            `Challenge refund: ${challenge.matchName}`
          );
        }

        return {
          ...c,
          status: 'rejected' as const
        };
      }
      return c;
    });

    saveChallenges(updatedChallenges);
  };

  const resolveChallenge = (challengeId: string, actualResult: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || !challenge.challengerPrediction || !challenge.challengedPrediction) return;

    let winner: string | undefined;
    const challengerCorrect = challenge.challengerPrediction.outcome === actualResult;
    const challengedCorrect = challenge.challengedPrediction.outcome === actualResult;

    if (challengerCorrect && !challengedCorrect) {
      winner = challenge.challenger.id;
      // Award double the stake to winner
      PiCoinManager.addTransaction(
        challenge.challenger.id,
        challenge.piStake * 2,
        'bonus',
        `Won challenge: ${challenge.matchName}`
      );
    } else if (challengedCorrect && !challengerCorrect) {
      winner = challenge.challenged.id;
      PiCoinManager.addTransaction(
        challenge.challenged.id,
        challenge.piStake * 2,
        'bonus',
        `Won challenge: ${challenge.matchName}`
      );
    } else {
      // Draw - refund both players
      PiCoinManager.addTransaction(
        challenge.challenger.id,
        challenge.piStake,
        'bonus',
        `Challenge draw refund: ${challenge.matchName}`
      );
      PiCoinManager.addTransaction(
        challenge.challenged.id,
        challenge.piStake,
        'bonus',
        `Challenge draw refund: ${challenge.matchName}`
      );
    }

    const updatedChallenges = challenges.map(c => {
      if (c.id === challengeId) {
        return {
          ...c,
          status: 'completed' as const,
          winner,
          result: actualResult
        };
      }
      return c;
    });

    saveChallenges(updatedChallenges);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'accepted': return '#3b82f6';
      case 'rejected': return '#ef4444';
      case 'completed': return '#22c55e';
      default: return '#9ca3af';
    }
  };

  const pendingChallenges = challenges.filter(c => 
    c.status === 'pending' && c.challenged.id === currentUser?.id
  );
  const activeChallenges = challenges.filter(c => c.status === 'accepted');
  const completedChallenges = challenges.filter(c => c.status === 'completed');

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
          margin: 0,
          background: 'linear-gradient(135deg, #ef4444, #f59e0b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ⚔️ Challenge Friends
        </h2>

        {currentUser && (
          <button
            onClick={() => setShowCreateChallenge(true)}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ⚔️ New Challenge
          </button>
        )}
      </div>

      {/* Create Challenge Modal */}
      {showCreateChallenge && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ color: '#ef4444', marginBottom: '20px' }}>Create New Challenge</h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <select
              value={selectedFriend}
              onChange={(e) => setSelectedFriend(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px'
              }}
            >
              <option value="">Select a friend...</option>
              {friends.map(friend => (
                <option key={friend.id} value={friend.id}>{friend.username}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Match Name (e.g., Man City vs Arsenal)"
              value={newChallenge.matchName}
              onChange={(e) => setNewChallenge({ ...newChallenge, matchName: e.target.value })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px'
              }}
            />

            <input
              type="text"
              placeholder="Your Prediction (e.g., Home Win)"
              value={newChallenge.prediction}
              onChange={(e) => setNewChallenge({ ...newChallenge, prediction: e.target.value })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px'
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input
                type="number"
                placeholder="Pi Stake"
                value={newChallenge.piStake}
                onChange={(e) => setNewChallenge({ ...newChallenge, piStake: parseInt(e.target.value) || 50 })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />

              <input
                type="number"
                placeholder="Confidence %"
                value={newChallenge.confidence}
                min="0"
                max="100"
                onChange={(e) => setNewChallenge({ ...newChallenge, confidence: parseInt(e.target.value) || 75 })}
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
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Send Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Challenges */}
      {pendingChallenges.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '16px' }}>
            ⏳ Pending Challenges ({pendingChallenges.length})
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {pendingChallenges.map(challenge => (
              <div
                key={challenge.id}
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '20px',
                  borderRadius: '12px'
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ color: '#fff', margin: '0 0 8px 0' }}>
                    Challenge from {challenge.challenger.username}
                  </h4>
                  <p style={{ color: '#d1d5db', margin: '0 0 8px 0' }}>
                    {challenge.matchName}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#ffd700' }}>Stake: π{challenge.piStake}</span>
                    <span style={{ color: '#22c55e' }}>
                      Their prediction: {challenge.challengerPrediction?.outcome}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      const prediction = prompt('Enter your prediction:');
                      if (prediction) {
                        acceptChallenge(challenge.id, prediction, 75);
                      }
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Accept
                  </button>
                  <button
                    onClick={() => rejectChallenge(challenge.id)}
                    style={{
                      flex: 1,
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    ✗ Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#3b82f6', marginBottom: '16px' }}>
            ⚔️ Active Challenges ({activeChallenges.length})
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {activeChallenges.map(challenge => (
              <div
                key={challenge.id}
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '20px',
                  borderRadius: '12px'
                }}
              >
                <h4 style={{ color: '#fff', margin: '0 0 12px 0' }}>{challenge.matchName}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '12px',
                    borderRadius: '8px'
                  }}>
                    <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '4px' }}>
                      {challenge.challenger.username}
                    </div>
                    <div style={{ color: '#d1d5db' }}>
                      {challenge.challengerPrediction?.outcome}
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '12px',
                    borderRadius: '8px'
                  }}>
                    <div style={{ color: '#3b82f6', fontWeight: 'bold', marginBottom: '4px' }}>
                      {challenge.challenged.username}
                    </div>
                    <div style={{ color: '#d1d5db' }}>
                      {challenge.challengedPrediction?.outcome}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', color: '#ffd700', fontWeight: 'bold' }}>
                  Prize Pool: π{challenge.piStake * 2}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div>
          <h3 style={{ color: '#22c55e', marginBottom: '16px' }}>
            ✅ Completed Challenges
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {completedChallenges.slice(0, 5).map(challenge => (
              <div
                key={challenge.id}
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '20px',
                  borderRadius: '12px'
                }}
              >
                <h4 style={{ color: '#fff', margin: '0 0 8px 0' }}>{challenge.matchName}</h4>
                <p style={{ color: '#d1d5db', marginBottom: '12px' }}>
                  Result: {challenge.result}
                </p>
                {challenge.winner && (
                  <div style={{ color: '#22c55e', fontWeight: 'bold' }}>
                    🏆 Winner: {challenge.winner === challenge.challenger.id ? challenge.challenger.username : challenge.challenged.username}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {challenges.length === 0 && (
        <div style={{ textAlign: 'center', color: '#ccc', padding: '40px' }}>
          <h3>No challenges yet!</h3>
          <p>Create a challenge to compete with your friends in 1v1 prediction battles.</p>
        </div>
      )}
    </div>
  );
};

export default ChallengeFriends;
