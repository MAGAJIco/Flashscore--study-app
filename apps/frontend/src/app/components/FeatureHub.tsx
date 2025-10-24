"use client";
import React, { useState, useEffect } from 'react';
import { systemOptimizerInstance, paymentManagerInstance, emailManagerInstance, crudManagerInstance } from '@magajico/shared/utils';
import { useMobile } from '@hooks/useMobile';

interface FeatureGroup {
  id: string;
  title: string;
  icon: string;
  color: string;
  features: Feature[];
}

interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'beta';
  usage: number;
  performance: number;
}

const FeatureHub: React.FC = () => {
  const isMobile = useMobile();
  const [activeGroup, setActiveGroup] = useState<string>('payments');
  const [searchQuery, setSearchQuery] = useState('');
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [featureGroups, setFeatureGroups] = useState<FeatureGroup[]>([]);

  useEffect(() => {
    loadFeatureData();
    loadSystemHealth();
  }, []);

  const loadFeatureData = () => {
    const groups: FeatureGroup[] = [
      {
        id: 'payments',
        title: 'Payment System',
        icon: '💳',
        color: 'from-green-500 to-emerald-600',
        features: [
          {
            id: 'pi-network',
            name: 'Pi Network Integration',
            description: 'Native Pi cryptocurrency payments',
            status: 'active',
            usage: 85,
            performance: 92
          },
          {
            id: 'paypal',
            name: 'PayPal Gateway',
            description: 'Traditional payment processing',
            status: 'active',
            usage: 65,
            performance: 88
          },
          {
            id: 'stripe',
            name: 'Stripe Integration',
            description: 'Card payments and subscriptions',
            status: 'beta',
            usage: 45,
            performance: 95
          },
          {
            id: 'wallet',
            name: 'Pi Coin Wallet',
            description: 'Internal coin management system',
            status: 'active',
            usage: 90,
            performance: 89
          }
        ]
      },
      {
        id: 'email',
        title: 'Email System',
        icon: '📧',
        color: 'from-blue-500 to-cyan-600',
        features: [
          {
            id: 'templates',
            name: 'Email Templates',
            description: 'Pre-designed email templates',
            status: 'active',
            usage: 78,
            performance: 94
          },
          {
            id: 'notifications',
            name: 'Smart Notifications',
            description: 'Automated email notifications',
            status: 'active',
            usage: 82,
            performance: 91
          },
          {
            id: 'campaigns',
            name: 'Email Campaigns',
            description: 'Bulk email marketing',
            status: 'beta',
            usage: 35,
            performance: 87
          },
          {
            id: 'analytics',
            name: 'Email Analytics',
            description: 'Open rates and engagement tracking',
            status: 'active',
            usage: 60,
            performance: 93
          }
        ]
      },
      {
        id: 'data',
        title: 'Data Management',
        icon: '🗄️',
        color: 'from-purple-500 to-indigo-600',
        features: [
          {
            id: 'crud-api',
            name: 'CRUD Operations',
            description: 'Optimized database operations',
            status: 'active',
            usage: 95,
            performance: 96
          },
          {
            id: 'caching',
            name: 'Smart Caching',
            description: 'Intelligent data caching system',
            status: 'active',
            usage: 88,
            performance: 94
          },
          {
            id: 'batch-ops',
            name: 'Batch Operations',
            description: 'Bulk data processing',
            status: 'active',
            usage: 70,
            performance: 92
          },
          {
            id: 'search',
            name: 'Advanced Search',
            description: 'Full-text search capabilities',
            status: 'beta',
            usage: 55,
            performance: 89
          }
        ]
      },
      {
        id: 'optimization',
        title: 'System Optimization',
        icon: '⚡',
        color: 'from-orange-500 to-red-600',
        features: [
          {
            id: 'performance',
            name: 'Performance Monitor',
            description: 'Real-time performance tracking',
            status: 'active',
            usage: 75,
            performance: 97
          },
          {
            id: 'analytics',
            name: 'System Analytics',
            description: 'Usage and performance analytics',
            status: 'active',
            usage: 68,
            performance: 95
          },
          {
            id: 'optimization',
            name: 'Auto Optimization',
            description: 'Automated system optimizations',
            status: 'beta',
            usage: 40,
            performance: 91
          },
          {
            id: 'alerts',
            name: 'Smart Alerts',
            description: 'Proactive system monitoring',
            status: 'active',
            usage: 72,
            performance: 93
          }
        ]
      }
    ];

    setFeatureGroups(groups);
  };

  const loadSystemHealth = async () => {
    try {
      const health = systemOptimizerInstance.getSystemHealth();
      setSystemHealth(health);
    } catch (error) {
      console.error('Error loading system health:', error);
    }
  };

  const handleFeatureSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const results = systemOptimizerInstance.search(query);
      console.log('Search results:', results);
    }
  };

  const testPaymentSystem = async () => {
    try {
      const result = await paymentManagerInstance.processPayment({
        amount: 10,
        currency: 'USD',
        provider: 'pi_network',
        userId: 'test_user',
        description: 'Test payment'
      });

      alert(result.success ? 'Payment test successful!' : `Payment failed: ${result.error}`);
    } catch (error) {
      alert('Payment test error');
    }
  };

  const testEmailSystem = async () => {
    try {
      const success = await emailManagerInstance.sendTemplatedEmail(
        'welcome',
        'test@example.com',
        {
          username: 'Test User',
          welcomeBonus: 50,
          appUrl: window.location.origin
        }
      );

      alert(success ? 'Email test successful!' : 'Email test failed');
    } catch (error) {
      alert('Email test error');
    }
  };

  const testCRUDSystem = async () => {
    try {
      const health = await crudManagerInstance.healthCheck();
      alert(`CRUD system health: ${health.status}`);
    } catch (error) {
      alert('CRUD test error');
    }
  };

  const FeatureCard = ({ feature }: { feature: Feature }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <h4 style={{ margin: 0, color: '#fff', fontSize: '14px' }}>
          {feature.name}
        </h4>
        <div style={{
          background: feature.status === 'active' ? '#22c55e' : 
                     feature.status === 'beta' ? '#f59e0b' : '#6b7280',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '10px',
          textTransform: 'uppercase'
        }}>
          {feature.status}
        </div>
      </div>

      <p style={{
        margin: '0 0 12px 0',
        color: '#aaa',
        fontSize: '12px',
        lineHeight: '1.4'
      }}>
        {feature.description}
      </p>

      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <span style={{ fontSize: '10px', color: '#aaa' }}>Usage</span>
            <span style={{ fontSize: '10px', color: '#00ff88' }}>{feature.usage}%</span>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            height: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #00ff88, #00a2ff)',
              width: `${feature.usage}%`,
              height: '100%'
            }} />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <span style={{ fontSize: '10px', color: '#aaa' }}>Performance</span>
            <span style={{ fontSize: '10px', color: '#00ff88' }}>{feature.performance}%</span>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            height: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
              width: `${feature.performance}%`,
              height: '100%'
            }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: '#ffffff',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h1 style={{
          margin: '0 0 16px 0',
          fontSize: isMobile ? '20px' : '24px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🎯 Feature Management Hub
        </h1>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Search features, components, or services..."
            value={searchQuery}
            onChange={(e) => handleFeatureSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#fff',
              fontSize: '14px'
            }}
          />
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#aaa'
          }}>
            🔍
          </div>
        </div>

        {/* System Health */}
        {systemHealth && (
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: systemHealth.status === 'healthy' ? 'rgba(34, 197, 94, 0.2)' : 
                         systemHealth.status === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 
                         'rgba(239, 68, 68, 0.2)',
              padding: '8px 12px',
              borderRadius: '20px',
              border: `1px solid ${systemHealth.status === 'healthy' ? '#22c55e' : 
                                   systemHealth.status === 'warning' ? '#f59e0b' : '#ef4444'}`
            }}>
              <span style={{ fontSize: '12px' }}>
                {systemHealth.status === 'healthy' ? '✅' : 
                 systemHealth.status === 'warning' ? '⚠️' : '❌'}
              </span>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>
                System {systemHealth.status}
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#aaa' }}>
              Load Time: {systemHealth.metrics.loadTime}ms | 
              Cache Hit Rate: {(systemHealth.metrics.cacheHitRate * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {/* Feature Group Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {featureGroups.map(group => (
          <button
            key={group.id}
            onClick={() => setActiveGroup(group.id)}
            style={{
              background: activeGroup === group.id 
                ? `linear-gradient(135deg, ${group.color.split(' ')[1]} 0%, ${group.color.split(' ')[3]} 100%)`
                : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '12px',
              padding: isMobile ? '8px 12px' : '12px 16px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{group.icon}</span>
            {!isMobile && <span>{group.title}</span>}
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <button
          onClick={testPaymentSystem}
          style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>💳</span>
          Test Payment System
        </button>

        <button
          onClick={testEmailSystem}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>📧</span>
          Test Email System
        </button>

        <button
          onClick={testCRUDSystem}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>🗄️</span>
          Test CRUD System
        </button>
      </div>

      {/* Feature Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {featureGroups
          .find(group => group.id === activeGroup)
          ?.features.map(feature => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
      </div>
    </div>
  );
};

export { FeatureHub };