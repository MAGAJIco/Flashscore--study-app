'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoogleStyleMenu } from './GoogleStyleMenu';

interface HeaderProps {
  currentUser?: any;
  onLoginClick?: () => void;
  onLogout?: () => void;
  onWalletClick?: () => void;
  onStoreClick?: () => void;
}

export function Header({
  currentUser,
  onLoginClick,
  onLogout,
  onWalletClick,
  onStoreClick
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = pathname === '/auth/signin' || pathname === '/auth/signup';

  if (isAuthPage) {
    return null;
  }

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">MajajiCo</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="glass-card mx-4 mt-4 p-6 animate-slide-up">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-fade-scale">
              🏆 SPORTS CENTRAL
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur opacity-20 animate-pulse-glow"></div>
          </div>
          <div className="hidden md:block w-1 h-12 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full animate-float"></div>
          <div className="hidden md:block">
            <p className="text-cyan-200 font-medium">AI-Powered Sports Intelligence</p>
            <p className="text-gray-400 text-sm">Live • Accurate • Profitable</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <div className="glass-card px-4 py-2 text-sm hover-lift">
                <span className="text-cyan-400">Welcome, </span>
                <span className="font-semibold text-white">{currentUser.username}</span>
              </div>

              {onWalletClick && (
                <button
                  onClick={onWalletClick}
                  className="btn btn-primary flex items-center gap-2 hover-glow"
                >
                  <span>🪙</span>
                  <span>Wallet</span>
                </button>
              )}

              {onStoreClick && (
                <button
                  onClick={onStoreClick}
                  className="btn btn-success flex items-center gap-2 hover-glow"
                >
                  <span>🛒</span>
                  <span>Store</span>
                </button>
              )}

              <button
                onClick={onLogout}
                className="btn btn-danger hover-glow"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="glass-card px-4 py-2 text-sm text-cyan-200">
                🎯 Join 1000+ Winners
              </div>

              {onLoginClick && (
                <button
                  onClick={onLoginClick}
                  className="btn btn-primary flex items-center gap-2 hover-glow"
                >
                  <span>🚀</span>
                  <span>Get Started</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Status indicators */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Live Data Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-400 font-medium">AI Analysis Running</span>
            </div>
          </div>
          <div className="text-gray-400">
            Last updated: <span className="text-cyan-400">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Legal Links Footer */}
      <div className="bg-gray-800/50 border-t border-gray-700 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <span>© 2024 Sports Central. All rights reserved.</span>
          </div>
        </div>
      </div>
    </header>
  );
};