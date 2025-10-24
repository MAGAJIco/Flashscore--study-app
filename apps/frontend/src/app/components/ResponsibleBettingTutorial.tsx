"use client";
import React, { useState, useEffect } from 'react';

interface ResponsibleBettingTutorialProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const ResponsibleBettingTutorial: React.FC<ResponsibleBettingTutorialProps> = ({
  isOpen,
  onAccept,
  onDecline
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [hasReadAll, setHasReadAll] = useState(false);
  const [scrollPositions, setScrollPositions] = useState<{ [key: number]: boolean }>({});
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const sections = [
    {
      title: "🎯 What is Sports Prediction?",
      content: `Sports prediction involves analyzing data and statistics to forecast the outcome of sporting events. While our platform uses AI and advanced analytics, it's important to understand that:

• No prediction is 100% accurate
• Sports outcomes can be unpredictable
• Past performance doesn't guarantee future results
• Our predictions are for entertainment and educational purposes

Remember: This platform is designed for fun, learning, and community engagement around sports analytics.`
    },
    {
      title: "💰 Understanding Pi Coins",
      content: `Pi Coins on our platform are virtual credits used for:

• Participating in quizzes and challenges
• Unlocking premium features
• Competing in community events
• Learning about sports analytics

Important Notes:
• Pi Coins have no real-world monetary value
• They cannot be converted to real money
• They are earned through platform activities
• Use them responsibly for educational entertainment`
    },
    {
      title: "⚖️ Responsible Gaming Principles",
      content: `We promote responsible engagement with sports predictions:

1. SET LIMITS
   • Decide how much time you'll spend on the platform
   • Take regular breaks from predictions and analysis

2. KEEP IT FUN
   • Remember this is entertainment, not investment advice
   • Don't let predictions affect your mood or relationships

3. LEARN AND GROW
   • Use predictions as learning opportunities
   • Understand the analytics behind our recommendations

4. STAY IN CONTROL
   • Never feel pressured to participate
   • You can pause or stop using the platform anytime`
    },
    {
      title: "🚨 Warning Signs to Watch For",
      content: `If you experience any of these, please consider taking a break:

• Spending excessive time analyzing predictions
• Feeling anxious about prediction outcomes
• Neglecting work, family, or social activities
• Using predictions to make real financial decisions
• Becoming obsessed with winning challenges

Remember: Sports predictions should enhance your enjoyment of sports, not create stress or problems in your life.`
    },
    {
      title: "🆘 Getting Help",
      content: `If you need support or feel you're developing unhealthy patterns:

IMMEDIATE RESOURCES:
• National Problem Gambling Helpline: 1-800-522-4700
• Crisis Text Line: Text HOME to 741741
• National Suicide Prevention Lifeline: 988

PLATFORM SUPPORT:
• Contact our support team for account restrictions
• Use our "Take a Break" feature in settings
• Access our educational resources and tutorials

PROFESSIONAL HELP:
• Speak with a counselor or therapist
• Contact your healthcare provider
• Visit gambling addiction support groups

Remember: Seeking help is a sign of strength, not weakness. We're here to support your well-being above all else.`
    },
    {
      title: "Get Help",
      content: `If you need support with responsible gaming:

NATIONAL RESOURCES:
• National Problem Gambling Helpline: 1-800-522-4700
• Gamblers Anonymous: www.gamblersanonymous.org
• National Council on Problem Gambling: ncpgambling.org

PLATFORM FEATURES:
• Self-exclusion options in settings
• Time limit reminders
• Cool-down periods for challenges
• Educational resources about sports analytics

REMEMBER: Seeking help is a sign of strength, not weakness. Our community supports responsible engagement with sports predictions.`
    }
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPercentage = (element.scrollTop + element.clientHeight) / element.scrollHeight;

    if (scrollPercentage >= 0.9) {
      setScrollPositions(prev => ({ ...prev, [currentSection]: true }));
    }
  };

  const canProceed = scrollPositions[currentSection] || sections[currentSection].content.length < 500;
  const allSectionsRead = Object.keys(scrollPositions).length >= sections.length - 1;

  useEffect(() => {
    if (allSectionsRead && timeSpent >= 30) {
      setHasReadAll(true);
    }
  }, [allSectionsRead, timeSpent]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.98)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        border: '2px solid #e5e7eb',
        width: '100%',
        maxWidth: '800px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '2px solid #f3f4f6',
          background: 'linear-gradient(135deg, #1f2937, #374151)',
          color: 'white'
        }}>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '1.8rem',
            fontWeight: '700'
          }}>
            Responsible Sports Prediction Guidelines
          </h2>
          <p style={{
            margin: '0',
            opacity: 0.9,
            fontSize: '1rem'
          }}>
            Please read through all sections before proceeding
          </p>

          {/* Progress Bar */}
          <div style={{
            marginTop: '16px',
            background: 'rgba(255, 255, 255, 0.2)',
            height: '6px',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentSection + 1) / sections.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10b981, #06d6a0)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Section Navigation */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSection(index)}
                  disabled={index > currentSection && !scrollPositions[index - 1]}
                  style={{
                    padding: '8px 16px',
                    border: '2px solid',
                    borderColor: currentSection === index ? '#3b82f6' : 
                                scrollPositions[index] ? '#10b981' : '#d1d5db',
                    borderRadius: '20px',
                    background: currentSection === index ? '#3b82f6' : 
                               scrollPositions[index] ? '#10b981' : 'white',
                    color: currentSection === index || scrollPositions[index] ? 'white' : '#6b7280',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: (index <= currentSection || scrollPositions[index - 1]) ? 'pointer' : 'not-allowed',
                    opacity: (index <= currentSection || scrollPositions[index - 1]) ? 1 : 0.5,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {index + 1}
                  {scrollPositions[index] && ' ✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Section Content */}
          <div 
            style={{
              flex: 1,
              padding: '24px',
              overflow: 'auto'
            }}
            onScroll={handleScroll}
          >
            <h3 style={{
              color: '#1f2937',
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {sections[currentSection].title}
              {scrollPositions[currentSection] && (
                <span style={{ color: '#10b981', fontSize: '1.2rem' }}>✓</span>
              )}
            </h3>

            <div style={{
              color: '#374151',
              fontSize: '1.1rem',
              lineHeight: '1.7',
              whiteSpace: 'pre-line',
              marginBottom: '40px'
            }}>
              {sections[currentSection].content}
            </div>

            {!canProceed && (
              <div style={{
                padding: '16px',
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                color: '#92400e',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                Please scroll to the bottom to continue reading
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px',
          borderTop: '2px solid #f3f4f6',
          background: '#f9fafb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#6b7280'
          }}>
            Time spent reading: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
            {timeSpent < 30 && ' (minimum 30 seconds required)'}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onDecline}
              style={{
                padding: '12px 24px',
                border: '2px solid #dc2626',
                borderRadius: '8px',
                background: 'white',
                color: '#dc2626',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              I Do Not Accept
            </button>

            {currentSection < sections.length - 1 ? (
              <button
                onClick={() => setCurrentSection(prev => prev + 1)}
                disabled={!canProceed}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  background: canProceed ? '#3b82f6' : '#d1d5db',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: canProceed ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                Next Section →
              </button>
            ) : (
              <button
                onClick={onAccept}
                disabled={!hasReadAll}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  background: hasReadAll ? '#10b981' : '#d1d5db',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: hasReadAll ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                I Accept & Understand ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ResponsibleBettingTutorial };