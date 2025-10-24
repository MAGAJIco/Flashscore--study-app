'use client';

import { useState, useEffect } from 'react';
import { ClientOnly } from './ClientOnly';

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function MobileInstallPrompterContent() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone === true;

    setIsIOS(isIOSDevice);
    setIsStandalone(isInStandaloneMode);

    if (!isMobile || isInStandaloneMode) {
      return; // Don't show on desktop or if already installed
    }

    const hasBeenPrompted = localStorage.getItem('mobileInstallPrompted');
    const installDismissed = localStorage.getItem('installPromptDismissed');
    
    if (hasBeenPrompted || installDismissed) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as InstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const timer = setTimeout(() => {
      setShowPrompt(true);
      localStorage.setItem('mobileInstallPrompted', 'true');
    }, 4 * 60 * 1000); // 4 minutes

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        localStorage.setItem('appInstalled', 'true');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else if (isIOS) {
      setShowPrompt(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  const handleLater = () => {
    setShowPrompt(false);
    setTimeout(() => {
      const stillDismissed = localStorage.getItem('installPromptDismissed');
      if (!stillDismissed && !isStandalone) {
        setShowPrompt(true);
      }
    }, 30 * 60 * 1000); // 30 minutes
  };

  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-[9999] p-4">
      {/* iOS 17 Specific Instructions */}
      {isIOS && (
        <div className="ios-card rounded-t-3xl w-full max-w-md shadow-2xl animate-slide-up" style={{
          background: 'var(--ios-secondary-background)',
          backdropFilter: 'var(--ios-vibrancy-effect)',
          WebkitBackdropFilter: 'var(--ios-vibrancy-effect)'
        }}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚽</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Install SportsApp</h3>
                  <p className="text-gray-400 text-sm">Get the full experience</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            {/* Benefits */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-400">⚡</span>
                </div>
                <div>
                  <p className="text-white font-medium">Lightning Fast</p>
                  <p className="text-gray-400">Instant predictions & live updates</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400">📱</span>
                </div>
                <div>
                  <p className="text-white font-medium">Works Offline</p>
                  <p className="text-gray-400">Access your data anywhere</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-purple-400">🔔</span>
                </div>
                <div>
                  <p className="text-white font-medium">Smart Notifications</p>
                  <p className="text-gray-400">Never miss important updates</p>
                </div>
              </div>
            </div>

            {/* iOS Instructions */}
            <div className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-700">
              <p className="text-white text-sm font-medium mb-3">How to install:</p>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">1.</span>
                  <span>Tap the Share button</span>
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-xs">
                    <span>↗</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">2.</span>
                  <span>Scroll down and tap "Add to Home Screen"</span>
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-xs">
                    <span>+</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">3.</span>
                  <span>Tap "Add" to confirm</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleLater}
                className="ios-button ios-button-secondary flex-1"
              >
                Maybe Later
              </button>
              <button
                onClick={handleDismiss}
                className="ios-button flex-1"
                style={{ background: 'var(--ios-blue)' }}
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Android/Chrome Install Prompt */}
      {!isIOS && deferredPrompt && (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-t-3xl w-full max-w-md border border-gray-700 shadow-2xl animate-slide-up">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚽</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Install SportsApp</h3>
                  <p className="text-gray-400 text-sm">Add to your home screen</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="text-2xl mb-1">⚡</div>
                  <p className="text-xs text-green-400">Fast</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <div className="text-2xl mb-1">📱</div>
                  <p className="text-xs text-blue-400">Offline</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <div className="text-2xl mb-1">🔔</div>
                  <p className="text-xs text-purple-400">Alerts</p>
                </div>
              </div>
            </div>

            {/* Install Benefits */}
            <div className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-700">
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Instant access from home screen</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Works offline with cached data</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Push notifications for live updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Full-screen experience</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleLater}
                className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Later
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-blue-700 transition-all"
              >
                Install App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for other browsers */}
      {!isIOS && !deferredPrompt && (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-t-3xl w-full max-w-md border border-gray-700 shadow-2xl animate-slide-up">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚽</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Bookmark SportsApp</h3>
                  <p className="text-gray-400 text-sm">Quick access anytime</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-300 text-sm">
                Add SportsApp to your bookmarks for quick access to predictions, live scores, and more!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLater}
                className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export function MobileInstallPrompter() {
  return (
    <ClientOnly>
      <MobileInstallPrompterContent />
    </ClientOnly>
  );
}