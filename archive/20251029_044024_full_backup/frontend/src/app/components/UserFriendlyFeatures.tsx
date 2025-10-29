"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '@utils/clientStorage';
import { useAuth } from '@hooks/useAuth';

interface UserFriendlyFeaturesProps {
  currentUser: any;
  isMobile: boolean;
}

const UserFriendlyFeatures: React.FC<UserFriendlyFeaturesProps> = ({
  currentUser,
  isMobile
}) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [quickAccessOpen, setQuickAccessOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    oneHandMode: false
  });

  useEffect(() => {
    const saved = ClientStorage.getItem('user_friendly_preferences', userPreferences);
    setUserPreferences(saved);
    applyAccessibilitySettings(saved);
  }, []);

  const applyAccessibilitySettings = (prefs: typeof userPreferences) => {
    const root = document.documentElement;

    // Font size
    root.style.setProperty('--user-font-size', 
      prefs.fontSize === 'large' ? '1.2em' : 
      prefs.fontSize === 'small' ? '0.9em' : '1em'
    );

    // High contrast
    if (prefs.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (prefs.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // One-hand mode for mobile
    if (prefs.oneHandMode && isMobile) {
      root.classList.add('one-hand-mode');
    } else {
      root.classList.remove('one-hand-mode');
    }
  };

  const updatePreference = (key: keyof typeof userPreferences, value: any) => {
    const updated = { ...userPreferences, [key]: value };
    setUserPreferences(updated);
    ClientStorage.setItem('user_friendly_preferences', updated);
    applyAccessibilitySettings(updated);
  };

  // Feature 1: Smart Quick Actions
  const QuickActionsPanel = () => (
    <div style={{
      position: 'fixed',
      bottom: isMobile ? '80px' : '20px',
      right: '20px',
      zIndex: 999,
      display: quickAccessOpen ? 'block' : 'none',
      maxWidth: isMobile ? 'calc(100vw - 40px)' : '250px'
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(15px)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        minWidth: '200px'
      }}>
        <h4 style={{ color: '#22c55e', margin: '0 0 12px 0', fontSize: '1rem' }}>
          ⚡ Quick Actions
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#22c55e',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}
          >
            🔝 Back to Top
          </button>

          <button
            onClick={() => {
              const quizSection = document.querySelector('[data-section="quiz"]');
              quizSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#3b82f6',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}
          >
            🧠 Quick Quiz
          </button>

          <button
            onClick={() => setActiveFeature('help')}
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}
          >
            ❓ Need Help?
          </button>
        </div>
      </div>
    </div>
  );

  // Feature 2: Interactive Tutorial System
  const InteractiveTutorial = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showTutorial, setShowTutorial] = useState(false);

    const tutorialSteps = [
      {
        title: "Welcome to Sports Central! 🎉",
        content: "Let's take a quick tour to help you get started with predictions and earning Pi coins.",
        target: null
      },
      {
        title: "Make Your First Prediction 🔮",
        content: "Click on any match to make a prediction. Our AI will help guide you!",
        target: ".predictions-table"
      },
      {
        title: "Take a Quiz 🧠",
        content: "Test your sports knowledge and earn Pi coins by completing quizzes.",
        target: "[data-section='quiz']"
      },
      {
        title: "Check Your Wallet 💰",
        content: "View your Pi coin balance and transaction history here.",
        target: ".pi-coin-display"
      }
    ];

    if (!showTutorial) {
      return (
        <button
          onClick={() => setShowTutorial(true)}
          style={{
            position: 'fixed',
            top: isMobile ? '80px' : '100px',
            right: '20px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '1.5rem',
            zIndex: 998,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}
          title="Take Tutorial"
        >
          🎓
        </button>
      );
    }

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          color: '#fff'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>
            {tutorialSteps[currentStep].title.split(' ')[0]}
          </div>

          <h3 style={{ margin: '0 0 16px 0', color: '#22c55e' }}>
            {tutorialSteps[currentStep].title}
          </h3>

          <p style={{ margin: '0 0 24px 0', lineHeight: '1.5', color: '#d1fae5' }}>
            {tutorialSteps[currentStep].content}
          </p>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '12px'
          }}>
            <button
              onClick={() => setShowTutorial(false)}
              style={{
                background: 'transparent',
                color: '#9ca3af',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Skip
            </button>

            <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              {currentStep + 1} of {tutorialSteps.length}
            </div>

            <button
              onClick={() => {
                if (currentStep < tutorialSteps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  setShowTutorial(false);
                }
              }}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Feature 3: Smart Help System
  const SmartHelpSystem = () => {
    const [helpQuery, setHelpQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const helpTopics = {
      'make prediction': 'To make a prediction, click on any match in the predictions table and select your choice.',
      'earn pi coins': 'Earn Pi coins by completing quizzes, making accurate predictions, and daily logins.',
      'quiz help': 'Take quizzes to test your knowledge and earn rewards. Perfect scores give bonus coins!',
      'wallet': 'View your Pi coin balance by clicking the wallet icon in the top navigation.',
      'notifications': 'Enable notifications to get alerts about match results and new opportunities.',
      'account': 'Manage your account settings and preferences through the user menu.'
    };

    useEffect(() => {
      if (helpQuery.length > 2) {
        const matches = Object.keys(helpTopics).filter(topic =>
          topic.includes(helpQuery.toLowerCase())
        );
        setSuggestions(matches.slice(0, 3));
      } else {
        setSuggestions([]);
      }
    }, [helpQuery]);

    if (activeFeature !== 'help') return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '500px',
          width: '90%',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#f59e0b' }}>🤖 Smart Help</h2>
            <button
              onClick={() => setActiveFeature(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          <input
            type="text"
            placeholder="What do you need help with?"
            value={helpQuery}
            onChange={(e) => setHelpQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '16px',
              marginBottom: '16px'
            }}
          />

          {suggestions.length > 0 && (
            <div>
              <h4 style={{ color: '#22c55e', marginBottom: '12px' }}>💡 Suggestions:</h4>
              {suggestions.map(topic => (
                <div
                  key={topic}
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setHelpQuery(topic)}
                >
                  <strong style={{ color: '#22c55e' }}>{topic}</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#d1fae5' }}>
                    {helpTopics[topic as keyof typeof helpTopics]}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <h4 style={{ color: '#3b82f6', marginBottom: '12px' }}>📚 Popular Topics:</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              {Object.entries(helpTopics).slice(0, 3).map(([topic, answer]) => (
                <button
                  key={topic}
                  onClick={() => setHelpQuery(topic)}
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#3b82f6',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.9rem'
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Feature 4: Accessibility Controls
  const AccessibilityPanel = () => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      margin: '20px 0'
    }}>
      <h3 style={{ color: '#8b5cf6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ♿ Accessibility Settings
      </h3>

      <div style={{ display: 'grid', gap: '16px' }}>
        {/* Font Size */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
            🔤 Font Size
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['small', 'medium', 'large'].map(size => (
              <button
                key={size}
                onClick={() => updatePreference('fontSize', size)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: userPreferences.fontSize === size 
                    ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ color: '#fff', fontWeight: '600' }}>
            🌈 High Contrast Mode
          </label>
          <button
            onClick={() => updatePreference('highContrast', !userPreferences.highContrast)}
            style={{
              width: '50px',
              height: '26px',
              borderRadius: '13px',
              border: 'none',
              background: userPreferences.highContrast 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                : 'rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: '3px',
              left: userPreferences.highContrast ? '27px' : '3px',
              transition: 'left 0.2s ease'
            }} />
          </button>
        </div>

        {/* Reduced Motion */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ color: '#fff', fontWeight: '600' }}>
            🎭 Reduce Animation
          </label>
          <button
            onClick={() => updatePreference('reducedMotion', !userPreferences.reducedMotion)}
            style={{
              width: '50px',
              height: '26px',
              borderRadius: '13px',
              border: 'none',
              background: userPreferences.reducedMotion 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                : 'rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: '3px',
              left: userPreferences.reducedMotion ? '27px' : '3px',
              transition: 'left 0.2s ease'
            }} />
          </button>
        </div>

        {/* One-Hand Mode (Mobile only) */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ color: '#fff', fontWeight: '600' }}>
              👍 One-Hand Mode
            </label>
            <button
              onClick={() => updatePreference('oneHandMode', !userPreferences.oneHandMode)}
              style={{
                width: '50px',
                height: '26px',
                borderRadius: '13px',
                border: 'none',
                background: userPreferences.oneHandMode 
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                  : 'rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: userPreferences.oneHandMode ? '27px' : '3px',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Feature 5: Progress Tracker
  const ProgressTracker = () => {
    const [userProgress] = useState({
      predictionsLevel: 3,
      predictionsXP: 750,
      predictionsNextLevel: 1000,
      quizLevel: 2,
      quizXP: 400,
      quizNextLevel: 500,
      weeklyGoal: 80,
      weeklyProgress: 65
    });

    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#06b6d4', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📊 Your Progress
        </h3>

        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Predictions Progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#fff', fontWeight: '600' }}>🔮 Predictions</span>
              <span style={{ color: '#22c55e', fontSize: '0.9rem' }}>Level {userProgress.predictionsLevel}</span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                height: '100%',
                width: `${(userProgress.predictionsXP / userProgress.predictionsNextLevel) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>
              {userProgress.predictionsXP} / {userProgress.predictionsNextLevel} XP
            </div>
          </div>

          {/* Quiz Progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#fff', fontWeight: '600' }}>🧠 Quiz Master</span>
              <span style={{ color: '#3b82f6', fontSize: '0.9rem' }}>Level {userProgress.quizLevel}</span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                height: '100%',
                width: `${(userProgress.quizXP / userProgress.quizNextLevel) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>
              {userProgress.quizXP} / {userProgress.quizNextLevel} XP
            </div>
          </div>

          {/* Weekly Goal */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#fff', fontWeight: '600' }}>🎯 Weekly Goal</span>
              <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>
                {userProgress.weeklyProgress}%
              </span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                height: '100%',
                width: `${userProgress.weeklyProgress}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>
              Keep going! {100 - userProgress.weeklyProgress}% to go
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Feature 6: Smart Shortcuts
  const SmartShortcuts = () => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      margin: '20px 0'
    }}>
      <h3 style={{ color: '#ef4444', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ⌨️ Keyboard Shortcuts
      </h3>

      <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1fae5' }}>
          <span>Quick Quiz</span>
          <kbd style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '2px 6px', 
            borderRadius: '4px',
            color: '#fff'
          }}>
            Q
          </kbd>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1fae5' }}>
          <span>Search</span>
          <kbd style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '2px 6px', 
            borderRadius: '4px',
            color: '#fff'
          }}>
            /
          </kbd>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1fae5' }}>
          <span>Help</span>
          <kbd style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '2px 6px', 
            borderRadius: '4px',
            color: '#fff'
          }}>
            ?
          </kbd>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1fae5' }}>
          <span>Toggle Theme</span>
          <kbd style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '2px 6px', 
            borderRadius: '4px',
            color: '#fff'
          }}>
            T
          </kbd>
        </div>
      </div>
    </div>
  );

  // Feature 7: Contextual Tips
  const ContextualTips = () => {
    const [currentTip, setCurrentTip] = useState(0);
    const tips = [
      {
        icon: '💡',
        title: 'Pro Tip',
        content: 'Make predictions early in the day for better odds and more time to research!'
      },
      {
        icon: '🎯',
        title: 'Smart Strategy',
        content: 'Focus on sports you know well. Accuracy matters more than quantity for Pi coins.'
      },
      {
        icon: '🏆',
        title: 'Achievement Hunter',
        content: 'Complete daily quizzes to maintain your streak and unlock bonus rewards.'
      },
      {
        icon: '📊',
        title: 'Data Insight',
        content: 'Check team form and head-to-head stats before making your predictions.'
      }
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
      }, 10000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(6, 182, 212, 0.1))',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        margin: '20px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            fontSize: '2rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {tips[currentTip].icon}
          </div>

          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 4px 0', color: '#22c55e', fontSize: '1rem' }}>
              {tips[currentTip].title}
            </h4>
            <p style={{ margin: '0', color: '#d1fae5', fontSize: '0.9rem', lineHeight: '1.4' }}>
              {tips[currentTip].content}
            </p>
          </div>
        </div>

        {/* Progress dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '12px'
        }}>
          {tips.map((_, index) => (
            <div
              key={index}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: index === currentTip ? '#22c55e' : 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  // Feature 15: Advanced Personalization Engine
  const AdvancedPersonalization = () => {
    const [personalizationData] = useState({
      favoriteTeams: ['Lakers', 'Chiefs', 'Arsenal'],
      preferredSports: ['NBA', 'NFL', 'Soccer'],
      predictionAccuracy: 78,
      engagementScore: 92,
      contentPreferences: {
        newsType: 'Analysis',
        predictionStyle: 'Conservative',
        difficultyLevel: 'Advanced'
      }
    });

    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#a855f7', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🧠 Personalized Experience
        </h3>

        <div style={{ display: 'grid', gap: '16px' }}>
          {/* AI Content Curation */}
          <div style={{
            background: 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <h4 style={{ color: '#a855f7', marginBottom: '8px', fontSize: '1rem' }}>
              🎯 AI Content Curation
            </h4>
            <div style={{ fontSize: '0.9rem', color: '#d1d5db' }}>
              <p>Based on your {personalizationData.predictionAccuracy}% accuracy rate:</p>
              <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                <li>Advanced NBA analysis recommended</li>
                <li>Conservative NFL predictions suggested</li>
                <li>Soccer tactical breakdowns prioritized</li>
              </ul>
            </div>
          </div>

          {/* Personalized Dashboard */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <h4 style={{ color: '#3b82f6', marginBottom: '8px', fontSize: '1rem' }}>
              📊 Custom Dashboard Layout
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {personalizationData.favoriteTeams.map(team => (
                <div
                  key={team}
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                    padding: '8px',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: '#93c5fd'
                  }}
                >
                  {team}
                </div>
              ))}
            </div>
          </div>

          {/* Smart Notifications */}
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            <h4 style={{ color: '#22c55e', marginBottom: '8px', fontSize: '1rem' }}>
              🔔 Optimal Notification Timing
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#d1fae5', margin: 0 }}>
              AI suggests notifications at 6:30 PM based on your engagement patterns. 
              Peak activity: Evenings | Best prediction time: 7-9 PM
            </p>
          </div>

          {/* Smart Watch Complications */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <h4 style={{ color: '#3b82f6', marginBottom: '8px', fontSize: '1rem' }}>
              ⌚ Smart Watch Complications
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#dbeafe', margin: 0 }}>
              View live scores, predictions, and stats on your wrist. Auto-syncs every 5 minutes. 
              Compatible with Apple Watch & Wear OS
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Feature 16: Prediction Streaks & Challenges
  const PredictionStreaksAndChallenges = () => {
    const [streakData] = useState({
      currentStreak: 12,
      bestStreak: 28,
      weeklyChallenge: {
        name: 'NBA Accuracy Master',
        progress: 7,
        target: 10,
        reward: '50 Pi Coins + Badge'
      },
      dailyChallenge: {
        name: 'Perfect Predictions',
        progress: 3,
        target: 5,
        reward: '15 Pi Coins'
      }
    });

    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#f59e0b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🔥 Streaks & Challenges
        </h3>

        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Current Streak */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.1))',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔥</div>
            <h4 style={{ color: '#fbbf24', margin: '0 0 4px 0', fontSize: '1.2rem' }}>
              {streakData.currentStreak} Day Streak!
            </h4>
            <p style={{ color: '#fde68a', fontSize: '0.9rem', margin: 0 }}>
              Best: {streakData.bestStreak} days | Keep it going!
            </p>
          </div>

          {/* Weekly Challenge */}
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ color: '#8b5cf6', margin: 0, fontSize: '1rem' }}>
                📅 {streakData.weeklyChallenge.name}
              </h4>
              <span style={{ color: '#c4b5fd', fontSize: '0.9rem' }}>
                {streakData.weeklyChallenge.progress}/{streakData.weeklyChallenge.target}
              </span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              height: '8px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                height: '100%',
                width: `${(streakData.weeklyChallenge.progress / streakData.weeklyChallenge.target) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{ color: '#c4b5fd', fontSize: '0.8rem', margin: 0 }}>
              Reward: {streakData.weeklyChallenge.reward}
            </p>
          </div>

          {/* Daily Challenge */}
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ color: '#22c55e', margin: 0, fontSize: '1rem' }}>
                ⭐ {streakData.dailyChallenge.name}
              </h4>
              <span style={{ color: '#86efac', fontSize: '0.9rem' }}>
                {streakData.dailyChallenge.progress}/{streakData.dailyChallenge.target}
              </span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              height: '8px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                height: '100%',
                width: `${(streakData.dailyChallenge.progress / streakData.dailyChallenge.target) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{ color: '#86efac', fontSize: '0.8rem', margin: 0 }}>
              Reward: {streakData.dailyChallenge.reward}
            </p>
          </div>

          {/* Special Event */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              background: '#ef4444',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              color: 'white'
            }}>
              !
            </div>
            <h4 style={{ color: '#ef4444', margin: '0 0 8px 0', fontSize: '1rem' }}>
              🏆 Playoff Prediction Challenge
            </h4>
            <p style={{ color: '#fca5a5', fontSize: '0.9rem', margin: 0 }}>
              Predict all playoff winners for 500 Pi Coins! Event ends in 3 days.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Feature 17: Educational Content Integration
  const EducationalContentIntegration = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [completedLessons, setCompletedLessons] = useState(new Set([1, 2, 3]));

    const educationalContent = [
      {
        id: 1,
        title: 'Sports Analytics 101',
        description: 'Learn the basics of sports data analysis',
        progress: 100,
        lessons: 8,
        certificate: true,
        difficulty: 'Beginner',
        icon: '📊'
      },
      {
        id: 2,
        title: 'Advanced Betting Strategies',
        description: 'Master sophisticated prediction techniques',
        progress: 75,
        lessons: 12,
        certificate: false,
        difficulty: 'Advanced',
        icon: '🎯'
      },
      {
        id: 3,
        title: 'Risk Management',
        description: 'Learn responsible betting practices',
        progress: 100,
        lessons: 6,
        certificate: true,
        difficulty: 'Beginner',
        icon: '⚖️'
      },
      {
        id: 4,
        title: 'AI & Machine Learning in Sports',
        description: 'Understand how AI predicts outcomes',
        progress: 25,
        lessons: 15,
        certificate: false,
        difficulty: 'Expert',
        icon: '🤖'
      }
    ];

    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#3b82f6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📚 Educational Hub
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {educationalContent.map(course => (
            <div
              key={course.id}
              style={{
                background: completedLessons.has(course.id) 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : 'rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${
                  completedLessons.has(course.id) 
                    ? 'rgba(34, 197, 94, 0.3)' 
                    : 'rgba(59, 130, 246, 0.3)'
                }`,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  fontSize: '2rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {course.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ color: '#fff', margin: 0, fontSize: '1rem' }}>
                      {course.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {completedLessons.has(course.id) && (
                        <span style={{ color: '#22c55e', fontSize: '1.2rem' }}>🏆</span>
                      )}
                      <span style={{
                        background: course.difficulty === 'Beginner' ? 'rgba(34, 197, 94, 0.3)' :
                                   course.difficulty === 'Advanced' ? 'rgba(245, 158, 11, 0.3)' :
                                   'rgba(239, 68, 68, 0.3)',
                        color: course.difficulty === 'Beginner' ? '#22c55e' :
                               course.difficulty === 'Advanced' ? '#f59e0b' :
                               '#ef4444',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem'
                      }}>
                        {course.difficulty}
                      </span>
                    </div>
                  </div>

                  <p style={{ color: '#d1d5db', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
                    {course.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                      {course.lessons} lessons
                    </span>
                    <span style={{ color: '#3b82f6', fontSize: '0.8rem' }}>
                      {course.progress}% complete
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    height: '6px',
                    overflow: 'hidden',
                    marginTop: '8px'
                  }}>
                    <div style={{
                      background: completedLessons.has(course.id) 
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      height: '100%',
                      width: `${course.progress}%`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              {selectedCourse === course.id && (
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <h5 style={{ color: '#fff', marginBottom: '12px' }}>Course Content:</h5>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {Array.from({length: course.lessons}, (_, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px'
                        }}
                      >
                        <span style={{
                          color: (i + 1) <= (course.lessons * course.progress / 100) ? '#22c55e' : '#9ca3af'
                        }}>
                          {(i + 1) <= (course.lessons * course.progress / 100) ? '✓' : '○'}
                        </span>
                        <span style={{
                          color: (i + 1) <= (course.lessons * course.progress / 100) ? '#d1fae5' : '#9ca3af',
                          fontSize: '0.9rem'
                        }}>
                          Lesson {i + 1}: {course.title} Basics
                        </span>
                      </div>
                    ))}
                  </div>

                  {course.certificate && completedLessons.has(course.id) && (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>🏆</span>
                        <span style={{ color: '#22c55e', fontSize: '0.9rem' }}>
                          Certificate earned! Added to your profile.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Live Webinar Section */}
        <div style={{
          marginTop: '20px',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <h4 style={{ color: '#ef4444', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔴 Live Webinar Tonight
          </h4>
          <p style={{ color: '#fca5a5', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
            "Advanced NFL Analytics" with Pro Analyst Mike Johnson
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fca5a5', fontSize: '0.8rem' }}>8:00 PM EST</span>
            <button style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}>
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Feature 18: Social Impact Features
  const SocialImpactFeatures = () => {
    const [activeCharityPool, setActiveCharityPool] = useState(null);
    const [userContribution, setUserContribution] = useState(0);

    const charityPools = [
      {
        id: 1,
        name: 'Sports Education for Kids',
        description: 'Funding sports programs in underserved communities',
        raised: 2450,
        goal: 5000,
        participants: 127,
        icon: '⚽',
        category: 'Education',
        urgent: false
      },
      {
        id: 2,
        name: 'Veterans Sports Therapy',
        description: 'Supporting veteran recovery through sports therapy',
        raised: 3200,
        goal: 4000,
        participants: 89,
        icon: '🎖️',
        category: 'Healthcare',
        urgent: true
      },
      {
        id: 3,
        name: 'Youth Basketball Courts',
        description: 'Building basketball courts in low-income areas',
        raised: 1800,
        goal: 8000,
        participants: 156,
        icon: '🏀',
        category: 'Infrastructure',
        urgent: false
      }
    ];

    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#10b981', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ❤️ Social Impact Hub
        </h3>

        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Community Impact Stats */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <h4 style={{ color: '#10b981', margin: '0 0 12px 0', fontSize: '1rem' }}>
              🌟 Community Impact This Month
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.5rem', color: '#34d399', fontWeight: 'bold' }}>$12,450</div>
                <div style={{ fontSize: '0.8rem', color: '#6ee7b7' }}>Raised</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', color: '#34d399', fontWeight: 'bold' }}>372</div>
                <div style={{ fontSize: '0.8rem', color: '#6ee7b7' }}>Contributors</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', color: '#34d399', fontWeight: 'bold' }}>8</div>
                <div style={{ fontSize: '0.8rem', color: '#6ee7b7' }}>Projects</div>
              </div>
            </div>
          </div>

          {/* Active Charity Pools */}
          <div>
            <h4 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '1rem' }}>
              🎯 Active Charity Prediction Pools
            </h4>
            {charityPools.map(pool => (
              <div
                key={pool.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  border: `1px solid ${pool.urgent ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveCharityPool(activeCharityPool === pool.id ? null : pool.id)}
              >
                {pool.urgent && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}>
                    URGENT
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    fontSize: '2rem',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {pool.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <h5 style={{ color: '#fff', margin: 0, fontSize: '1rem' }}>
                        {pool.name}
                      </h5>
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem'
                      }}>
                        {pool.category}
                      </span>
                    </div>

                    <p style={{ color: '#d1d5db', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
                      {pool.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        ${pool.raised.toLocaleString()} / ${pool.goal.toLocaleString()}
                      </span>
                      <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                        {pool.participants} participants
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      height: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        background: pool.urgent 
                          ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                          : 'linear-gradient(135deg, #10b981, #059669)',
                        height: '100%',
                        width: `${(pool.raised / pool.goal) * 100}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                {activeCharityPool === pool.id && (
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px'
                    }}>
                      <h6 style={{ color: '#10b981', margin: '0 0 8px 0' }}>How It Works:</h6>
                      <p style={{ color: '#6ee7b7', fontSize: '0.9rem', margin: 0 }}>
                        Make predictions on featured matches. For every correct prediction, 
                        10 Pi coins are automatically donated to this pool on your behalf.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        flex: 1
                      }}>
                        🎯 Join Prediction Pool
                      </button>
                      <button style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#d1d5db',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}>
                        📊 View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* User Impact Summary */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1))',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <h4 style={{ color: '#a855f7', margin: '0 0 12px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏆 Your Social Impact Score
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.5rem', color: '#c084fc', fontWeight: 'bold' }}>247 Pi</div>
                <div style={{ fontSize: '0.8rem', color: '#ddd6fe' }}>Donated via predictions</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', color: '#c084fc', fontWeight: 'bold' }}>12</div>
                <div style={{ fontSize: '0.8rem', color: '#ddd6fe' }}>Projects supported</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', color: '#c084fc', fontWeight: 'bold' }}>#89</div>
                <div style={{ fontSize: '0.8rem', color: '#ddd6fe' }}>Community rank</div>
              </div>
            </div>
          </div>

          {/* Educational Partnership */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <h4 style={{ color: '#3b82f6', margin: '0 0 8px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎓 Educational Partnership
            </h4>
            <p style={{ color: '#93c5fd', fontSize: '0.9rem', margin: '0 0 12px 0' }}>
              Partner with Local University Sports Analytics Program
            </p>
            <button style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              width: '100%'
            }}>
              📚 Mentor a Student (5 hours/month)
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) return; // Ignore system shortcuts

      switch (e.key.toLowerCase()) {
        case 'q':
          const quizSection = document.querySelector('[data-section="quiz"]');
          quizSection?.scrollIntoView({ behavior: 'smooth' });
          break;
        case '/':
          e.preventDefault();
          const searchInput = document.querySelector('input[placeholder*="search"]') as HTMLInputElement;
          searchInput?.focus();
          break;
        case '?':
          setActiveFeature('help');
          break;
        case 't':
          // Toggle theme functionality would go here
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div>
      {/* Quick Access Button */}
      <button
        onClick={() => setQuickAccessOpen(!quickAccessOpen)}
        style={{
          position: 'fixed',
          bottom: isMobile ? '80px' : '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          cursor: 'pointer',
          fontSize: '1.5rem',
          zIndex: 999,
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
          transform: quickAccessOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}
        title="Quick Actions"
      >
        ⚡
      </button>

      {/* Features 1-7 */}
      <QuickActionsPanel />
      <InteractiveTutorial />
      <SmartHelpSystem />
      <AccessibilityPanel />
      <ProgressTracker />
      <SmartShortcuts />
      <ContextualTips />

      {/* Features 15-18 at Position 9 */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))',
        borderRadius: '20px',
        padding: '20px',
        margin: '30px 0',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <h2 style={{ 
          color: '#10b981', 
          textAlign: 'center', 
          marginBottom: '30px',
          fontSize: '1.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          🌟 Advanced User Experience Suite
        </h2>

        <AdvancedPersonalization />
        <PredictionStreaksAndChallenges />
        <EducationalContentIntegration />
        <SocialImpactFeatures />
      </div>

      {/* Accessibility CSS */}
      <style jsx global>{`
        .high-contrast {
          filter: contrast(1.5) brightness(1.2);
        }

        .reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        .one-hand-mode {
          --content-max-width: 100vw;
        }

        .one-hand-mode .main-content {
          padding-bottom: 120px;
        }

        body {
          font-size: var(--user-font-size, 1em);
        }
      `}</style>
    </div>
  );
};

export { UserFriendlyFeatures };