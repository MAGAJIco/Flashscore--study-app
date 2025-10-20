
"use client";

import React, { useState, useEffect } from 'react';
import { ClientStorage } from '../utils/clientStorage';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  action?: () => void;
}

const SmartOnboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to MagajiCo! 🎉',
      description: 'Your AI-powered sports prediction platform with rewards and community features',
      icon: '🏆'
    },
    {
      id: 'favorites',
      title: 'Add Your Favorites ⭐',
      description: 'Personalize your feed by selecting your favorite teams, leagues, and sports',
      icon: '❤️'
    },
    {
      id: 'predictions',
      title: 'AI Predictions 🤖',
      description: 'Get real-time AI-powered predictions with confidence scores and analytics',
      icon: '📊'
    },
    {
      id: 'rewards',
      title: 'Earn Pi Coins 💰',
      description: 'Complete challenges, make accurate predictions, and earn rewards',
      icon: '🪙'
    },
    {
      id: 'community',
      title: 'Join the Community 👥',
      description: 'Connect with other fans, share insights, and compete on leaderboards',
      icon: '🌟'
    }
  ];

  useEffect(() => {
    const hasSeenOnboarding = ClientStorage.getItem('hasSeenOnboarding', false);
    if (!hasSeenOnboarding) {
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    ClientStorage.setItem('hasSeenOnboarding', true);
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.1))',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        animation: 'slideUp 0.4s ease-out'
      }}>
        {/* Progress Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '24px 24px 0 0',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #8b5cf6, #6366f1)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Step Indicator */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#9ca3af',
          fontSize: '0.9rem'
        }}>
          Step {currentStep + 1} of {steps.length}
        </div>

        {/* Icon */}
        <div style={{
          fontSize: '4rem',
          textAlign: 'center',
          marginBottom: '20px',
          animation: 'bounce 0.6s ease-in-out'
        }}>
          {step.icon}
        </div>

        {/* Title */}
        <h2 style={{
          color: '#fff',
          fontSize: '1.8rem',
          textAlign: 'center',
          marginBottom: '16px',
          fontWeight: '700'
        }}>
          {step.title}
        </h2>

        {/* Description */}
        <p style={{
          color: '#d1d5db',
          fontSize: '1.1rem',
          textAlign: 'center',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          {step.description}
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={handleSkip}
            style={{
              flex: 1,
              padding: '14px 24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#d1d5db',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            style={{
              flex: 2,
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              border: 'none',
              color: 'white',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
          </button>
        </div>

        {/* Dots Indicator */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          marginTop: '24px'
        }}>
          {steps.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentStep ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: index === currentStep 
                  ? 'linear-gradient(90deg, #8b5cf6, #6366f1)'
                  : 'rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default SmartOnboarding;
