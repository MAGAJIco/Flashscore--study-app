
"use client";

import React, { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { UserPreferencesProvider } from "@/app/providers/UserPreferencesProvider";
import { NavBar } from "@/app/components/NavBar";
import { BottomNavigation } from "@/app/components/BottomNavigation";
import { ThemeProvider } from "@/app/themes/ThemeManager";
import { MobileOptimizationWrapper } from "@/app/components/MobileOptimizationWrapper";

export function DIYF({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="diyf-loading">
        <div className="loading-spinner"></div>
        <style jsx>{`
          .diyf-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(16, 185, 129, 0.1);
            border-top: 4px solid #10b981;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <SessionProvider>
      <ThemeProvider>
        <UserPreferencesProvider>
          <MobileOptimizationWrapper>
            <div className="diyf-container">
              {/* Enhanced Background Layer */}
              <div className="diyf-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
                <div className="grid-overlay"></div>
              </div>

              {/* Quick Theme Switcher FAB */}
              <button
                className="theme-fab"
                onClick={() => setShowThemeSwitcher(!showThemeSwitcher)}
                aria-label="Toggle theme switcher"
              >
                🎨
              </button>

              {showThemeSwitcher && (
                <div className="theme-quick-switcher">
                  <div className="theme-option" data-theme="default">
                    <div className="theme-preview default-preview"></div>
                    <span>Default</span>
                  </div>
                  <div className="theme-option" data-theme="flashscore">
                    <div className="theme-preview flashscore-preview"></div>
                    <span>FlashScore</span>
                  </div>
                  <div className="theme-option" data-theme="minimal">
                    <div className="theme-preview minimal-preview"></div>
                    <span>Minimal</span>
                  </div>
                  <div className="theme-option" data-theme="cyberpunk">
                    <div className="theme-preview cyberpunk-preview"></div>
                    <span>Cyberpunk</span>
                  </div>
                </div>
              )}

              <NavBar />
              
              <main className="diyf-main">
                <div className="content-wrapper">
                  {children}
                </div>
              </main>
              
              <BottomNavigation />

              <style jsx>{`
                .diyf-container {
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  min-height: 100vh;
                  background: var(--color-background, #0f172a);
                  color: var(--color-foreground, #ffffff);
                  overflow-x: hidden;
                }

                /* Enhanced Background */
                .diyf-background {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  z-index: 0;
                  pointer-events: none;
                  overflow: hidden;
                }

                .gradient-orb {
                  position: absolute;
                  border-radius: 50%;
                  filter: blur(80px);
                  opacity: 0.4;
                  animation: float 20s ease-in-out infinite;
                }

                .orb-1 {
                  width: 400px;
                  height: 400px;
                  background: radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent);
                  top: -200px;
                  left: -200px;
                  animation-delay: 0s;
                }

                .orb-2 {
                  width: 500px;
                  height: 500px;
                  background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent);
                  top: 50%;
                  right: -250px;
                  animation-delay: 7s;
                }

                .orb-3 {
                  width: 350px;
                  height: 350px;
                  background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent);
                  bottom: -150px;
                  left: 30%;
                  animation-delay: 14s;
                }

                @keyframes float {
                  0%, 100% { transform: translate(0, 0) scale(1); }
                  25% { transform: translate(30px, -30px) scale(1.1); }
                  50% { transform: translate(-20px, 20px) scale(0.9); }
                  75% { transform: translate(20px, 10px) scale(1.05); }
                }

                .grid-overlay {
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-image: 
                    linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px);
                  background-size: 50px 50px;
                  opacity: 0.5;
                }

                /* Theme FAB */
                .theme-fab {
                  position: fixed;
                  bottom: 80px;
                  right: 20px;
                  width: 56px;
                  height: 56px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, var(--color-primary, #10b981), var(--color-accent, #22c55e));
                  border: none;
                  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
                  cursor: pointer;
                  font-size: 24px;
                  z-index: 1000;
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }

                .theme-fab:hover {
                  transform: scale(1.1) rotate(15deg);
                  box-shadow: 0 6px 30px rgba(16, 185, 129, 0.6);
                }

                .theme-fab:active {
                  transform: scale(0.95);
                }

                /* Quick Theme Switcher */
                .theme-quick-switcher {
                  position: fixed;
                  bottom: 150px;
                  right: 20px;
                  background: rgba(15, 23, 42, 0.95);
                  backdrop-filter: blur(20px);
                  border-radius: 16px;
                  padding: 16px;
                  z-index: 999;
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                  border: 1px solid rgba(16, 185, 129, 0.2);
                  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                  animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                  from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.9);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                  }
                }

                .theme-option {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  padding: 8px 12px;
                  border-radius: 8px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  background: rgba(255, 255, 255, 0.05);
                }

                .theme-option:hover {
                  background: rgba(16, 185, 129, 0.1);
                  transform: translateX(-4px);
                }

                .theme-preview {
                  width: 40px;
                  height: 40px;
                  border-radius: 8px;
                  border: 2px solid rgba(255, 255, 255, 0.1);
                }

                .default-preview {
                  background: linear-gradient(135deg, #10b981, #1a1a1a);
                }

                .flashscore-preview {
                  background: linear-gradient(135deg, #00a651, #0d1117);
                }

                .minimal-preview {
                  background: linear-gradient(135deg, #ffffff, #000000);
                }

                .cyberpunk-preview {
                  background: linear-gradient(135deg, #ff00ff, #00ffff);
                }

                .theme-option span {
                  color: #fff;
                  font-size: 14px;
                  font-weight: 500;
                }

                /* Main Content */
                .diyf-main {
                  position: relative;
                  z-index: 1;
                  flex: 1;
                  width: 100%;
                  max-width: 1400px;
                  margin: 0 auto;
                  padding: 0 16px;
                }

                .content-wrapper {
                  min-height: calc(100vh - 140px);
                  padding: 24px 0;
                  animation: fadeInUp 0.6s ease-out;
                }

                @keyframes fadeInUp {
                  from {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                  .diyf-main {
                    padding: 0 12px;
                  }

                  .content-wrapper {
                    padding: 16px 0;
                  }

                  .theme-fab {
                    bottom: 70px;
                    right: 16px;
                    width: 48px;
                    height: 48px;
                    font-size: 20px;
                  }

                  .theme-quick-switcher {
                    bottom: 130px;
                    right: 16px;
                  }

                  .gradient-orb {
                    filter: blur(60px);
                  }

                  .orb-1 {
                    width: 300px;
                    height: 300px;
                  }

                  .orb-2 {
                    width: 350px;
                    height: 350px;
                  }

                  .orb-3 {
                    width: 250px;
                    height: 250px;
                  }
                }

                /* Dark mode enhancements */
                @media (prefers-color-scheme: dark) {
                  .theme-quick-switcher {
                    background: rgba(10, 15, 30, 0.98);
                  }
                }

                /* Accessibility */
                @media (prefers-reduced-motion: reduce) {
                  .gradient-orb,
                  .content-wrapper,
                  .theme-quick-switcher {
                    animation: none;
                  }

                  .theme-fab:hover {
                    transform: scale(1.05);
                  }
                }
              `}</style>
            </div>
          </MobileOptimizationWrapper>
        </UserPreferencesProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
