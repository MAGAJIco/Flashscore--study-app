
"use client";
import React, { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import UserManager from '../../../../../packages/shared/src/libs/utils/userManager';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (!isLogin && (!age.trim() || parseInt(age) < 13)) {
      setError('You must be at least 13 years old to use this platform');
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (isLogin) {
      // Handle traditional login
      signIn('credentials', {
        email: email.trim(),
        password: password,
        redirect: false
      }).then((result) => {
        if (result?.error) {
          setError('Invalid email or password');
        } else if (result?.ok) {
          getSession().then((session) => {
            if (session?.user) {
              const user: User = {
                id: (session.user as any).id || '',
                username: session.user.name || username.trim(),
                email: session.user.email || email.trim(),
                role: 'user',
                piCoins: 0
              };
              onUserCreated(user);
              onClose();
            }
          });
        }
        setIsLoading(false);
      });
    } else {
      // Show tutorial for registration
      setShowTutorial(true);
      setIsLoading(false);
    }
  };

  const handleTutorialAccept = async () => {
    setIsLoading(true);
    try {
      // Register user with credentials
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password,
          age: parseInt(age)
        })
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
        setShowTutorial(false);
      }
    } catch (err: any) {
      setError('Registration failed. Please try again.');
      setShowTutorial(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTutorialDecline = () => {
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
            <div style={{ marginBottom: '16px' }}>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
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
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              background: isLoading 
                ? 'linear-gradient(135deg, #6b7280, #9ca3af)' 
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '12px'
            }}
          >
            {isLoading ? 'Processing...' : (isLogin ? '🚀 Sign In' : '📖 Continue')}
          </button>

          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
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
