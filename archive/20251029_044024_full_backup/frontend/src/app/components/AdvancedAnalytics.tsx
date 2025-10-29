
"use client";
import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  predictionAccuracy: {
    overall: number;
    bySport: { [key: string]: number };
    trend: number[];
  };
  engagement: {
    sessionsThisWeek: number;
    avgSessionTime: number;
    streakDays: number;
    totalPredictions: number;
  };
  earnings: {
    totalPiCoins: number;
    thisWeek: number;
    projectedMonthly: number;
    topSources: { source: string; amount: number }[];
  };
  performance: {
    rank: number;
    percentile: number;
    strongestSports: string[];
    improvementAreas: string[];
  };
}

const AdvancedAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    predictionAccuracy: {
      overall: 73.5,
      bySport: {
        'NBA': 78.2,
        'NFL': 71.4,
        'Soccer': 68.9,
        'MLB': 76.1
      },
      trend: [65, 68, 71, 73, 75, 74, 73.5]
    },
    engagement: {
      sessionsThisWeek: 14,
      avgSessionTime: 18.5,
      streakDays: 12,
      totalPredictions: 247
    },
    earnings: {
      totalPiCoins: 3420,
      thisWeek: 185,
      projectedMonthly: 740,
      topSources: [
        { source: 'Predictions', amount: 2100 },
        { source: 'Quizzes', amount: 850 },
        { source: 'Challenges', amount: 470 }
      ]
    },
    performance: {
      rank: 127,
      percentile: 85,
      strongestSports: ['NBA', 'MLB'],
      improvementAreas: ['Soccer', 'Tennis']
    }
  });

  const [selectedMetric, setSelectedMetric] = useState<'accuracy' | 'engagement' | 'earnings'>('accuracy');

  const renderChart = (data: number[], color: string) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'end',
        gap: '4px',
        height: '60px',
        padding: '10px 0'
      }}>
        {data.map((value, index) => {
          const height = range > 0 ? ((value - min) / range) * 50 + 10 : 30;
          return (
            <div
              key={index}
              style={{
                width: '100%',
                height: `${height}px`,
                background: `linear-gradient(to top, ${color}, ${color}88)`,
                borderRadius: '2px 2px 0 0',
                transition: 'all 0.3s ease'
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      margin: '20px 0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: '2rem',
          margin: '0',
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📊 Performance Analytics
        </h2>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['7d', '30d', '90d', '1y'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              style={{
                background: timeRange === range 
                  ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Accuracy Card */}
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <h3 style={{ color: '#22c55e', margin: 0, fontSize: '1.1rem' }}>
              🎯 Accuracy
            </h3>
            <span style={{
              background: '#22c55e',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.8rem'
            }}>
              +2.3%
            </span>
          </div>
          <div style={{
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            {analytics.predictionAccuracy.overall}%
          </div>
          {renderChart(analytics.predictionAccuracy.trend, '#22c55e')}
        </div>

        {/* Engagement Card */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <h3 style={{ color: '#3b82f6', margin: 0, fontSize: '1.1rem' }}>
              📈 Engagement
            </h3>
            <span style={{
              background: '#3b82f6',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.8rem'
            }}>
              {analytics.engagement.streakDays} days
            </span>
          </div>
          <div style={{
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            {analytics.engagement.avgSessionTime}m
          </div>
          <div style={{ color: '#93c5fd', fontSize: '0.9rem' }}>
            {analytics.engagement.sessionsThisWeek} sessions this week
          </div>
        </div>

        {/* Earnings Card */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <h3 style={{ color: '#f59e0b', margin: 0, fontSize: '1.1rem' }}>
              💰 Earnings
            </h3>
            <span style={{
              background: '#f59e0b',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.8rem'
            }}>
              +{analytics.earnings.thisWeek}
            </span>
          </div>
          <div style={{
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            π{analytics.earnings.totalPiCoins}
          </div>
          <div style={{ color: '#fcd34d', fontSize: '0.9rem' }}>
            Projected: π{analytics.earnings.projectedMonthly}/month
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Sport Performance Breakdown */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <h3 style={{ color: '#06b6d4', marginBottom: '16px' }}>
            🏆 Performance by Sport
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {Object.entries(analytics.predictionAccuracy.bySport).map(([sport, accuracy]) => (
              <div key={sport} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}>
                <span style={{ color: '#fff', fontWeight: '600' }}>{sport}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '100px',
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${accuracy}%`,
                      height: '100%',
                      background: accuracy > 75 ? '#22c55e' : accuracy > 65 ? '#f59e0b' : '#ef4444',
                      borderRadius: '3px'
                    }} />
                  </div>
                  <span style={{
                    color: accuracy > 75 ? '#22c55e' : accuracy > 65 ? '#f59e0b' : '#ef4444',
                    fontWeight: 'bold',
                    minWidth: '45px'
                  }}>
                    {accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking & Performance */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <h3 style={{ color: '#8b5cf6', marginBottom: '16px' }}>
            🏅 Your Ranking
          </h3>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              #{analytics.performance.rank}
            </div>
            <div style={{ color: '#a78bfa', fontSize: '1rem' }}>
              Top {100 - analytics.performance.percentile}% of users
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: '#22c55e', fontSize: '0.9rem', marginBottom: '8px' }}>
              🔥 Strong in:
            </div>
            {analytics.performance.strongestSports.map(sport => (
              <span
                key={sport}
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: '#22c55e',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  margin: '2px',
                  display: 'inline-block'
                }}
              >
                {sport}
              </span>
            ))}
          </div>

          <div>
            <div style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '8px' }}>
              📈 Focus on:
            </div>
            {analytics.performance.improvementAreas.map(sport => (
              <span
                key={sport}
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#f59e0b',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  margin: '2px',
                  display: 'inline-block'
                }}
              >
                {sport}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      }}>
        <h3 style={{ color: '#8b5cf6', marginBottom: '16px' }}>
          🤖 AI Performance Insights
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '16px',
            borderRadius: '12px'
          }}>
            <div style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '8px' }}>
              📊 Pattern Recognition
            </div>
            <p style={{ color: '#d1d5db', fontSize: '0.9rem', margin: 0 }}>
              Your accuracy peaks on Tuesday evenings. Consider timing your predictions accordingly.
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '16px',
            borderRadius: '12px'
          }}>
            <div style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '8px' }}>
              🎯 Recommendation
            </div>
            <p style={{ color: '#d1d5db', fontSize: '0.9rem', margin: 0 }}>
              Focus on NBA games for the next week. Your model shows 82% confidence in this area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdvancedAnalytics };
