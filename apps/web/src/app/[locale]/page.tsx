// apps/web/src/app/[locale]/page.tsx
"use client";

import React, { useRef, useState } from "react";
import MagajicoCEO from "@/components/MagajicoCEO";
import LiverpoolNotifications from "@/components/LiverpoolNotifications";

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false);
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
          <div className="logo">🏗️ Sports Central</div>
        </div>

        <div className="navbar-right">
          <div className="nav-icon" title="Search">
            🔍
          </div>
          <div className="nav-icon" title="Help">
            ❓
          </div>
          <div className="nav-icon" title="Settings">
            ⚙️
          </div>

          <div
            className="nav-icon app-drawer-btn"
            onClick={toggleAppDrawer}
            title="Apps"
            role="button"
            aria-expanded={drawerOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="4" cy="4" r="2" />
              <circle cx="12" cy="4" r="2" />
              <circle cx="20" cy="4" r="2" />
              <circle cx="4" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="20" cy="12" r="2" />
              <circle cx="4" cy="20" r="2" />
              <circle cx="12" cy="20" r="2" />
              <circle cx="20" cy="20" r="2" />
            </svg>
          </div>

          <div
            className="nav-icon"
            style={{ background: "#667eea", color: "white", fontWeight: "bold" }}
            title="Profile"
          >
            SC
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
        <div className="app-drawer-header">Sports Central Apps</div>
        <div className="app-grid">
          {[
            ["🏠", "Portal"],
            ["🤖", "Predictions"],
            ["⚡", "Live"],
            ["👥", "Social"],
            ["🎮", "Kids Mode"],
            ["🏆", "Rewards"],
            ["📊", "Analytics"],
            ["💬", "Chat"],
            ["🎯", "Challenges"],
          ].map(([emoji, name]) => (
            <div className="app-item" key={String(name)}>
              <div className="app-icon">{emoji}</div>
              <div className="app-name">{name}</div>
            </div>
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

        <footer>© Sports Central — Design & Architecture</footer>
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
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
          transition: all 0.2s ease;
          font-size: 1.2rem;
        }

        .nav-icon:hover {
          background: #f1f3f4;
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
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          padding: 20px;
          width: 380px;
          max-height: 480px;
          overflow-y: auto;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-20px);
          transition: all 0.3s ease;
          z-index: 1999;
        }

        .app-drawer.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
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

        .app-icon {
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

        footer {
          text-align: center;
          color: white;
          padding: 30px;
          margin-top: 40px;
          font-size: 0.9rem;
          opacity: 0.9;
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