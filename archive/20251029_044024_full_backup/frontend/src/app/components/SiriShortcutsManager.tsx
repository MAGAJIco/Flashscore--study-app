
'use client';

import { useEffect } from 'react';

interface SiriShortcut {
  phrase: string;
  action: string;
  url: string;
  description: string;
}

export function SiriShortcutsManager() {
  useEffect(() => {
    // Register shortcuts with the browser
    if ('shortcuts' in navigator) {
      registerShortcuts();
    }
  }, []);

  const registerShortcuts = async () => {
    try {
      const response = await fetch('/shortcuts.json');
      const shortcuts: { shortcuts: SiriShortcut[] } = await response.json();

      shortcuts.shortcuts.forEach(shortcut => {
        // Register intent handlers
        if (window.webkit?.messageHandlers?.shortcuts) {
          window.webkit.messageHandlers.shortcuts.postMessage({
            type: 'register',
            phrase: shortcut.phrase,
            action: shortcut.action,
            url: shortcut.url
          });
        }
      });
    } catch (error) {
      console.error('Failed to register Siri shortcuts:', error);
    }
  };

  return null;
}
