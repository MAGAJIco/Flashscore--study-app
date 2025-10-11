"use client";
import React, { useState, useEffect, useRef } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { username: string; password: string }) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    onLogin({ username, password });
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (!modalRef.current) return;
      
      const focusableElements = modalRef.current.querySelectorAll(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
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
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        className="glass-card" 
        style={{
          width: '400px',
          maxWidth: '90%',
          padding: '30px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <h3 
          id="login-modal-title"
          style={{
            color: '#e8f5e8',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}
        >
          <span aria-hidden="true">🔐</span> Admin Login
        </h3>

        {error && (
          <div 
            role="alert"
            aria-live="assertive"
            style={{
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '15px',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '8px', color: '#d1fae5', fontSize: '14px' }}>
              Username
            </label>
            <input
              ref={usernameInputRef}
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#e8f5e8',
                fontSize: '16px',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', color: '#d1fae5', fontSize: '14px' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#e8f5e8',
                fontSize: '16px',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              aria-label="Submit login"
              style={{
                flex: 1,
                padding: '12px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.3)'}
              onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              Login
            </button>
            
            <button
              type="button"
              onClick={onClose}
              aria-label="Cancel and close modal"
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#e8f5e8',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.3)'}
              onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
