
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  color: string;
  shortcut?: string;
}

export function MagajiCoCommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const quickActions: QuickAction[] = [
    {
      id: 'predict',
      label: 'New Prediction',
      icon: '🔮',
      action: () => router.push('/predictions'),
      color: 'from-purple-500 to-indigo-600',
      shortcut: 'P'
    },
    {
      id: 'live',
      label: 'Live Matches',
      icon: '⚡',
      action: () => router.push('/matches'),
      color: 'from-emerald-500 to-teal-600',
      shortcut: 'L'
    },
    {
      id: 'news',
      label: 'Latest News',
      icon: '📰',
      action: () => router.push('/news'),
      color: 'from-blue-500 to-cyan-600',
      shortcut: 'N'
    },
    {
      id: 'wallet',
      label: 'Pi Wallet',
      icon: '💰',
      action: () => router.push('/rewards/achievements'),
      color: 'from-yellow-500 to-orange-600',
      shortcut: 'W'
    },
    {
      id: 'social',
      label: 'Social Feed',
      icon: '👥',
      action: () => router.push('/social/feed'),
      color: 'from-pink-500 to-rose-600',
      shortcut: 'S'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📊',
      action: () => router.push('/analytics'),
      color: 'from-violet-500 to-purple-600',
      shortcut: 'A'
    },
  ];

  useEffect(() => {
    if (!mounted) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      
      if (isOpen && e.key.length === 1) {
        const action = quickActions.find(a => a.shortcut?.toLowerCase() === e.key.toLowerCase());
        if (action) {
          action.action();
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, mounted, router]);

  if (!mounted) return null;

  return (
    <>
      {/* Command Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 bottom-20 md:bottom-4 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="Open command center"
      >
        <span className="text-2xl group-hover:scale-110 transition-transform">⚡</span>
      </button>

      {/* Command Center */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl p-4">
            <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-slideUp">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>⚡</span>
                    Command Center
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {quickActions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => {
                        action.action();
                        setIsOpen(false);
                      }}
                      className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform shadow-lg mx-auto`}>
                        {action.icon}
                      </div>
                      <div className="text-white font-semibold text-center mb-1">{action.label}</div>
                      {action.shortcut && (
                        <div className="text-center">
                          <kbd className="px-2 py-1 bg-white/20 rounded text-xs text-white font-mono">
                            {action.shortcut}
                          </kbd>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm text-center">
                    Press <kbd className="px-2 py-1 bg-white/10 rounded mx-1">/</kbd> to open • 
                    <kbd className="px-2 py-1 bg-white/10 rounded mx-1">ESC</kbd> to close
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
