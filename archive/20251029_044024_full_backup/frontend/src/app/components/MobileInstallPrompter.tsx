"use client";

import React, { useEffect, useState } from 'react';
import { ClientOnly } from './ClientOnly';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
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
      return;
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
    }, 4 * 60 * 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        localStorage.setItem('appInstalled', 'true');
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Install error:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  const handleLater = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-[9999] p-4">
      {isIOS && (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-t-3xl w-full max-w-md border border-gray-700 shadow-2xl animate-slide-up">
          <div className="p-6">
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
              <button onClick={handleDismiss} className="text-gray-400 hover:text-white p-2">
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <span className="text-2xl">📲</span>
                <p className="text-sm">Tap the Share button below</p>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <span className="text-2xl">➕</span>
                <p className="text-sm">Select "Add to Home Screen"</p>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <span className="text-2xl">✅</span>
                <p className="text-sm">Enjoy quick access!</p>
              </div>
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

      {!isIOS && deferredPrompt && (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-t-3xl w-full max-w-md border border-gray-700 shadow-2xl animate-slide-up">
          <div className="p-6">
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
              <button onClick={handleDismiss} className="text-gray-400 hover:text-white p-2">
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-300">
                <span>⚡</span>
                <p className="text-sm">Fast, native-like experience</p>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span>📱</span>
                <p className="text-sm">Works offline</p>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span>🔔</span>
                <p className="text-sm">Get instant notifications</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLater}
                className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Later
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-blue-700 transition-all"
              >
                Install
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