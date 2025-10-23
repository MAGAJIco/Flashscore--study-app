"use client";
import React, { useState, useEffect } from 'react';
import { PiCoinManager } from '../../../../../packages/shared/src/libs/utils/piCoinManager';
import { UserManager } from '../../../../../packages/shared/src/libs/utils/userManager';

interface User {
  id: string;
  username: string;
  email?: string;
}

interface VotingTopic {
  id: string;
  title: string;
  description: string;
  options: VotingOption[];
  createdBy: string;
  createdAt: Date;
  endDate: Date;
  status: 'active' | 'ended';
  category: 'sports' | 'community' | 'features' | 'predictions';
  totalVotes: number;
  votingCost: number;
}

interface VotingOption {
  id: string;
  text: string;
  votes: VoteRecord[];
  totalCoins: number;
}

interface VoteRecord {
  userId: string;
  username: string;
  coinsSpent: number;
  timestamp: Date;
}

interface CommunityVotingProps {
  currentUser: User | null;
}

const CommunityVoting: React.FC<CommunityVotingProps> = ({ currentUser }) => {
  const [votingTopics, setVotingTopics] = useState<VotingTopic[]>([]);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: '',
    category: 'community' as 'sports' | 'community' | 'features' | 'predictions',
    options: ['', ''],
    votingCost: 5,
    duration: 7
  });

  useEffect(() => {
    loadVotingTopics();
    if (currentUser) {
      const piCoinManager = PiCoinManager.getInstance();
      const balance = piCoinManager.getBalance(currentUser.id);
      setUserBalance(balance.balance);
    }
  }, [currentUser]);

  const loadVotingTopics = () => {
    const stored = localStorage.getItem('community_voting_topics');
    if (stored) {
      setVotingTopics(JSON.parse(stored));
    }
  };

  const saveVotingTopics = (topics: VotingTopic[]) => {
    localStorage.setItem('community_voting_topics', JSON.stringify(topics));
    setVotingTopics(topics);
  };

  const createVotingTopic = () => {
    if (!currentUser || !newTopic.title.trim() || newTopic.options.some(opt => !opt.trim())) return;

    const topic: VotingTopic = {
      id: `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newTopic.title,
      description: newTopic.description,
      options: newTopic.options.filter(opt => opt.trim()).map(opt => ({
        id: `option_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        text: opt,
        votes: [],
        totalCoins: 0
      })),
      createdBy: currentUser.id,
      createdAt: new Date(),
      endDate: new Date(Date.now() + newTopic.duration * 24 * 60 * 60 * 1000),
      status: 'active',
      category: newTopic.category,
      totalVotes: 0,
      votingCost: newTopic.votingCost
    };

    const updatedTopics = [topic, ...votingTopics];
    saveVotingTopics(updatedTopics);

    setNewTopic({
      title: '',
      description: '',
      category: 'community',
      options: ['', ''],
      votingCost: 5,
      duration: 7
    });
    setShowCreateTopic(false);
  };

  const castVote = (topicId: string, optionId: string, coinsToSpend: number) => {
    if (!currentUser || coinsToSpend <= 0 || userBalance < coinsToSpend) return;

    const updatedTopics = votingTopics.map(topic => {
      if (topic.id === topicId && topic.status === 'active') {
        const updatedOptions = topic.options.map(option => {
          if (option.id === optionId) {
            const voteRecord: VoteRecord = {
              userId: currentUser.id,
              username: currentUser.username,
              coinsSpent: coinsToSpend,
              timestamp: new Date()
            };

            return {
              ...option,
              votes: [...option.votes, voteRecord],
              totalCoins: option.totalCoins + coinsToSpend
            };
          }
          return option;
        });

        return {
          ...topic,
          options: updatedOptions,
          totalVotes: topic.totalVotes + 1
        };
      }
      return topic;
    });

    // Deduct Pi coins from user balance
    const piCoinManager = PiCoinManager.getInstance();
    piCoinManager.spendCoins(
      currentUser.id,
      coinsToSpend,
      `Voted on: ${votingTopics.find(t => t.id === topicId)?.title}`
    );

    saveVotingTopics(updatedTopics);

    // Update user balance
    const newBalance = piCoinManager.getBalance(currentUser.id);
    setUserBalance(newBalance.balance);
  };

  const addOption = () => {
    setNewTopic({
      ...newTopic,
      options: [...newTopic.options, '']
    });
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...newTopic.options];
    updatedOptions[index] = value;
    setNewTopic({ ...newTopic, options: updatedOptions });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sports': return '⚽';
      case 'community': return '👥';
      case 'features': return '⚙️';
      case 'predictions': return '🔮';
      default: return '📊';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sports': return '#22c55e';
      case 'community': return '#8b5cf6';
      case 'features': return '#f59e0b';
      case 'predictions': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  const getVotePercentage = (option: VotingOption, topic: VotingTopic) => {
    if (topic.totalVotes === 0) return 0;
    const totalCoinsInTopic = topic.options.reduce((sum, opt) => sum + opt.totalCoins, 0);
    return totalCoinsInTopic > 0 ? (option.totalCoins / totalCoinsInTopic) * 100 : 0;
  };

  const hasUserVoted = (topic: VotingTopic) => {
    if (!currentUser) return false;
    return topic.options.some(option =>
      option.votes.some(vote => vote.userId === currentUser.id)
    );
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
        <div>
          <h2 style={{
            color: '#fff',
            fontSize: '2rem',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🗳️ Community Voting
          </h2>
          {currentUser && (
            <p style={{ color: '#d1fae5', margin: '0', fontSize: '1rem' }}>
              Your balance: <span style={{ color: '#ffd700', fontWeight: '600' }}>π {userBalance}</span>
            </p>
          )}
        </div>

        {currentUser && (
          <button
            onClick={() => setShowCreateTopic(!showCreateTopic)}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
            }}
          >
            ➕ Create Vote
          </button>
        )}
      </div>

      {/* Create Topic Form */}
      {showCreateTopic && currentUser && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ color: '#8b5cf6', marginBottom: '20px' }}>Create New Voting Topic</h3>

          <div style={{ display: 'grid', gap: '16px' }}>
            <input
              type="text"
              placeholder="Voting Topic Title"
              value={newTopic.title}
              onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
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
              placeholder="Description (optional)"
              value={newTopic.description}
              onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
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
                value={newTopic.category}
                onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value as any })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '16px'
                }}
              >
                <option value="community">👥 Community</option>
                <option value="sports">⚽ Sports</option>
                <option value="features">⚙️ Features</option>
                <option value="predictions">🔮 Predictions</option>
              </select>

              <input
                type="number"
                placeholder="Cost per vote (π coins)"
                value={newTopic.votingCost}
                onChange={(e) => setNewTopic({ ...newTopic, votingCost: parseInt(e.target.value) || 5 })}
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
                placeholder="Duration (days)"
                value={newTopic.duration}
                onChange={(e) => setNewTopic({ ...newTopic, duration: parseInt(e.target.value) || 7 })}
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

            <div>
              <h4 style={{ color: '#fff', marginBottom: '12px' }}>Voting Options</h4>
              {newTopic.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    margin: '4px 0',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              ))}
              <button
                onClick={addOption}
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: '#22c55e',
                  border: '1px solid #22c55e',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  marginTop: '8px'
                }}
              >
                + Add Option
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateTopic(false)}
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
                onClick={createVotingTopic}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Create Vote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voting Topics */}
      <div style={{ display: 'grid', gap: '24px' }}>
        {votingTopics.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#ccc', padding: '40px' }}>
            <h3>No voting topics yet!</h3>
            <p>Be the first to create a community vote and let others decide.</p>
          </div>
        ) : (
          votingTopics.map(topic => (
            <div
              key={topic.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ color: '#22c55e', margin: '0 0 8px 0', fontSize: '1.4rem' }}>
                      {topic.title}
                    </h3>
                    {topic.description && (
                      <p style={{ color: '#d1fae5', margin: '0 0 12px 0', opacity: 0.9 }}>
                        {topic.description}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      background: getCategoryColor(topic.category),
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    {getCategoryIcon(topic.category)} {topic.category}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ color: '#ffd700', fontWeight: '600' }}>
                    π{topic.votingCost} per vote
                  </span>
                  <span style={{ color: '#06b6d4' }}>
                    {topic.totalVotes} total votes
                  </span>
                  <span style={{ color: topic.status === 'active' ? '#22c55e' : '#ef4444' }}>
                    {topic.status === 'active' ? '🟢 Active' : '🔴 Ended'}
                  </span>
                  <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                    Ends: {new Date(topic.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Voting Options */}
              <div style={{ display: 'grid', gap: '12px' }}>
                {topic.options.map(option => {
                  const percentage = getVotePercentage(option, topic);
                  const userHasVoted = hasUserVoted(topic);

                  return (
                    <div
                      key={option.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: '#fff', fontSize: '1.1rem' }}>{option.text}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: '#ffd700', fontWeight: '600' }}>
                            π{option.totalCoins}
                          </span>
                          <span style={{ color: '#22c55e' }}>
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        marginBottom: '12px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>

                      {/* Vote Button */}
                      {currentUser && topic.status === 'active' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            type="number"
                            placeholder="π coins"
                            min={topic.votingCost}
                            defaultValue={topic.votingCost}
                            style={{
                              width: '100px',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: '#fff',
                              fontSize: '14px'
                            }}
                            onChange={(e) => {
                              const coinsToSpend = parseInt(e.target.value) || topic.votingCost;
                              (e.target.nextSibling as HTMLButtonElement).onclick = () => castVote(topic.id, option.id, coinsToSpend);
                            }}
                          />
                          <button
                            onClick={() => castVote(topic.id, option.id, topic.votingCost)}
                            disabled={userHasVoted || userBalance < topic.votingCost}
                            style={{
                              background: userHasVoted ? 'rgba(34, 197, 94, 0.3)' : 'linear-gradient(135deg, #06b6d4, #0369a1)',
                              color: 'white',
                              border: 'none',
                              padding: '6px 16px',
                              borderRadius: '6px',
                              cursor: userHasVoted ? 'default' : 'pointer',
                              fontSize: '0.9rem',
                              opacity: userBalance < topic.votingCost ? 0.5 : 1
                            }}
                          >
                            {userHasVoted ? '✅ Voted' : '🗳️ Vote'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityVoting;