
// apps/web/src/app/[locale]/page.tsx
"use client";

import React, { useRef, useState } from "react";
import MagajicoCEO from "@/components/MagajicoCEO";
import LiverpoolNotifications from "@/components/LiverpoolNotifications";
import { Magajico } from "@/app/components/Magajico";

import {
  PortalIcon,
  PredictionsIcon,
  LiveIcon,
  SocialIcon,
  KidsIcon,
  RewardsIcon,
  AnalyticsIcon,
  ChatIcon,
  ChallengesIcon,
  SearchIcon,
  HelpIcon,
  SettingsIcon,
  AppsIcon,
} from '@/components/icons/SVGIcons';

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const liveRef = useRef<HTMLDivElement | null>(null);

  function toggleAppDrawer() {
    setDrawerOpen((s) => !s);
  }

  function scrollCarousel(refName: "live", dir: -1 | 1) {
    // Only one carousel in this page, for extensibility we accept refName
    const el = liveRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".carousel-card");
    const cardWidth = card ? card.offsetWidth + 20 /* gap */ : 340;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <div className="menu-icon" role="button" tabIndex={0} onClick={() => {}}>
            <div className="hamburger">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="logo">🎯 Magajico</div>
        </div>

        <div className="navbar-right">
          <div className="nav-icon icon-transition" title="Search">
            <SearchIcon size={20} />
          </div>
          <div className="nav-icon icon-transition" title="Help">
            <HelpIcon size={20} />
          </div>
          <div className="nav-icon icon-transition" title="Settings">
            <SettingsIcon size={20} />
          </div>

          <div
            className="nav-icon app-drawer-btn icon-transition"
            onClick={toggleAppDrawer}
            title="Apps"
            role="button"
            aria-expanded={drawerOpen}
          >
            <AppsIcon size={20} />
          </div>

          <div
            className="nav-icon"
            style={{ background: "#667eea", color: "white", fontWeight: "bold" }}
            title="Profile"
          >
            MJ
          </div>
        </div>
      </nav>

      {/* App Drawer Overlay */}
      <div
        className={`app-drawer-overlay ${drawerOpen ? "active" : ""}`}
        onClick={toggleAppDrawer}
      />

      {/* App Drawer */}
      <aside className={`app-drawer ${drawerOpen ? "active" : ""}`} aria-hidden={!drawerOpen}>
        <div className="app-drawer-header">Magajico Apps</div>
        <div className="app-grid">
          {[
            { icon: PortalIcon, name: "Portal", route: "/en" },
            { icon: PredictionsIcon, name: "Predictions", route: "/en/predictions" },
            { icon: LiveIcon, name: "Live", route: "/en/live" },
            { icon: SocialIcon, name: "Social", route: "/en/social/feed" },
            { icon: KidsIcon, name: "Kids Mode", route: "/en/kids" },
            { icon: RewardsIcon, name: "Rewards", route: "/en/achievements" },
            { icon: AnalyticsIcon, name: "Analytics", route: "/en/analytics" },
            { icon: ChatIcon, name: "Chat", route: "/en/chats" },
            { icon: ChallengesIcon, name: "Challenges", route: "/en/challenges" },
          ].map(({ icon: Icon, name, route }) => (
            <a 
              href={route}
              className="app-item spring-animate" 
              key={name}
              onClick={toggleAppDrawer}
            >
              <div className="icon-container">
                <Icon size={24} />
              </div>
              <div className="app-name">{name}</div>
            </a>
          ))}
        </div>
      </aside>

      <main className="container">
        <header>
          <h1>🎯 Magajico</h1>
          <p>Your AI-Powered Betting Assistant</p>
        </header>

        {/* Liverpool Notifications */}
        <LiverpoolNotifications />

        {/* Main Feature: AI CEO Manager */}
        <section className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">Meet Your Personal AI Manager</h2>
            <p className="hero-description">
              Just you and your AI. Tell us which games you want to bet on, and we'll help you build your perfect bet slip.
              No more missed opportunities while browsing endless live feeds.
            </p>
            {/* Predictions Button */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <a 
                href="/en/predictions/filtered" 
                style={{
                  display: 'inline-block',
                  padding: '15px 30px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                🎯 View AI Predictions & Live Matches
              </a>
            </div>
          </div>
        </section>

        <MagajicoCEO />

        <section className="carousel-section" aria-label="Live matches">
          <div className="carousel-header">
            <div className="carousel-title">⚡ Live Matches</div>
            <div className="carousel-controls">
              <button
                className="carousel-btn"
                onClick={() => scrollCarousel("live", -1)}
                aria-label="Scroll left"
              >
                ←
              </button>
              <button
                className="carousel-btn"
                onClick={() => scrollCarousel("live", 1)}
                aria-label="Scroll right"
              >
                →
              </button>
            </div>
          </div>

          <div className="carousel-wrapper">
            <div className="carousel-container" id="liveCarousel" ref={liveRef}>
              {/* Cards */}
              <article className="carousel-card">
                <span className="card-badge">🔴 LIVE</span>
                <div className="card-icon">⚽</div>
                <div className="card-title">Man United vs Arsenal</div>
                <div className="card-description">Premier League - Thrilling match at Old Trafford</div>
                <div className="card-meta">
                  <div className="card-meta-item">⏱️ 67'</div>
                  <div className="card-meta-item">📊 2-1</div>
                  <div className="card-meta-item">👥 73K watching</div>
                </div>
              </article>

              <article className="carousel-card">
                <span className="card-badge news">LIVE</span>
                <div className="card-icon">🏀</div>
                <div className="card-title">Lakers vs Warriors</div>
                <div className="card-description">NBA - Western Conference showdown</div>
                <div className="card-meta">
                  <div className="card-meta-item">⏱️ Q3 02:14</div>
                  <div className="card-meta-item">📊 98-101</div>
                  <div className="card-meta-item">👥 18K watching</div>
                </div>
              </article>

              <article className="carousel-card">
                <div className="card-icon">🏈</div>
                <div className="card-title">Dolphins vs Bills</div>
                <div className="card-description">NFL - Divisional preview</div>
                <div className="card-meta">
                  <div className="card-meta-item">📅 Today</div>
                  <div className="card-meta-item">📊  — </div>
                  <div className="card-meta-item">👥 12K watching</div>
                </div>
              </article>

              <article className="carousel-card">
                <div className="card-icon">🎾</div>
                <div className="card-title">Wimbledon Highlights</div>
                <div className="card-description">Recap of yesterday's semi-finals</div>
                <div className="card-meta">
                  <div className="card-meta-item">⏱️ 2h ago</div>
                  <div className="card-meta-item">📊 Recap</div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="overview section">
          <h2>Overview</h2>
          <p>
            This is a demo single-page conversion from static HTML into a Next 16 app `page.tsx`.
            It keeps the original styling and interactivity (app drawer + horizontal carousel).
          </p>

          <div className="apps-grid" style={{ marginTop: 20 }}>
            <div className="app-card">
              <h3>Portal</h3>
              <ul>
                <li>Home</li>
                <li>Teams</li>
                <li>Fixtures</li>
                <li>Standings</li>
              </ul>
            </div>

            <div className="app-card">
              <h3>Predictions</h3>
              <ul>
                <li>Machine learning models</li>
                <li>Live odds</li>
                <li>User tips</li>
              </ul>
            </div>

            <div className="app-card">
              <h3>Live</h3>
              <ul>
                <li>Real-time score</li>
                <li>Commentary</li>
                <li>Streaming links</li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="professional-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4 className="footer-heading">Magajico</h4>
              <p className="footer-description">AI-powered sports predictions and analytics platform</p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Twitter">𝕏</a>
                <a href="#" className="social-link" aria-label="Facebook">f</a>
                <a href="#" className="social-link" aria-label="Instagram">📷</a>
                <a href="#" className="social-link" aria-label="LinkedIn">in</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-heading">Features</h4>
              <ul className="footer-links">
                <li><a href="/en/predictions">AI Predictions</a></li>
                <li><a href="/en/matches">Live Matches</a></li>
                <li><a href="/en/news">Sports News</a></li>
                <li><a href="/en/analytics">Analytics</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-heading">Community</h4>
              <ul className="footer-links">
                <li><a href="/en/social/feed">Social Feed</a></li>
                <li><a href="/en/achievements">Rewards</a></li>
                <li><a href="/en/kids">Kids Mode</a></li>
                <li><a href="/en/challenges">Challenges</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-copyright">© 2025 Magajico. All rights reserved.</p>
            <p className="footer-tagline">Built with 💜 by the MagajiCo Team</p>
          </div>
        </footer>

        {/* Mobile Bottom Navigation with AI Chat */}
        <div className="mobile-bottom-nav">
          <a href="/en" className="nav-item">
            <PortalIcon size={24} />
            <span>Home</span>
          </a>
          <a href="/en/predictions" className="nav-item">
            <PredictionsIcon size={24} />
            <span>Predictions</span>
          </a>
          <button 
            onClick={() => setShowAIChat(!showAIChat)}
            className="nav-item ai-chat-btn"
          >
            <ChatIcon size={24} />
            <span>AI Chat</span>
          </button>
          <a href="/en/live" className="nav-item">
            <LiveIcon size={24} />
            <span>Live</span>
          </a>
          <a href="/en/social/feed" className="nav-item">
            <SocialIcon size={24} />
            <span>Social</span>
          </a>
        </div>

        {/* AI Chat Modal for Mobile */}
        {showAIChat && (
          <div className="mobile-ai-chat-modal">
            <div className="ai-chat-header">
              <h3>🤖 AI Manager</h3>
              <button onClick={() => setShowAIChat(false)}>✕</button>
            </div>
            <div className="ai-chat-content">
              <MagajicoCEO />
            </div>
          </div>
        )}

        <Magajico />
      </main>

      {/* Styles (keeps the original CSS; injected globally for this page) */}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: #333;
        }

        .navbar {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.5);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          padding: 0 20px;
          position: sticky;
          top: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .menu-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .menu-icon:hover {
          background: #f1f3f4;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: #5f6368;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 600;
          color: #667eea;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 1.2rem;
          color: #5f6368;
        }

        .nav-icon:hover {
          background: rgba(0, 0, 0, 0.05);
          transform: scale(1.05);
        }

        .nav-icon:active {
          transform: scale(0.95);
        }

        .app-drawer-btn {
          position: relative;
        }

        .app-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1998;
        }

        .app-drawer-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .app-drawer {
          position: fixed;
          top: 70px;
          right: 20px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.12),
            0 2px 8px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
          padding: 24px;
          width: 400px;
          max-height: 500px;
          overflow-y: auto;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px) scale(0.95);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1999;
        }

        .app-drawer.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .app-drawer-header {
          font-size: 1.1rem;
          font-weight: 600;
          color: #5f6368;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e8eaed;
        }

        .app-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .app-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          color: #5f6368;
        }

        .app-item:hover {
          background: #f1f3f4;
        }

        .app-icon, .icon-container {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 8px;
          color: white;
        }

        .app-name {
          font-size: 0.85rem;
          text-align: center;
          font-weight: 500;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          padding-bottom: 100px;
        }

        /* Mobile Bottom Navigation */
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          padding: 8px 0;
          z-index: 1000;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        }

        .mobile-bottom-nav .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          padding: 8px;
          text-decoration: none;
          color: #5f6368;
          font-size: 0.7rem;
          transition: all 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
        }

        .mobile-bottom-nav .nav-item:hover,
        .mobile-bottom-nav .nav-item:active {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .mobile-bottom-nav .ai-chat-btn {
          color: #667eea;
          font-weight: 600;
        }

        /* Mobile AI Chat Modal */
        .mobile-ai-chat-modal {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          top: 20%;
          background: white;
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
          z-index: 2000;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
        }

        .ai-chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e8eaed;
        }

        .ai-chat-header h3 {
          font-size: 1.3rem;
          color: #333;
        }

        .ai-chat-header button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f1f3f4;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .ai-chat-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
          }
          
          .container {
            padding-bottom: 80px;
          }
        }

        .carousel-section {
          background: white;
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 0.8s ease 0.3s backwards;
        }

        .carousel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .carousel-title {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #667eea;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .carousel-controls {
          display: flex;
          gap: 10px;
        }

        .carousel-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f1f3f4;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.2s ease;
        }

        .carousel-btn:hover {
          background: #e8eaed;
          transform: scale(1.1);
        }

        .carousel-wrapper {
          position: relative;
          overflow: hidden;
        }

        .carousel-container {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 10px 0;
        }

        .carousel-container::-webkit-scrollbar {
          display: none;
        }

        .carousel-card {
          min-width: 320px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .carousel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          border-color: #667eea;
        }

        .card-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #ff4444;
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          animation: pulse 2s infinite;
        }

        .card-badge.news {
          background: #2196f3;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .card-icon {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 15px;
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }

        .card-description {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.5;
          margin-bottom: 15px;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 0.85rem;
          color: #999;
        }

        header {
          text-align: center;
          color: white;
          margin-bottom: 40px;
          animation: fadeInDown 0.8s ease;
        }

        header h1 {
          font-size: 3.5rem;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        header p {
          font-size: 1.2rem;
          opacity: 0.95;
        }

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          padding: 40px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 0.8s ease;
          text-align: center;
          color: white;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 2.5rem;
          margin-bottom: 16px;
          font-weight: 700;
        }

        .hero-description {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.95;
        }

        .overview {
          background: white;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 0.8s ease 0.2s backwards;
        }

        .section {
          background: white;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 0.8s ease 0.4s backwards;
        }

        .section h2 {
          color: #667eea;
          margin-bottom: 20px;
          font-size: 2rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .apps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .app-card {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
          padding: 25px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          cursor: pointer;
        }

        .app-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          border-color: #667eea;
        }

        .app-card h3 {
          color: #667eea;
          font-size: 1.5rem;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .app-card ul {
          list-style: none;
          padding-left: 0;
        }

        .app-card li {
          padding: 8px 0;
          color: #555;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .app-card li:hover {
          padding-left: 10px;
          color: #667eea;
        }

        /* Professional Desktop Footer */
        .professional-footer {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          padding: 60px 20px 20px;
          margin-top: 80px;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section h4 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 16px;
          color: #667eea;
        }

        .footer-description {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .footer-social {
          display: flex;
          gap: 12px;
        }

        .social-link {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: white;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: #667eea;
          transform: translateY(-3px);
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .footer-links a:hover {
          color: #667eea;
          padding-left: 5px;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .footer-copyright {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
        }

        .footer-tagline {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 768px) {
          .professional-footer {
            padding: 40px 20px 90px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .footer-section {
            text-align: center;
          }

          .footer-social {
            justify-content: center;
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          header h1 {
            font-size: 2.5rem;
          }

          .apps-grid {
            grid-template-columns: 1fr;
          }

          .app-drawer {
            right: 10px;
            left: 10px;
            width: auto;
          }
        }
      `}</style>
    </>
  );
}
