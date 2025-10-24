
'use client';

import { useEffect, useRef, useState } from 'react';

interface HydrationIssue {
  type: 'text-mismatch' | 'attribute-mismatch' | 'extra-node' | 'missing-node';
  element: string;
  expected?: string;
  actual?: string;
  timestamp: number;
}

export function HydrationMonitor() {
  const [issues, setIssues] = useState<HydrationIssue[]>([]);
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    // Intercept console errors for hydration warnings
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      
      if (message.includes('Hydration') || message.includes('hydration')) {
        const issue: HydrationIssue = {
          type: 'text-mismatch',
          element: extractElementFromError(message),
          timestamp: Date.now()
        };
        
        setIssues(prev => [...prev, issue]);
        
        if (autoFixEnabled) {
          autoFixHydrationIssue(issue);
        }
      }
      
      originalError.apply(console, args);
    };

    // Monitor DOM mutations that might cause hydration issues
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check for potential hydration conflicts
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              checkNodeForHydrationIssues(node);
            }
          });
        }
      });
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    return () => {
      console.error = originalError;
      observerRef.current?.disconnect();
    };
  }, [autoFixEnabled]);

  const extractElementFromError = (message: string): string => {
    const match = message.match(/<(\w+)[^>]*>/);
    return match ? match[1] : 'unknown';
  };

  const checkNodeForHydrationIssues = (node: HTMLElement) => {
    // Check for data attributes that might cause mismatches
    if (node.hasAttribute('data-theme')) {
      const theme = node.getAttribute('data-theme');
      const storedTheme = localStorage.getItem('theme');
      
      if (theme !== storedTheme) {
        node.setAttribute('data-theme', storedTheme || 'light');
      }
    }

    // Check for suppressHydrationWarning
    if (!node.hasAttribute('suppresshydrationwarning')) {
      const hasTimeData = node.textContent?.includes(':') || 
                          node.textContent?.includes('AM') ||
                          node.textContent?.includes('PM');
      
      if (hasTimeData) {
        node.setAttribute('suppresshydrationwarning', 'true');
      }
    }
  };

  const autoFixHydrationIssue = (issue: HydrationIssue) => {
    console.log('🔧 Auto-fixing hydration issue:', issue);

    // Clear problematic localStorage
    if (issue.type === 'text-mismatch') {
      try {
        ['theme', 'deviceSettings', 'userPreferences'].forEach(key => {
          const value = localStorage.getItem(key);
          if (value) {
            localStorage.setItem(`${key}_backup`, value);
            localStorage.removeItem(key);
          }
        });

        // Force re-render
        setTimeout(() => {
          const event = new Event('storage');
          window.dispatchEvent(event);
        }, 100);
      } catch (e) {
        console.error('Auto-fix failed:', e);
      }
    }
  };

  // Only render in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 80,
        right: 20,
        background: issues.length > 0 ? 'rgba(239, 68, 68, 0.95)' : 'rgba(34, 197, 94, 0.95)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      <span>{issues.length === 0 ? '✅' : '⚠️'}</span>
      <span>
        {issues.length === 0 
          ? 'Hydration OK' 
          : `${issues.length} hydration issue${issues.length > 1 ? 's' : ''}`
        }
      </span>
      {issues.length > 0 && (
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          style={{
            background: 'white',
            color: 'black',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Fix Now
        </button>
      )}
    </div>
  );
}
