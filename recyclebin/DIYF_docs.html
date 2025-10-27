<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sports Central - Architecture</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        /* Google-style Navigation Bar */
        .navbar {
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

        /* Google-style App Drawer */
        .app-drawer-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
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
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
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

        /* Horizontal Carousel */
        .carousel-section {
            background: white;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
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

        .carousel-btn:active {
            transform: scale(0.95);
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
            background: #2196F3;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
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

        .card-meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
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
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        header p {
            font-size: 1.2rem;
            opacity: 0.95;
        }

        .overview {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            animation: fadeInUp 0.8s ease 0.2s backwards;
        }

        .section {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
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
            border-bottom: 1px solid rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }

        .app-card li:hover {
            padding-left: 10px;
            color: #667eea;
        }

        .app-card li:last-child {
            border-bottom: none;
        }

        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }

        .benefit-item {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            padding: 20px;
            border-radius: 10px;
            font-weight: 600;
            color: #333;
            transition: all 0.3s ease;
        }

        .benefit-item:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-left: 10px;
        }

        .status-complete {
            background: #4caf50;
            color: white;
        }

        .status-progress {
            background: #ff9800;
            color: white;
        }

        .status-pending {
            background: #9e9e9e;
            color: white;
        }

        .code-block {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            margin: 15px 0;
            line-height: 1.6;
        }

        .route-list {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 15px;
        }

        .route-item {
            padding: 10px;
            margin: 5px 0;
            background: white;
            border-left: 4px solid #667eea;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .route-item:hover {
            padding-left: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .timeline {
            position: relative;
            padding-left: 40px;
            margin-top: 20px;
        }

        .timeline::before {
            content: '';
            position: absolute;
            left: 10px;
            top: 0;
            bottom: 0;
            width: 3px;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        }

        .timeline-item {
            position: relative;
            margin-bottom: 20px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .timeline-item::before {
            content: '';
            position: absolute;
            left: -33px;
            top: 20px;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: white;
            border: 3px solid #667eea;
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
        }
    </style>
</head>
<body>
    <!-- Google-style Navigation Bar -->
    <nav class="navbar">
        <div class="navbar-left">
            <div class="menu-icon" onclick="toggleMenu()">
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div class="logo">
                🏗️ Sports Central
            </div>
        </div>
        <div class="navbar-right">
            <div class="nav-icon" title="Search">🔍</div>
            <div class="nav-icon" title="Help">❓</div>
            <div class="nav-icon" title="Settings">⚙️</div>
            <div class="nav-icon app-drawer-btn" onclick="toggleAppDrawer()" title="Apps">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="4" cy="4" r="2"/>
                    <circle cx="12" cy="4" r="2"/>
                    <circle cx="20" cy="4" r="2"/>
                    <circle cx="4" cy="12" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="20" cy="12" r="2"/>
                    <circle cx="4" cy="20" r="2"/>
                    <circle cx="12" cy="20" r="2"/>
                    <circle cx="20" cy="20" r="2"/>
                </svg>
            </div>
            <div class="nav-icon" style="background: #667eea; color: white; font-weight: bold;" title="Profile">
                SC
            </div>
        </div>
    </nav>

    <!-- App Drawer Overlay -->
    <div class="app-drawer-overlay" id="appDrawerOverlay" onclick="toggleAppDrawer()"></div>

    <!-- Google-style App Drawer -->
    <div class="app-drawer" id="appDrawer">
        <div class="app-drawer-header">Sports Central Apps</div>
        <div class="app-grid">
            <div class="app-item">
                <div class="app-icon">🏠</div>
                <div class="app-name">Portal</div>
            </div>
            <div class="app-item">
                <div class="app-icon">🤖</div>
                <div class="app-name">Predictions</div>
            </div>
            <div class="app-item">
                <div class="app-icon">⚡</div>
                <div class="app-name">Live</div>
            </div>
            <div class="app-item">
                <div class="app-icon">👥</div>
                <div class="app-name">Social</div>
            </div>
            <div class="app-item">
                <div class="app-icon">🎮</div>
                <div class="app-name">Kids Mode</div>
            </div>
            <div class="app-item">
                <div class="app-icon">🏆</div>
                <div class="app-name">Rewards</div>
            </div>
            <div class="app-item">
                <div class="app-icon">📊</div>
                <div class="app-name">Analytics</div>
            </div>
            <div class="app-item">
                <div class="app-icon">💬</div>
                <div class="app-name">Chat</div>
            </div>
            <div class="app-item">
                <div class="app-icon">🎯</div>
                <div class="app-name">Challenges</div>
            </div>
        </div>
    </div>

    <div class="container">
        <header>
            <h1>🏗️ Sports Central</h1>
            <p>Feature-Based Architecture Documentation</p>
        </header>

        <!-- Live Matches Carousel -->
        <div class="carousel-section">
            <div class="carousel-header">
                <div class="carousel-title">
                    ⚡ Live Matches
                </div>
                <div class="carousel-controls">
                    <button class="carousel-btn" onclick="scrollCarousel('live', -1)">←</button>
                    <button class="carousel-btn" onclick="scrollCarousel('live', 1)">→</button>
                </div>
            </div>
            <div class="carousel-wrapper">
                <div class="carousel-container" id="liveCarousel">
                    <div class="carousel-card">
                        <span class="card-badge">🔴 LIVE</span>
                        <div class="card-icon">⚽</div>
                        <div class="card-title">Man United vs Arsenal</div>
                        <div class="card-description">Premier League - Thrilling match at Old Trafford</div>
                        <div class="card-meta">
                            <div class="card-meta-item">⏱️ 67'</div>
                            <div class="card-meta-item">📊 2-1</div>
                            <div class="card-meta-item">👥 73K watching</div>
                        </div>
                    </div>
                    <div class="carousel-card">
                        <span class="card-badge">🔴 LIVE</span>
                        <div class="card-icon">🏀</div>
                        <div class="card-title">Lakers vs Warriors</div>
                        <div class="card-description">NBA - Western Conference showdown</div>
                        <div class="card-meta">
                            <div class="card-meta-item">⏱️ Q3 5:23</div>
                            <div class="card-meta-item">📊 98-95</div>
                            <div class="card-meta-item">👥 120K watching</div>
                        </div>
                    </div>
                    <div class="carousel-card">
                        <span class="card-badge">🔴 LIVE</span>
                        <div class="card-icon">🏈</div>
                        <div class="card-title">Patriots vs Chiefs</div>
                        <div class="card-description">NFL - Championship game intensity</div>
                        <div class="card-meta">
                            <div class="card-meta-item">⏱️ Q2 8:14</div>
                            <div class="card-meta-item">📊 14-21</div>
                            <div class="card-meta-item">👥 250K watching</div>
                        </div>
                    </div>
                    <div class="carousel-card">
                        <span class="card-badge">🔴 LIVE</span>
                        <div class="card-icon">🎾</div>
                        <div class="card-title">Djokovic vs Alcaraz</div>
                        <div class="card-description">Wimbledon Final - Epic rally battle</div>
                        <div class="card-meta">
                            <div class="card-meta-item">⏱️ Set 2</div>
                            <div class="card-meta-item">📊 6-4, 3-4</div>
                            <div class="card-meta-item">👥 89K watching</div>
                        </div>
                    </div>
                    <div class="carousel-card">
                        <span class="card-badge">🔴 LIVE</span>
                        <div class="card-icon">🏏</div>
                        <div class="card-title">India vs Australia</div>
                        <div class="card-description">Test Cricket - Day 4 decisive moments</div>
                        <div class="card-meta">
                            <div class="card-meta-item">⏱️ 45.2 overs</div>
                            <div class="card-meta-item">📊 234/5</div>
                            <div class="card-meta-item">👥 156K watching</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- News Carousel -->
        <div class="carousel-section">
            <div class="carousel-header">
                <div class="carousel-title">
                    📰 Latest News
                </div>
                <div class="carousel-controls">
                    <button class="carousel-btn" onclick="scrollCarousel('news', -1)">←</button>
                    <button class="carousel-btn" onclick="scrollCarousel('news', 1)">→</button>
                </div>
            </div>
            <div class="carousel-wrapper">
                <div class="carousel-container" id="newsCarousel">
                    <div class="carousel-card">
                        <span class="card-badge news">🔥 BREAKING</span>
                        <div class="card-icon">⚽</div>
                        <div class="card-title">Mbappe Signs Historic Deal</div>
                        <div class="card-description">Real Madrid announces record-breaking transfer for French superstar</div>
                        <div class="card-meta">
                            <div class="card-meta-item">🕐 2 hours ago</div>
                            <div class="card-meta-item">💬 1.2K comments</div>
                        </div>
                    </div>
                    <div class="carousel-card">
                        <span class="card-badge news">📰 NEWS</span>
                        <div class="card-icon">🏀</div>
                        <div class="card-title">LeBron Reaches 40K Points</div>
                        <div class="card-description">King James makes history with unprecedented milestone achievement</div>
                        <div class="card-meta">
                            <div class="card-meta-item">🕐 5 hours ago</div>
                            <div class="card-meta-item">💬 892 comments</div>
                        </div>
                    </div>
                    <div class="carousel-card">
                        <span class="card-badge news">📰 NEWS</span>
                        <div class="card-icon">🎾</div>
                        <div class="card-title">Serena Returns to Court</div>
                        <div class="card-description">Tennis legend announces comeback tournament in Miami next month</div>
                        <div class="card-meta">
                            <div class="card-meta-item">🕐 8 hours ago</div>
                            <div class="card-meta-item">💬 645 comments</div>
                        </div>
                    </div>
                    <div class="carousel-card">
                        <span class="card-badge news">📰 NEWS</span>
                        <div class="card-icon">⚾</div>
                        <div class="card-title">Yankees Win World Series</div>
                        <div class="card-description">First championship in 15 years with dramatic Game 7 victory</div>
                        <div class="card-meta">
                            <div class="card-meta-item">🕐 1 day ago</div>
                            <div class="card-meta-item">💬 2.1K comments</div>
                        </div>
                    </div>
                    <div class="carousel-card">
                        <span class="card-badge news">📰 NEWS</span>
                        <div class="card-icon">🏁</div>
                        <div class="card-title">Hamilton Breaks Records</div>
                        <div class="card-description">Formula 1 legend secures 8th world championship in Abu Dhabi</div>
                        <div class="card-meta">
                            <div class="card-meta-item">🕐 2 days ago</div>
                            <div class="card-meta-item">💬 1.5K comments</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="overview">
            <h2>📋 Overview</h2>
            <p style="font-size: 1.1rem; line-height: 1.8; color: #555;">
                Sports Central is organized into feature-based apps within a monorepo structure. 
                Each feature app is independent but shares common infrastructure, enabling better 
                organization, easier maintenance, and improved performance.
            </p>
        </div>

        <div class="section">
            <h2>📱 Frontend Apps Structure</h2>
            <div class="apps-grid">
                <div class="app-card">
                    <h3>🏠 Portal</h3>
                    <p style="margin-bottom: 15px; color: #666;">Main dashboard & navigation hub</p>
                    <ul>
                        <li>page.tsx - Landing with feature cards</li>
                        <li>layout.tsx - Portal-specific layout</li>
                    </ul>
                </div>

                <div class="app-card">
                    <h3>🤖 Predictions</h3>
                    <p style="margin-bottom: 15px; color: #666;">AI Predictions & ML Features</p>
                    <ul>
                        <li>ai-predictions/ - ML interface</li>
                        <li>coach/ - AI coach assistant</li>
                        <li>analytics/ - Prediction analytics</li>
                    </ul>
                </div>

                <div class="app-card">
                    <h3>⚡ Live Tracking</h3>
                    <p style="margin-bottom: 15px; color: #666;">Real-time sports updates</p>
                    <ul>
                        <li>matches/ - Live match tracker</li>
                        <li>scores/ - Live scores display</li>
                        <li>odds/ - Live odds updates</li>
                    </ul>
                </div>

                <div class="app-card">
                    <h3>👥 Social</h3>
                    <p style="margin-bottom: 15px; color: #666;">Community & engagement</p>
                    <ul>
                        <li>feed/ - Social feed</li>
                        <li>challenges/ - Friend challenges</li>
                        <li>chat/ - Live match chat</li>
                        <li>forum/ - Community discussions</li>
                    </ul>
                </div>

                <div class="app-card">
                    <h3>🎮 Kids Mode</h3>
                    <p style="margin-bottom: 15px; color: #666;">Safe environment for children</p>
                    <ul>
                        <li>dashboard/ - Kids dashboard</li>
                        <li>quizzes/ - Educational quizzes</li>
                        <li>learning/ - Learning paths</li>
                    </ul>
                </div>

                <div class="app-card">
                    <h3>🏆 Rewards</h3>
                    <p style="margin-bottom: 15px; color: #666;">Achievements & gamification</p>
                    <ul>
                        <li>achievements/ - Achievement system</li>
                        <li>leaderboard/ - Global rankings</li>
                        <li>coins/ - Pi Coin management</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>🚀 Key Benefits</h2>
            <div class="benefits-grid">
                <div class="benefit-item">✅ Better Organization</div>
                <div class="benefit-item">✅ Easier Maintenance</div>
                <div class="benefit-item">✅ Improved Performance</div>
                <div class="benefit-item">✅ Team Scalability</div>
                <div class="benefit-item">✅ Independent Testing</div>
                <div class="benefit-item">✅ Flexible Deployment</div>
            </div>
        </div>

        <div class="section">
            <h2>🔄 Data Flow Architecture</h2>
            <div class="code-block">
Frontend Apps → Backend Modules → Database
                     ↓
                ML Service → Predictions
            </div>
            <p style="margin-top: 15px; color: #666;">
                Clean separation of concerns with each layer handling specific responsibilities.
                The ML service operates independently, providing predictions to the backend modules.
            </p>
        </div>

        <div class="section">
            <h2>📊 Implementation Status</h2>
            <div class="timeline">
                <div class="timeline-item">
                    <h3>Frontend Route Groups <span class="status-badge status-complete">✅ Complete</span></h3>
                    <p>All feature route groups created with proper layouts and navigation updated</p>
                </div>
                <div class="timeline-item">
                    <h3>Backend Modules <span class="status-badge status-complete">✅ Complete</span></h3>
                    <p>Module structure created and routes reorganized with feature grouping</p>
                </div>
                <div class="timeline-item">
                    <h3>Service Layer <span class="status-badge status-progress">🔄 In Progress</span></h3>
                    <p>Currently refactoring service layers for each module</p>
                </div>
                <div class="timeline-item">
                    <h3>Testing & Deployment <span class="status-badge status-pending">⏳ Pending</span></h3>
                    <p>Feature-specific testing and deployment pipeline setup</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>🎯 Next Steps</h2>
            <div class="route-list">
                <div class="route-item">1. Move remaining components into feature directories</div>
                <div class="route-item">2. Create service layers for each module</div>
                <div class="route-item">3. Add module-specific middleware</div>
                <div class="route-item">4. Implement feature-specific testing</div>
            </div>
        </div>

        <footer>
            <p><strong>Sports Central Architecture v2.0.0</strong></p>
            <p>Last Updated: October 26, 2025</p>
        </footer>
    </div>

    <script>
        function toggleAppDrawer() {
            const drawer = document.getElementById('appDrawer');
            const overlay = document.getElementById('appDrawerOverlay');
            
            drawer.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        function toggleMenu() {
            alert('Menu functionality - would typically open a side navigation drawer');
        }

        function scrollCarousel(type, direction) {
            const carouselId = type === 'live' ? 'liveCarousel' : 'newsCarousel';
            const carousel = document.getElementById(carouselId);
            const scrollAmount = 340; // card width + gap
            
            carousel.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth'
            });
        }

        // Close drawer when clicking escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const drawer = document.getElementById('appDrawer');
                const overlay = document.getElementById('appDrawerOverlay');
                drawer.classList.remove('active');
                overlay.classList.remove('active');
            }
        });

        // Auto-scroll carousels every 5 seconds
        setInterval(() => {
            const liveCarousel = document.getElementById('liveCarousel');
            const newsCarousel = document.getElementById('newsCarousel');
            
            // Auto-scroll live carousel
            if (liveCarousel.scrollLeft >= liveCarousel.scrollWidth - liveCarousel.clientWidth) {
                liveCarousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                liveCarousel.scrollBy({ left: 340, behavior: 'smooth' });
            }
            
            // Auto-scroll news carousel with offset timing
            setTimeout(() => {
                if (newsCarousel.scrollLeft >= newsCarousel.scrollWidth - newsCarousel.clientWidth) {
                    newsCarousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    newsCarousel.scrollBy({ left: 340, behavior: 'smooth' });
                }
            }, 2500);
        }, 5000);
    </script>
</body>
</html>