"use client";

import React, { useState, useEffect } from 'react';

interface PredictionHistory {
  id: string;
  matchName: string;
  userPrediction: string;
  actualResult: string;
  confidence: number;
  sport: string;
  timestamp: Date;
  isCorrect: boolean;
  factors: {
    homeForm: number;
    awayForm: number;
    headToHead: number;
    injuries: string[];
  };
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: string;
  lessons: string[];
}

interface CoachInsight {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  actionable: string;
}

export function AICoachAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'learning' | 'insights'>('analysis');
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionHistory | null>(null);
  const [userStats, setUserStats] = useState({
    totalPredictions: 0,
    correctPredictions: 0,
    accuracy: 0,
    strongestSport: '',
    weakestSport: '',
    averageConfidence: 0
  });

  const [recentPredictions, setRecentPredictions] = useState<PredictionHistory[]>([
    {
      id: '1',
      matchName: 'Man City vs Arsenal',
      userPrediction: 'Home Win',
      actualResult: 'Draw',
      confidence: 75,
      sport: 'Football',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isCorrect: false,
      factors: {
        homeForm: 85,
        awayForm: 80,
        headToHead: 60,
        injuries: ['Haaland (doubt)']
      }
    },
    {
      id: '2',
      matchName: 'Lakers vs Warriors',
      userPrediction: 'Away Win',
      actualResult: 'Away Win',
      confidence: 82,
      sport: 'Basketball',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isCorrect: true,
      factors: {
        homeForm: 70,
        awayForm: 88,
        headToHead: 55,
        injuries: []
      }
    }
  ]);

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([
    {
      id: '1',
      title: 'Football Form Analysis',
      description: 'Master the art of analyzing team form and momentum',
      progress: 35,
      icon: '⚽',
      lessons: ['Recent results impact', 'Home vs Away performance', 'Momentum tracking']
    },
    {
      id: '2',
      title: 'Injury Impact Assessment',
      description: 'Learn to evaluate how injuries affect match outcomes',
      progress: 60,
      icon: '🏥',
      lessons: ['Key player identification', 'Depth analysis', 'Recovery timelines']
    },
    {
      id: '3',
      title: 'Head-to-Head Patterns',
      description: 'Understand historical matchup dynamics',
      progress: 20,
      icon: '📊',
      lessons: ['Pattern recognition', 'Psychological factors', 'Tactical matchups']
    }
  ]);

  const [coachInsights, setCoachInsights] = useState<CoachInsight[]>([
    {
      type: 'warning',
      title: 'Overconfidence Pattern Detected',
      message: 'Your predictions with 80%+ confidence have only 65% accuracy',
      actionable: 'Consider lowering confidence when multiple key factors are uncertain'
    },
    {
      type: 'success',
      title: 'Basketball Expertise Growing',
      message: 'Your basketball predictions are 12% more accurate than last month',
      actionable: 'Apply similar analysis techniques to other sports'
    },
    {
      type: 'info',
      title: 'Injury News Blind Spot',
      message: '40% of your incorrect predictions involved late injury changes',
      actionable: 'Check injury reports within 24 hours of match time'
    }
  ]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Calculate user statistics
    const total = recentPredictions.length;
    const correct = recentPredictions.filter(p => p.isCorrect).length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;

    setUserStats({
      totalPredictions: total,
      correctPredictions: correct,
      accuracy: Math.round(accuracy),
      strongestSport: 'Basketball',
      weakestSport: 'Football',
      averageConfidence: 78
    });
  }, [recentPredictions]);

  const analyzeWrongPrediction = (prediction: PredictionHistory) => {
    const reasons: string[] = [];

    if (prediction.confidence > 80) {
      reasons.push('Your confidence was very high, but key factors were overlooked');
    }

    if (prediction.factors.injuries.length > 0) {
      reasons.push(`Key injuries: ${prediction.factors.injuries.join(', ')} significantly impacted the result`);
    }

    if (Math.abs(prediction.factors.homeForm - prediction.factors.awayForm) < 10) {
      reasons.push('Teams were more evenly matched than your prediction suggested');
    }

    if (prediction.factors.headToHead < 50) {
      reasons.push('Historical head-to-head favored a different outcome');
    }

    return reasons;
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Coach Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: 'none',
          color: 'white',
          fontSize: '1.8rem',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(16, 185, 129, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.4)';
        }}
        title="AI Coach Assistant"
      >
        🎓
      </button>

      {/* Coach Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '30px',
          width: '450px',
          maxHeight: '600px',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98), rgba(31, 41, 55, 0.98))',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.3rem', fontWeight: 'bold' }}>
                🎓 AI Coach
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  opacity: 0.7
                }}
              >
                ✕
              </button>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                  {userStats.accuracy}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Accuracy</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {userStats.totalPredictions}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Predictions</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                  {userStats.averageConfidence}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Avg Confidence</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0 20px'
          }}>
            {(['analysis', 'learning', 'insights'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: activeTab === tab ? '#10b981' : '#9ca3af',
                  borderBottom: activeTab === tab ? '2px solid #10b981' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: activeTab === tab ? 'bold' : 'normal',
                  transition: 'all 0.3s ease'
                }}
              >
                {tab === 'analysis' && '📊 Analysis'}
                {tab === 'learning' && '📚 Learning'}
                {tab === 'insights' && '💡 Insights'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {activeTab === 'analysis' && (
              <div>
                <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '15px' }}>
                  Recent Predictions
                </h3>
                {recentPredictions.map(pred => (
                  <div
                    key={pred.id}
                    style={{
                      background: pred.isCorrect 
                        ? 'rgba(16, 185, 129, 0.1)' 
                        : 'rgba(239, 68, 68, 0.1)',
                      border: `1px solid ${pred.isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      borderRadius: '12px',
                      padding: '15px',
                      marginBottom: '12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedPrediction(pred)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ color: '#fff', fontWeight: '600' }}>{pred.matchName}</div>
                      <div style={{ color: pred.isCorrect ? '#10b981' : '#ef4444' }}>
                        {pred.isCorrect ? '✓' : '✗'}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                      Your: {pred.userPrediction} | Result: {pred.actualResult}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '5px' }}>
                      Confidence: {pred.confidence}%
                    </div>

                    {selectedPrediction?.id === pred.id && !pred.isCorrect && (
                      <div style={{
                        marginTop: '15px',
                        padding: '12px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px'
                      }}>
                        <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '8px' }}>
                          🔍 Why You Got This Wrong:
                        </div>
                        {analyzeWrongPrediction(pred).map((reason, idx) => (
                          <div key={idx} style={{
                            color: '#d1d5db',
                            fontSize: '0.85rem',
                            marginBottom: '5px',
                            paddingLeft: '10px'
                          }}>
                            • {reason}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'learning' && (
              <div>
                <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '15px' }}>
                  Suggested Learning Paths
                </h3>
                {learningPaths.map(path => (
                  <div
                    key={path.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '15px',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '1.8rem', marginRight: '12px' }}>{path.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#fff', fontWeight: '600', marginBottom: '3px' }}>
                          {path.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                          {path.description}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <div style={{
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${path.progress}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #10b981, #059669)',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
                        {path.progress}% Complete
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#d1d5db' }}>
                      {path.lessons.slice(0, 2).map((lesson, idx) => (
                        <div key={idx} style={{ marginBottom: '3px' }}>
                          • {lesson}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'insights' && (
              <div>
                <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '15px' }}>
                  Personalized Insights
                </h3>
                {coachInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: insight.type === 'success' ? 'rgba(16, 185, 129, 0.1)' :
                                 insight.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' :
                                 insight.type === 'error' ? 'rgba(239, 68, 68, 0.1)' :
                                 'rgba(59, 130, 246, 0.1)',
                      border: `1px solid ${
                        insight.type === 'success' ? 'rgba(16, 185, 129, 0.3)' :
                        insight.type === 'warning' ? 'rgba(245, 158, 11, 0.3)' :
                        insight.type === 'error' ? 'rgba(239, 68, 68, 0.3)' :
                        'rgba(59, 130, 246, 0.3)'
                      }`,
                      borderRadius: '12px',
                      padding: '15px',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{
                      color: insight.type === 'success' ? '#10b981' :
                             insight.type === 'warning' ? '#f59e0b' :
                             insight.type === 'error' ? '#ef4444' :
                             '#3b82f6',
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }}>
                      {insight.title}
                    </div>
                    <div style={{ color: '#d1d5db', fontSize: '0.85rem', marginBottom: '8px' }}>
                      {insight.message}
                    </div>
                    <div style={{
                      color: '#9ca3af',
                      fontSize: '0.8rem',
                      fontStyle: 'italic',
                      paddingLeft: '10px',
                      borderLeft: '2px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      💡 {insight.actionable}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}