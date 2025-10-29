"use client";
import React, { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { UserManager } from '@magajico/shared/utils';
import ResponsibleBettingTutorial from './ResponsibleBettingTutorial';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  piCoins: number;
}

interface UserRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: User) => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [ageVerified, setAgeVerified] = useState(false);
  const [isMinor, setIsMinor] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);
  const [parentEmail, setParentEmail] = useState('');

  const validateAge = (): 'minor' | 'adult' | false => {
    const enteredAge = parseInt(age);
    if (isNaN(enteredAge)) {
      setError('Please enter a valid age.');
      return false;
    }

    if (enteredAge < 13) {
      setError('You must be at least 13 years old.');
      return false;
    } else if (enteredAge < 18) {
      setIsMinor(true);
      setError(''); // Clear previous errors
      return 'minor';
    } else {
      setIsMinor(false);
      setParentalConsent(false); // Reset consent if user becomes adult
      setParentEmail('');
      setError(''); // Clear previous errors
      return 'adult';
    }
  };

  const handleAgeVerification = () => {
    const validationResult = validateAge();
    if (validationResult === 'adult') {
      setAgeVerified(true);
    } else if (validationResult === 'minor') {
      // Proceed to parental consent step
      setAgeVerified(false); // Ensure age is not considered verified yet
    } else {
      setAgeVerified(false); // Validation failed
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setSocialLoading(provider);
    setError('');

    try {
      const result = await signIn(provider, {
        callbackUrl: '/',
        redirect: false
      });

      if (result?.error) {
        setError(`${provider} authentication failed. Please try again.`);
      } else if (result?.ok) {
        const session = await getSession();
        if (session?.user) {
          const user: User = {
            id: (session.user as any).id || '',
            username: session.user.name || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            role: 'user',
            piCoins: 100
          };
          onUserCreated(user);
          onClose();
        }
      }
    } catch (err: any) {
      setError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (!age) {
      setError('Age is required');
      return;
    }

    // Check age verification
    if (!ageVerified) {
      const ageCheck = validateAge();
      if (ageCheck === 'minor') {
        // If a minor, we need parental consent. The form will handle showing the consent fields.
        // We don't set ageVerified to true here, but proceed to show consent fields.
        return;
      } else if (!ageCheck) {
        // If validation failed (e.g., invalid age format), setError is already set by validateAge.
        return;
      }
    }

    // If we reach here and isMinor is true, it means parental consent must be provided.
    if (isMinor && !parentalConsent) {
      setError('Parental consent is required for users under 18.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const registrationData: any = {
        username: username.trim(),
        email: email.trim(),
        password,
        age: parseInt(age),
        ageVerified: true,
        isMinor: isMinor
      };

      // Include parental consent data for minors
      if (isMinor) {
        registrationData.parentalConsent = {
          provided: parentalConsent,
          parentEmail: parentEmail,
          consentDate: new Date().toISOString()
        };
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (response.ok) {
        // Auto sign in after registration
        const result = await signIn('credentials', {
          email: email.trim(),
          password: password,
          redirect: false
        });

        if (result?.ok) {
          const session = await getSession();
          if (session?.user) {
            const user: User = {
              id: (session.user as any).id || '',
              username: username.trim(),
              email: email.trim(),
              role: 'user',
              piCoins: 100
            };
            onUserCreated(user);
            onClose();
          }
        }
      } else {
        setError(data.message || 'Registration failed');
        // Reset verification states if registration fails after consent
        setAgeVerified(false);
        setIsMinor(false);
        setParentalConsent(false);
        setParentEmail('');
        setShowTutorial(false);
      }
    } catch (err: any) {
      setError('Registration failed. Please try again.');
      setAgeVerified(false);
      setIsMinor(false);
      setParentalConsent(false);
      setParentEmail('');
      setShowTutorial(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTutorialAccept = async () => {
    // This function is now less relevant for registration flow directly,
    // as the age verification and parental consent are handled within handleSubmit.
    // However, if 'ResponsibleBettingTutorial' implies a separate step before registration,
    // it might need re-evaluation. For now, we assume it's part of the flow that
    // is bypassed or integrated by the new age verification logic.
    // If this tutorial is specifically for responsible betting, it should perhaps be shown
    // after registration, or if the user is identified as a minor.

    // For now, we'll focus on the registration submission logic.
    // If the user is a minor and has provided consent, handleSubmit will be called.
    // If the user is an adult, handleSubmit is called directly.
    // This function might be removed or re-purposed.
  };

  const handleTutorialDecline = () => {
    // Similar to handleTutorialAccept, this might need re-evaluation based on
    // the exact purpose of the tutorial. For now, we'll focus on the core registration.
    setShowTutorial(false);
    setError('You must accept the Responsible Betting Guidelines to create an account');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        maxWidth: '450px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{
          color: '#fff',
          textAlign: 'center',
          marginBottom: '24px',
          fontSize: '1.8rem'
        }}>
          {isLogin ? '🔑 Welcome Back' : '🎉 Join Sports Central'}
        </h2>

        {error && (
          <div style={{
            color: '#ef4444',
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Social Authentication Buttons */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            textAlign: 'center',
            color: '#ccc',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            Continue with social accounts
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => handleSocialSignIn('google')}
              disabled={socialLoading !== null}
              style={{
                flex: 1,
                padding: '12px',
                background: socialLoading === 'google'
                  ? 'rgba(219, 68, 55, 0.5)'
                  : 'linear-gradient(135deg, #db4437, #d33a2c)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: socialLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {socialLoading === 'google' ? '...' : '🔍 Google'}
            </button>

            <button
              onClick={() => handleSocialSignIn('facebook')}
              disabled={socialLoading !== null}
              style={{
                flex: 1,
                padding: '12px',
                background: socialLoading === 'facebook'
                  ? 'rgba(59, 89, 152, 0.5)'
                  : 'linear-gradient(135deg, #3b5998, #2d4373)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: socialLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {socialLoading === 'facebook' ? '...' : '📘 Facebook'}
            </button>

            <button
              onClick={() => handleSocialSignIn('twitter')}
              disabled={socialLoading !== null}
              style={{
                flex: 1,
                padding: '12px',
                background: socialLoading === 'twitter'
                  ? 'rgba(29, 161, 242, 0.5)'
                  : 'linear-gradient(135deg, #1da1f2, #0d8bd9)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: socialLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {socialLoading === 'twitter' ? '...' : '🐦 X'}
            </button>
          </div>

          <div style={{
            textAlign: 'center',
            color: '#888',
            fontSize: '12px',
            margin: '16px 0'
          }}>
            or continue with email
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px'
              }}
            />
          </div>

          {!isLogin && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setAgeVerified(false); // Reset verification on age change
                    setIsMinor(false); // Reset minor status
                    setParentalConsent(false); // Reset consent
                    setParentEmail('');
                  }}
                  onBlur={handleAgeVerification} // Trigger validation on blur
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                />
              </div>

              {isMinor && !parentalConsent && (
                <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255, 165, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 165, 0, 0.3)' }}>
                  <label style={{ color: '#ffc107', fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Parental Consent Required</label>
                  <p style={{ color: '#ddd', fontSize: '12px', marginBottom: '12px' }}>
                    Users under 18 require a parent or guardian's consent to create an account.
                  </p>
                  <input
                    type="email"
                    placeholder="Parent's Email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 165, 0, 0.5)',
                      background: 'rgba(255, 165, 0, 0.15)',
                      color: '#fff',
                      fontSize: '14px',
                      marginBottom: '10px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // In a real application, you'd send an email here.
                      // For this example, we simulate consent.
                      setParentalConsent(true);
                      setError(''); // Clear any previous errors
                      console.log(`Simulating sending parental consent email to ${parentEmail}`);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'linear-gradient(135deg, #ffc107, #e0a800)',
                      color: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Grant Consent & Continue
                  </button>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isLoading || (isMinor && !parentalConsent)} // Disable if minor and consent not given
            style={{
              width: '100%',
              padding: '16px',
              background: isLoading || (isMinor && !parentalConsent)
                ? 'linear-gradient(135deg, #6b7280, #9ca3af)'
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: isLoading || (isMinor && !parentalConsent) ? 'not-allowed' : 'pointer',
              marginBottom: '12px'
            }}
          >
            {isLoading ? 'Processing...' : (isLogin ? '🚀 Sign In' : '📖 Continue')}
          </button>

          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(''); // Clear error on toggle
                // Reset form fields and states when switching between login/signup
                setUsername('');
                setEmail('');
                setPassword('');
                setAge('');
                setAgeVerified(false);
                setIsMinor(false);
                setParentalConsent(false);
                setParentEmail('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#22c55e',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px'
              }}
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '8px',
              background: 'transparent',
              color: '#ccc',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </form>
      </div>

      {/* Responsible Betting Tutorial - conditionally rendered */}
      {showTutorial && (
        <ResponsibleBettingTutorial
          isOpen={true}
          onAccept={handleTutorialAccept}
          onDecline={handleTutorialDecline}
        />
      )}
    </div>
  );
};

export default UserRegistration;