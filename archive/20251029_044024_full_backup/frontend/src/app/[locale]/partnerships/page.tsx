
'use client';

import React, { useState } from 'react';

interface Partnership {
  id: string;
  type: 'data_provider' | 'content_distributor' | 'betting_operator' | 'media_company';
  name: string;
  description: string;
  benefits: string[];
  requirements: string[];
  revenue_share?: number;
  contact: string;
}

export default function PartnershipsPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showContactForm, setShowContactForm] = useState<Partnership | null>(null);

  const partnerships: Partnership[] = [
    {
      id: 'goal_com',
      type: 'media_company',
      name: 'Goal.com Integration',
      description: 'Provide AI predictions and analytics to Goal.com\'s 50M+ monthly users',
      benefits: [
        'Access to 50M+ monthly users',
        'Premium brand association',
        'Revenue share: 15% of subscription conversions',
        'Co-marketing opportunities'
      ],
      requirements: [
        'Enterprise API access',
        'Real-time data feeds',
        'Custom white-label solution',
        'Multi-language support'
      ],
      revenue_share: 15,
      contact: 'partnerships@goal.com'
    },
    {
      id: 'espn_digital',
      type: 'media_company',
      name: 'ESPN Digital Services',
      description: 'Power ESPN\'s prediction features with our AI engine',
      benefits: [
        'Global reach across ESPN platforms',
        'Integration with ESPN Fantasy',
        'Revenue share: 20% of premium features',
        'Access to ESPN\'s data insights'
      ],
      requirements: [
        'High-availability infrastructure',
        'Custom analytics dashboard',
        'Mobile SDK integration',
        'Compliance with ESPN standards'
      ],
      revenue_share: 20,
      contact: 'tech.partnerships@espn.com'
    },
    {
      id: 'betting_operators',
      type: 'betting_operator',
      name: 'Licensed Betting Operators',
      description: 'Provide prediction data to licensed sportsbooks',
      benefits: [
        'Revenue share: 25% of betting volume',
        'Access to professional betting markets',
        'Regulatory compliance support',
        'High-value user acquisition'
      ],
      requirements: [
        'Gambling license verification',
        'Responsible gambling integration',
        'Real-time odds integration',
        'KYC compliance'
      ],
      revenue_share: 25,
      contact: 'business@sportscentral.app'
    },
    {
      id: 'data_providers',
      type: 'data_provider',
      name: 'Sports Data Providers',
      description: 'Partner with Opta, Stats Perform, and other data providers',
      benefits: [
        'Enhanced data accuracy',
        'Exclusive data access',
        'Cost-effective data licensing',
        'Priority technical support'
      ],
      requirements: [
        'Data quality standards',
        'Real-time processing capability',
        'Scalable infrastructure',
        'Data security compliance'
      ],
      contact: 'data.partnerships@sportscentral.app'
    }
  ];

  const apiTiers = [
    {
      name: 'Basic Partner',
      price: '$99/month',
      requests: '10,000/month',
      features: ['Basic predictions', 'Live scores', 'Standard support'],
      target: 'Small sports apps, blogs'
    },
    {
      name: 'Professional',
      price: '$499/month',
      requests: '100,000/month',
      features: ['Advanced predictions', 'Odds data', 'Analytics', 'Priority support'],
      target: 'Medium sports platforms'
    },
    {
      name: 'Enterprise',
      price: '$2,499/month',
      requests: '1M+/month',
      features: ['Full API access', 'Custom endpoints', 'White-label', '24/7 support'],
      target: 'Major sports media, betting operators'
    }
  ];

  const filteredPartnerships = selectedType === 'all' 
    ? partnerships 
    : partnerships.filter(p => p.type === selectedType);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      padding: '2rem',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            Partnership Opportunities
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>
            Join the future of sports prediction technology
          </p>
        </div>

        {/* API Pricing Tiers */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
            API Partnership Tiers
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {apiTiers.map((tier, index) => (
              <div key={tier.name} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                borderRadius: '16px',
                border: index === 1 ? '2px solid #00ff88' : '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative'
              }}>
                {index === 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{tier.name}</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00ff88', marginBottom: '1rem' }}>
                  {tier.price}
                </div>
                <div style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                  {tier.requests} API requests
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  {tier.features.map(feature => (
                    <div key={feature} style={{ padding: '0.25rem 0', fontSize: '0.9rem' }}>
                      ✓ {feature}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Perfect for: {tier.target}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Filter */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['all', 'media_company', 'betting_operator', 'data_provider', 'content_distributor'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedType === type 
                    ? 'linear-gradient(135deg, #00ff88, #00a2ff)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontSize: '0.9rem'
                }}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Partnership Opportunities */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          {filteredPartnerships.map(partnership => (
            <div key={partnership.id} style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#00ff88' }}>
                {partnership.name}
              </h3>
              <p style={{ marginBottom: '1.5rem', color: '#cbd5e1' }}>
                {partnership.description}
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#00a2ff' }}>
                  Benefits:
                </h4>
                {partnership.benefits.map(benefit => (
                  <div key={benefit} style={{ fontSize: '0.9rem', padding: '0.2rem 0' }}>
                    • {benefit}
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#00a2ff' }}>
                  Requirements:
                </h4>
                {partnership.requirements.map(req => (
                  <div key={req} style={{ fontSize: '0.9rem', padding: '0.2rem 0' }}>
                    • {req}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowContactForm(partnership)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Start Partnership Discussion
              </button>
            </div>
          ))}
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              padding: '2rem',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>
                Partnership Interest: {showContactForm.name}
              </h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                />
                <input
                  type="text"
                  placeholder="Company"
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                />
                <textarea
                  placeholder="Tell us about your integration plans..."
                  rows={4}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Send Partnership Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(null)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'transparent',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
