// ============================================
// FILE: app/(portal)/page.tsx
// PATH: apps/frontend/src/app/(portal)/page.tsx
// COMPLETE ALL-IN-ONE VERSION WITH ALL FEATURES
// ============================================

"use client";

import React, { useState, useEffect, useRef } from "react";
import PredictionsAutoLoader from "./components/PredictionsAutoLoader";

// ============================================
// TYPES & INTERFACES
// ============================================

interface LiveMatch {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  score: string;
  viewers: string;
}

interface NewsItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  comments: string;
  badge: "BREAKING" | "NEWS";
}

interface AppItem {
  icon: string;
  name: string;
  route?: string;
}

interface FeatureApp {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface TimelineItem {
  title: string;
  status: "complete" | "progress" | "pending";
  description: string;
}

// ============================================
// MOCK DATA
// ============================================

const LIVE_MATCHES: LiveMatch[] = [
  {
    id: "1",
    icon: "⚽",
    title: "Man United vs Arsenal",
    description: "Premier League - Thrilling match at Old Trafford",
    time: "67'",
    score: "2-1",
    viewers: "73K watching",
  },
  {
    id: "2",
    icon: "🏀",
    title: "Lakers vs Warriors",
    description: "NBA - Western Conference showdown",
    time: "Q3 5:23",
    score: "98-95",
    viewers: "120K watching",
  },
  {
    id: "3",
    icon: "🏈",
    title: "Patriots vs Chiefs",
    description: "NFL - Championship game intensity",
    time: "Q2 8:14",
    score: "14-21",
    viewers: "250K watching",
  },
  {
    id: "4",
    icon: "🎾",
    title: "Djokovic vs Alcaraz",
    description: "Wimbledon Final - Epic rally battle",
    time: "Set 2",
    score: "6-4, 3-4",
    viewers: "89K watching",
  },
  {
    id: "5",
    icon: "🏏",
    title: "India vs Australia",
    description: "Test Cricket - Day 4 decisive moments",
    time: "45.2 overs",
    score: "234/5",
    viewers: "156K watching",
  },
];

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "1",
    icon: "⚽",
    title: "Mbappe Signs Historic Deal",
    description:
      "Real Madrid announces record-breaking transfer for French superstar",
    time: "2 hours ago",
    comments: "1.2K comments",
    badge: "BREAKING",
  },
  {
    id: "2",
    icon: "🏀",
    title: "LeBron Reaches 40K Points",
    description:
      "King James makes history with unprecedented milestone achievement",
    time: "5 hours ago",
    comments: "892 comments",
    badge: "NEWS",
  },
  {
    id: "3",
    icon: "🎾",
    title: "Serena Returns to Court",
    description:
      "Tennis legend announces comeback tournament in Miami next month",
    time: "8 hours ago",
    comments: "645 comments",
    badge: "NEWS",
  },
  {
    id: "4",
    icon: "⚾",
    title: "Yankees Win World Series",
    description: "First championship in 15 years with dramatic Game 7 victory",
    time: "1 day ago",
    comments: "2.1K comments",
    badge: "NEWS",
  },
  {
    id: "5",
    icon: "🏁",
    title: "Hamilton Breaks Records",
    description: "Formula 1 legend secures 8th world championship in Abu Dhabi",
    time: "2 days ago",
    comments: "1.5K comments",
    badge: "NEWS",
  },
];

const APP_ITEMS: AppItem[] = [
  { icon: "🏠", name: "Portal", route: "/" },
  { icon: "🤖", name: "Predictions", route: "/predictions" },
  { icon: "⚡", name: "Live", route: "/live" },
  { icon: "👥", name: "Social", route: "/social" },
  { icon: "🎮", name: "Kids Mode", route: "/kids" },
  { icon: "🏆", name: "Rewards", route: "/rewards" },
  { icon: "📊", name: "Analytics", route: "/analytics" },
  { icon: "💬", name: "Chat", route: "/chat" },
  { icon: "🎯", name: "Challenges", route: "/challenges" },
];

const FEATURE_APPS: FeatureApp[] = [
  {
    icon: "🏠",
    title: "Portal",
    description: "Main dashboard & navigation hub",
    items: [
      "page.tsx - Landing with feature cards",
      "layout.tsx - Portal-specific layout",
    ],
  },
  {
    icon: "🤖",
    title: "Predictions",
    description: "AI Predictions & ML Features",
    items: [
      "ai-predictions/ - ML interface",
      "coach/ - AI coach assistant",
      "analytics/ - Prediction analytics",
    ],
  },
  {
    icon: "⚡",
    title: "Live Tracking",
    description: "Real-time sports updates",
    items: [
      "matches/ - Live match tracker",
      "scores/ - Live scores display",
      "odds/ - Live odds updates",
    ],
  },
  {
    icon: "👥",
    title: "Social",
    description: "Community & engagement",
    items: [
      "feed/ - Social feed",
      "challenges/ - Friend challenges",
      "chat/ - Live match chat",
      "forum/ - Community discussions",
    ],
  },
  {
    icon: "🎮",
    title: "Kids Mode",
    description: "Safe environment for children",
    items: [
      "dashboard/ - Kids dashboard",
      "quizzes/ - Educational quizzes",
      "learning/ - Learning paths",
    ],
  },
  {
    icon: "🏆",
    title: "Rewards",
    description: "Achievements & gamification",
    items: [
      "achievements/ - Achievement system",
      "leaderboard/ - Global rankings",
      "coins/ - Pi Coin management",
    ],
  },
];

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    title: "Frontend Route Groups",
    status: "complete",
    description:
      "All feature route groups created with proper layouts and navigation updated",
  },
  {
    title: "Backend Modules",
    status: "complete",
    description:
      "Module structure created and routes reorganized with feature grouping",
  },
  {
    title: "Service Layer",
    status: "progress",
    description: "Currently refactoring service layers for each module",
  },
  {
    title: "Testing & Deployment",
    status: "pending",
    description: "Feature-specific testing and deployment pipeline setup",
  },
];

const KEY_BENEFITS = [
  "✅ Better Organization",
  "✅ Easier Maintenance",
  "✅ Improved Performance",
  "✅ Team Scalability",
  "✅ Independent Testing",
  "✅ Flexible Deployment",
];

const NEXT_STEPS = [
  "1. Move remaining components into feature directories",
  "2. Create service layers for each module",
  "3. Add module-specific middleware",
  "4. Implement feature-specific testing",
];

const HELP_TOPICS = [
  {
    category: "Getting Started",
    icon: "🚀",
    items: [
      { title: "How to use Sports Central", link: "#" },
      { title: "Understanding AI Predictions", link: "#" },
      { title: "Navigating the Portal", link: "#" },
    ],
  },
  {
    category: "Features",
    icon: "⚡",
    items: [
      { title: "Live Match Tracking", link: "#" },
      { title: "Social Feed & Challenges", link: "#" },
      { title: "Rewards System", link: "#" },
    ],
  },
  {
    category: "Account",
    icon: "👤",
    items: [
      { title: "Managing Your Profile", link: "#" },
      { title: "Privacy Settings", link: "#" },
      { title: "Notifications", link: "#" },
    ],
  },
];

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function PortalPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<LiveMatch | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [language, setLanguage] = useState("en");

  // Apply theme to the body or root element
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "light";
  }, [theme]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"}`}
    >
      {/* Enhanced Google NavBar */}
      <EnhancedNavBar
        onDrawerToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        onSearchOpen={() => setIsSearchOpen(true)}
        onHelpOpen={() => setIsHelpOpen(true)}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        onProfileToggle={() => setIsProfileOpen(!isProfileOpen)}
        isProfileOpen={isProfileOpen}
        currentTheme={theme}
      />

      {/* App Drawer */}
      <AppDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        theme={theme}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        query={searchQuery}
        setQuery={setSearchQuery}
        theme={theme}
      />

      {/* Help Center Modal */}
      <HelpCenterModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        theme={theme}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        notifications={notifications}
        setNotifications={setNotifications}
        autoPlay={autoPlay}
        setAutoPlay={setAutoPlay}
        language={language}
        setLanguage={setLanguage}
      />

      {/* User Profile Dropdown */}
      {isProfileOpen && (
        <UserProfileDropdown
          onClose={() => setIsProfileOpen(false)}
          theme={theme}
        />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="text-center py-12 animate-fade-in">
          <h1
            className={`text-6xl font-bold mb-4 drop-shadow-lg ${theme === "dark" ? "text-white" : "text-white"}`}
          >
            🏗️ Sports Central
          </h1>
          <p
            className={`text-xl ${theme === "dark" ? "text-white/90" : "text-white/90"}`}
          >
            Feature-Based Architecture Documentation
          </p>
        </header>

        {/* Enhanced Live Carousel */}
        <EnhancedLiveCarousel
          matches={LIVE_MATCHES}
          onMatchClick={setSelectedMatch}
          theme={theme}
        />

        {/* Enhanced News Carousel */}
        <EnhancedNewsCarousel
          news={NEWS_ITEMS}
          onNewsClick={setSelectedNews}
          theme={theme}
        />

        {/* Auto-Loading Soccer Predictions */}
        <PredictionsAutoLoader />

        {/* Overview Section */}
        <ArchitectureOverview theme={theme} />

        {/* Frontend Apps Structure */}
        <FrontendAppsSection apps={FEATURE_APPS} theme={theme} />

        {/* Key Benefits */}
        <KeyBenefitsSection benefits={KEY_BENEFITS} theme={theme} />

        {/* Data Flow */}
        <DataFlowSection theme={theme} />

        {/* Implementation Status */}
        <ImplementationStatusSection timeline={TIMELINE_ITEMS} theme={theme} />

        {/* Next Steps */}
        <NextStepsSection steps={NEXT_STEPS} theme={theme} />

        {/* Footer */}
        <footer
          className={`text-center py-8 text-sm ${theme === "dark" ? "text-white/70" : "text-white/90"}`}
        >
          <p className="font-semibold">Sports Central Architecture v2.0.0</p>
          <p>Last Updated: October 26, 2025</p>
        </footer>
      </div>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          theme={theme}
        />
      )}

      {/* News Detail Modal */}
      {selectedNews && (
        <NewsDetailModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
          theme={theme}
        />
      )}

      {/* Add Required Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease forwards;
        }

        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 50%,
            transparent 100%
          );
          animation: shimmer 2s infinite;
          pointer-events: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Dark Mode Styles */
        body.dark {
          background-color: #1f2937; /* Dark background */
          color: #f3f4f6; /* Light text */
        }
        body.dark .bg-white {
          background-color: #374151; /* Darker white */
        }
        body.dark .text-gray-700 {
          color: #d1d5db; /* Lighter gray for dark mode */
        }
        body.dark .text-gray-600 {
          color: #9ca3af; /* Lighter gray for dark mode */
        }
        body.dark .text-gray-500 {
          color: #6b7280; /* Slightly darker gray for dark mode */
        }
        body.dark .shadow-md {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
        }
        body.dark .shadow-xl {
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.5);
        }
        body.dark .hover\:bg-gray-100:hover {
          background-color: #4b5563; /* Darker hover background */
        }
        body.dark .border-b {
          border-color: #4b5563; /* Darker border color */
        }
        body.dark .bg-gray-50 {
          background-color: #2d3748;
        }
        body.dark .bg-gradient-to-br {
          /* Override gradient for dark mode if needed, or adjust colors */
        }
      `}</style>
    </div>
  );
}

// ============================================
// NAVBAR COMPONENT
// ============================================

function EnhancedNavBar({
  onDrawerToggle,
  onSearchOpen,
  onHelpOpen,
  onSettingsOpen,
  onProfileToggle,
  isProfileOpen,
  currentTheme,
}: {
  onDrawerToggle: () => void;
  onSearchOpen: () => void;
  onHelpOpen: () => void;
  onSettingsOpen: () => void;
  onProfileToggle: () => void;
  isProfileOpen: boolean;
  currentTheme: "light" | "dark";
}) {
  const navBgClass =
    currentTheme === "dark" ? "bg-gray-800 shadow-lg" : "bg-white shadow-md";
  const textClass = currentTheme === "dark" ? "text-white" : "text-gray-700";
  const iconColorClass =
    currentTheme === "dark" ? "text-gray-300" : "text-gray-600";
  const hoverBgClass =
    currentTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const gradientStartClass =
    currentTheme === "dark" ? "from-blue-600" : "from-indigo-600";
  const gradientEndClass =
    currentTheme === "dark" ? "to-purple-600" : "to-purple-600";

  return (
    <nav
      className={`sticky top-0 z-50 px-5 h-16 flex items-center justify-between ${navBgClass}`}
    >
      {/* Left Side */}
      <div className="flex items-center gap-5">
        <button
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${hoverBgClass}`}
          onClick={() => alert("Side menu")}
        >
          <div className="flex flex-col gap-1">
            <span
              className={`w-5 h-0.5 rounded ${currentTheme === "dark" ? "bg-white" : "bg-gray-600"}`}
            ></span>
            <span
              className={`w-5 h-0.5 rounded ${currentTheme === "dark" ? "bg-white" : "bg-gray-600"}`}
            ></span>
            <span
              className={`w-5 h-0.5 rounded ${currentTheme === "dark" ? "bg-white" : "bg-gray-600"}`}
            ></span>
          </div>
        </button>
        <div
          className={`text-2xl font-semibold bg-clip-text text-transparent flex items-center gap-2 ${gradientStartClass} ${gradientEndClass}`}
        >
          🏗️ Sports Central
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSearchOpen}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors text-xl ${hoverBgClass}`}
        >
          🔍
        </button>

        <button
          onClick={onHelpOpen}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors text-xl ${hoverBgClass}`}
        >
          ❓
        </button>

        <button
          onClick={onSettingsOpen}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors text-xl ${hoverBgClass}`}
        >
          ⚙️
        </button>

        <button
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${hoverBgClass}`}
          onClick={onDrawerToggle}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={iconColorClass}
          >
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
        </button>

        <button
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all hover:scale-110 active:scale-95 ${gradientStartClass} ${gradientEndClass} ${currentTheme === "dark" ? "text-white" : "text-white"}`}
          onClick={onProfileToggle}
        >
          SC
        </button>
      </div>
    </nav>
  );
}

// ============================================
// APP DRAWER COMPONENT
// ============================================

function AppDrawer({
  isOpen,
  onClose,
  theme,
}: {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}) {
  const overlayClasses = `fixed inset-0 bg-black/50 transition-opacity z-40 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`;
  const drawerClasses = `fixed top-20 right-5 rounded-xl shadow-2xl p-5 w-96 max-h-[480px] overflow-y-auto z-50 transition-all ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"}`;
  const drawerBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const headerTextClass = theme === "dark" ? "text-gray-200" : "text-gray-700";
  const appItemBgClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const appIconBgClass =
    theme === "dark"
      ? "bg-gray-700"
      : "bg-gradient-to-br from-indigo-500 to-purple-600";
  const appNameTextClass = theme === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <>
      <div className={overlayClasses} onClick={onClose} />

      <div className={`${drawerClasses} ${drawerBgClass}`}>
        <div
          className={`text-lg font-semibold mb-5 pb-4 border-b ${headerTextClass}`}
        >
          Sports Central Apps
        </div>
        <div className="grid grid-cols-3 gap-4">
          {APP_ITEMS.map((app, index) => (
            <button
              key={index}
              className={`flex flex-col items-center p-4 rounded-lg transition-colors cursor-pointer ${appItemBgClass}`}
            >
              <div
                className={`w-12 h-12 ${appIconBgClass} rounded-xl flex items-center justify-center text-2xl mb-2 ${theme === "dark" ? "text-white" : "text-white"}`}
              >
                {app.icon}
              </div>
              <div
                className={`text-sm font-medium text-center ${appNameTextClass}`}
              >
                {app.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ============================================
// SEARCH MODAL COMPONENT
// ============================================

function SearchModal({
  isOpen,
  onClose,
  query,
  setQuery,
  theme,
}: {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (query: string) => void;
  theme: "light" | "dark";
}) {
  const modalBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const inputClass =
    theme === "dark"
      ? "text-white bg-gray-700 focus:ring-indigo-500"
      : "text-gray-900 focus:ring-indigo-500";
  const closeButtonClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const resultBgClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`rounded-2xl shadow-2xl max-w-2xl w-full ${modalBgClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center gap-3">
          <span className="text-2xl text-indigo-500">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for matches, news, features..."
            className={`flex-1 text-lg outline-none py-2 px-3 rounded-md ${inputClass}`}
            autoFocus
          />
          <button
            onClick={onClose}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${closeButtonClass}`}
          >
            ✕
          </button>
        </div>
        {query && (
          <div className="p-4">
            {/* Placeholder for search results */}
            <div className={`p-3 rounded-lg cursor-pointer ${resultBgClass}`}>
              <div className="font-semibold">
                Example Result: Man United vs Arsenal
              </div>
              <div className="text-sm text-gray-500">Live Match</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// HELP CENTER MODAL COMPONENT
// ============================================

function HelpCenterModal({
  isOpen,
  onClose,
  theme,
}: {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}) {
  const modalBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const headerBgClass =
    theme === "dark"
      ? "from-gray-700 to-gray-800"
      : "from-indigo-600 to-purple-600";
  const closeButtonClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-white/20";
  const inputClass =
    theme === "dark"
      ? "text-white bg-gray-700 focus:ring-indigo-500"
      : "text-gray-900 focus:ring-indigo-500";
  const sectionHeaderClass =
    theme === "dark" ? "text-gray-200" : "text-gray-900";
  const linkClass =
    theme === "dark"
      ? "text-indigo-400 hover:text-indigo-300"
      : "text-indigo-600 hover:text-indigo-500";
  const topicItemBgClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden ${modalBgClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`bg-gradient-to-r ${headerBgClass} text-white p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">❓</span>Help Center
            </h2>
            <button
              onClick={onClose}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${closeButtonClass}`}
            >
              ✕
            </button>
          </div>
          <input
            placeholder="Search for help..."
            className={`w-full px-4 py-3 rounded-lg outline-none ${inputClass}`}
          />
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          {HELP_TOPICS.map((topic, i) => (
            <div key={i} className="mb-6">
              <h3
                className={`text-lg font-bold mb-3 flex items-center gap-2 ${sectionHeaderClass}`}
              >
                <span className="text-2xl">{topic.icon}</span>
                {topic.category}
              </h3>
              {topic.items.map((item, j) => (
                <div key={j} className={`p-3 rounded-lg ${topicItemBgClass}`}>
                  <a href={item.link} className={`font-medium ${linkClass}`}>
                    {item.title} →
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SETTINGS MODAL COMPONENT
// ============================================

function SettingsModal({
  isOpen,
  onClose,
  theme,
  setTheme,
  notifications,
  setNotifications,
  autoPlay,
  setAutoPlay,
  language,
  setLanguage,
}: {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  autoPlay: boolean;
  setAutoPlay: (value: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
}) {
  const modalBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const headerBgClass =
    theme === "dark"
      ? "from-gray-700 to-gray-800"
      : "from-indigo-600 to-purple-600";
  const closeButtonClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-white/20";
  const switchBgClass = theme === "dark" ? "bg-gray-600" : "bg-gray-300";
  const switchHandleClass =
    theme === "dark" ? "translate-x-6 bg-white" : "translate-x-1 bg-white";
  const optionBgClass = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const selectedOptionBgClass =
    theme === "dark" ? "bg-indigo-500 text-white" : "bg-indigo-600 text-white";
  const inputClass = theme === "dark" ? "bg-gray-700 text-gray-300 border" : "bg-white text-gray-800 border";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`rounded-2xl shadow-2xl max-w-2xl w-full ${modalBgClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`bg-gradient-to-r ${headerBgClass} text-white p-6 flex items-center justify-between`}
        >
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-2xl">⚙️</span>Settings
          </h2>
          <button
            onClick={onClose}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${closeButtonClass}`}
          >
            ✕
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Theme */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                className={theme === "dark" ? "text-gray-300" : "text-gray-800"}
              >
                Theme
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${theme === "light" ? selectedOptionBgClass : optionBgClass}`}
                >
                  ☀️ Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${theme === "dark" ? selectedOptionBgClass : optionBgClass}`}
                >
                  🌙 Dark
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Choose your preferred appearance.
            </p>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <div
                className={
                  theme === "dark"
                    ? "font-medium text-gray-300"
                    : "font-medium text-gray-800"
                }
              >
                Notifications
              </div>
              <div className="text-sm text-gray-500">
                Receive alerts for important updates.
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full relative transition-all ${notifications ? "bg-indigo-500" : switchBgClass}`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${notifications ? switchHandleClass : "translate-x-1"}`}
              />
            </button>
          </div>

          {/* Autoplay Videos */}
          <div className="flex items-center justify-between">
            <div>
              <div
                className={
                  theme === "dark"
                    ? "font-medium text-gray-300"
                    : "font-medium text-gray-800"
                }
              >
                Autoplay Videos
              </div>
              <div className="text-sm text-gray-500">
                Automatically play videos when they appear.
              </div>
            </div>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`w-12 h-6 rounded-full relative transition-all ${autoPlay ? "bg-indigo-500" : switchBgClass}`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${autoPlay ? switchHandleClass : "translate-x-1"}`}
              />
            </button>
          </div>

          {/* Language */}
          <div>
            <div
              className={
                theme === "dark"
                  ? "font-medium text-gray-300 mb-3"
                  : "font-medium text-gray-800 mb-3"
              }
            >
              Language
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg outline-none ${inputClass} ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// USER PROFILE DROPDOWN COMPONENT
// ============================================

function UserProfileDropdown({
  onClose,
  theme,
}: {
  onClose: () => void;
  theme: "light" | "dark";
}) {
  const dropdownBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const headerBgClass =
    theme === "dark"
      ? "from-gray-700 to-gray-800"
      : "from-indigo-600 to-purple-600";
  const profileInfoClass = theme === "dark" ? "text-gray-300" : "text-white/80";
  const buttonBgClass =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600"
      : "bg-white/20 hover:bg-white/30";
  const statsNumberClass =
    theme === "dark" ? "text-indigo-400" : "text-indigo-600";
  const statsLabelClass = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const menuItemBgClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const signOutClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const signOutTextClass = theme === "dark" ? "text-red-400" : "text-red-600";

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={`fixed top-20 right-5 rounded-xl shadow-2xl w-80 z-50 overflow-hidden ${dropdownBgClass}`}
      >
        <div className={`p-4 ${headerBgClass}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-full bg-white text-indigo-600 flex items-center justify-center text-2xl font-bold">
              SC
            </div>
            <div>
              <div className="font-bold text-lg">Sports Fan</div>
              <div className={`text-sm ${profileInfoClass}`}>fan@email.com</div>
            </div>
          </div>
          <button
            className={`w-full font-medium py-2 rounded-lg transition-colors ${buttonBgClass}`}
          >
            View Profile
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 p-4 border-b">
          <div>
            <div
              className={`text-2xl font-bold text-center ${statsNumberClass}`}
            >
              127
            </div>
            <div className={`text-xs text-center ${statsLabelClass}`}>
              Predictions
            </div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold text-center ${statsNumberClass}`}
            >
              1.2K
            </div>
            <div className={`text-xs text-center ${statsLabelClass}`}>
              Points
            </div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold text-center ${statsNumberClass}`}
            >
              45
            </div>
            <div className={`text-xs text-center ${statsLabelClass}`}>
              Badges
            </div>
          </div>
        </div>
        <div className="p-2">
          <button
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${menuItemBgClass}`}
          >
            <span className="text-xl">📊</span>Statistics
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${menuItemBgClass}`}
          >
            <span className="text-xl">🏆</span>Achievements
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 mt-2 border-t ${signOutClass}`}
          >
            <span className="text-xl">🚪</span>
            <span className={`font-medium ${signOutTextClass}`}>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ============================================
// ARCHITECTURE OVERVIEW COMPONENT
// ============================================

function ArchitectureOverview({ theme }: { theme: "light" | "dark" }) {
  const sectionBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const titleClass = theme === "dark" ? "text-indigo-400" : "text-indigo-600";
  const textClass = theme === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <div className={`${sectionBgClass} rounded-2xl p-8 shadow-xl`}>
      <h2 className={`text-3xl font-bold mb-5 ${titleClass}`}>📋 Overview</h2>
      <p className={`text-lg leading-relaxed ${textClass}`}>
        Sports Central is organized into feature-based apps within a monorepo
        structure. Each feature app is independent but shares common
        infrastructure.
      </p>
    </div>
  );
}

// ============================================
// FRONTEND APPS SECTION COMPONENT
// ============================================

function FrontendAppsSection({
  apps,
  theme,
}: {
  apps: FeatureApp[];
  theme: "light" | "dark";
}) {
  const sectionBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const titleClass = theme === "dark" ? "text-indigo-400" : "text-indigo-600";
  const cardBgClass =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600"
      : "bg-gradient-to-br from-gray-50 to-gray-200";
  const cardHoverClass =
    theme === "dark"
      ? "hover:shadow-xl"
      : "hover:-translate-y-2 transition-all hover:shadow-xl border-2 border-transparent hover:border-indigo-500";
  const cardTitleClass =
    theme === "dark" ? "text-indigo-400" : "text-indigo-600";
  const cardDescClass = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const listItemClass = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const listItemHoverClass =
    theme === "dark"
      ? "hover:pl-2 hover:text-indigo-400 transition-all"
      : "hover:pl-2 hover:text-indigo-600 transition-all";

  return (
    <div className={`${sectionBgClass} rounded-2xl p-8 shadow-xl`}>
      <h2 className={`text-3xl font-bold mb-6 ${titleClass}`}>
        📱 Frontend Apps
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {apps.map((app, i) => (
          <div
            key={i}
            className={`rounded-xl p-6 ${cardBgClass} ${cardHoverClass}`}
          >
            <h3
              className={`text-2xl font-bold mb-3 flex items-center gap-2 ${cardTitleClass}`}
            >
              <span className="text-3xl">{app.icon}</span>
              {app.title}
            </h3>
            <p className={`text-sm mb-4 ${cardDescClass}`}>{app.description}</p>
            <ul className="space-y-2">
              {app.items.map((item, j) => (
                <li
                  key={j}
                  className={`text-sm py-2 border-b border-gray-300 last:border-0 ${listItemClass} ${listItemHoverClass}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// KEY BENEFITS SECTION COMPONENT
// ============================================

function KeyBenefitsSection({
  benefits,
  theme,
}: {
  benefits: string[];
  theme: "light" | "dark";
}) {
  const sectionBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const titleClass = theme === "dark" ? "text-indigo-400" : "text-indigo-600";
  const benefitBgClass =
    theme === "dark"
      ? "bg-gray-700 text-gray-300"
      : "bg-gradient-to-br from-orange-100 to-pink-200";

  return (
    <div className={`${sectionBgClass} rounded-2xl p-8 shadow-xl`}>
      <h2 className={`text-3xl font-bold mb-6 ${titleClass}`}>
        🚀 Key Benefits
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((benefit, i) => (
          <div
            key={i}
            className={`p-5 rounded-xl font-semibold hover:scale-105 transition-all cursor-pointer ${benefitBgClass}`}
          >
            {benefit}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// DATA FLOW SECTION COMPONENT
// ============================================

function DataFlowSection({ theme }: { theme: "light" | "dark" }) {
  const sectionBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const titleClass = theme === "dark" ? "text-indigo-400" : "text-indigo-600";
  const textClass = theme === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <div className={`${sectionBgClass} rounded-2xl p-8 shadow-xl`}>
      <h2 className={`text-3xl font-bold mb-5 ${titleClass}`}>🔄 Data Flow</h2>
      <p className={`text-lg leading-relaxed ${textClass}`}>
        Data flows from the client-side components through API routes to the
        backend services, then to the database. State management is handled
        client-side using React's Context API and Zustand for global state.
      </p>
      {/* Placeholder for a diagram or more detailed explanation */}
    </div>
  );
}

// ============================================
// IMPLEMENTATION STATUS SECTION COMPONENT
// ============================================

function ImplementationStatusSection({
  timeline,
  theme,
}: {
  timeline: TimelineItem[];
  theme: "light" | "dark";
}) {
  const sectionBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const titleClass = theme === "dark" ? "text-indigo-400" : "text-indigo-600";
  const textClass = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const statusColors = {
    complete: theme === "dark" ? "bg-green-500" : "bg-green-500",
    progress: theme === "dark" ? "bg-yellow-500" : "bg-yellow-500",
    pending: theme === "dark" ? "bg-red-500" : "bg-red-500",
  };

  return (
    <div className={`${sectionBgClass} rounded-2xl p-8 shadow-xl`}>
      <h2 className={`text-3xl font-bold mb-6 ${titleClass}`}>
        📈 Implementation Status
      </h2>
      <div className="space-y-5">
        {timeline.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div
              className={`w-3 h-3 rounded-full mt-2.5 ${statusColors[item.status]}`}
            ></div>
            <div>
              <h3
                className={`text-lg font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}
              >
                {item.title}
              </h3>
              <p className={`text-sm ${textClass}`}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// NEXT STEPS SECTION COMPONENT
// ============================================

function NextStepsSection({
  steps,
  theme,
}: {
  steps: string[];
  theme: "light" | "dark";
}) {
  const sectionBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const titleClass = theme === "dark" ? "text-indigo-400" : "text-indigo-600";
  const textClass = theme === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <div className={`${sectionBgClass} rounded-2xl p-8 shadow-xl`}>
      <h2 className={`text-3xl font-bold mb-6 ${titleClass}`}>➡️ Next Steps</h2>
      <ul className="space-y-3 list-inside">
        {steps.map((step, index) => (
          <li key={index} className={`text-lg ${textClass}`}>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// CAROUSELS
// ============================================

function EnhancedLiveCarousel({
  matches,
  onMatchClick,
  theme,
}: {
  matches: LiveMatch[];
  onMatchClick: (match: LiveMatch) => void;
  theme: "light" | "dark";
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isPaused || isMobile) return; // Disable auto-scroll on mobile

    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, isMobile]);

  const sectionBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const titleClass = theme === "dark" ? "text-indigo-400" : "text-indigo-600";
  const buttonBgClass =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600"
      : "bg-gray-100 hover:bg-gray-200";
  const cardBgClass =
    theme === "dark"
      ? "bg-gray-700"
      : "bg-gradient-to-br from-gray-50 to-gray-200";
  const cardHoverClass =
    theme === "dark"
      ? "hover:shadow-lg"
      : "hover:-translate-y-2 transition-all hover:shadow-xl border-2 border-transparent hover:border-red-500";
  const shimmerEffectClass =
    theme === "dark"
      ? "opacity-0 group-hover:opacity-100"
      : "opacity-0 group-hover:opacity-100";
  const liveBadgeClass =
    "absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
  const cardIconTransitionClass =
    "group-hover:rotate-12 group-hover:scale-110 transition-all";
  const cardTitleClass = theme === "dark" ? "text-gray-200" : "text-gray-900";
  const cardDescClass = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const cardDetailClass = theme === "dark" ? "text-gray-300" : "text-gray-500";

  return (
    <div className={`${sectionBgClass} rounded-2xl p-6 shadow-xl`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className={`text-3xl font-bold ${titleClass}`}>⚡ Live Matches</h2>
        <div className="flex gap-2">
          <button
            onClick={() =>
              scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" })
            }
            className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 ${buttonBgClass}`}
          >
            ←
          </button>
          <button
            onClick={() =>
              scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" })
            }
            className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 ${buttonBgClass}`}
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-2"
      >
        {matches.map((m: LiveMatch) => (
          <div
            key={m.id}
            onClick={() => onMatchClick(m)}
            className={`min-w-[320px] rounded-xl p-5 cursor-pointer ${cardBgClass} ${cardHoverClass}`}
          >
            <div
              className={`shimmer-effect absolute inset-0 ${shimmerEffectClass} rounded-xl`}
            />
            <span className={liveBadgeClass}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE
            </span>
            <div
              className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4 ${cardIconTransitionClass} ${theme === "dark" ? "dark:bg-gray-700" : ""}`}
            >
              {m.icon}
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${cardTitleClass}`}>
              {m.title}
            </h3>
            <p className={`text-sm mb-4 ${cardDescClass}`}>{m.description}</p>
            <div
              className={`flex items-center gap-4 text-sm ${cardDetailClass}`}
            >
              <span>⏱️ {m.time}</span>
              <span>📊 {m.score}</span>
              <span>👥 {m.viewers}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnhancedNewsCarousel({
  news,
  onNewsClick,
  theme,
}: {
  news: NewsItem[];
  onNewsClick: (newsItem: NewsItem) => void;
  theme: "light" | "dark";
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isPaused || isMobile) return; // Disable auto-scroll on mobile

    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, isMobile]);

  const sectionBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const titleClass = theme === "dark" ? "text-indigo-400" : "text-indigo-600";
  const buttonBgClass =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600"
      : "bg-gray-100 hover:bg-gray-200";
  const cardBgClass =
    theme === "dark"
      ? "bg-gray-700"
      : "bg-gradient-to-br from-gray-50 to-gray-200";
  const cardHoverClass =
    theme === "dark"
      ? "hover:shadow-lg"
      : "hover:-translate-y-2 transition-all hover:shadow-xl border-2 border-transparent hover:border-indigo-500";
  const badgeClass = (badge: "BREAKING" | "NEWS") =>
    badge === "BREAKING"
      ? theme === "dark"
        ? "bg-blue-700"
        : "bg-blue-500"
      : theme === "dark"
        ? "bg-gray-600"
        : "bg-blue-400";
  const cardTitleClass = theme === "dark" ? "text-gray-200" : "text-gray-900";
  const cardDescClass = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const cardDetailClass = theme === "dark" ? "text-gray-300" : "text-gray-500";

  return (
    <div className={`${sectionBgClass} rounded-2xl p-6 shadow-xl`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className={`text-3xl font-bold ${titleClass}`}>📰 Latest News</h2>
        <div className="flex gap-2">
          <button
            onClick={() =>
              scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" })
            }
            className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 ${buttonBgClass}`}
          >
            ←
          </button>
          <button
            onClick={() =>
              scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" })
            }
            className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 ${buttonBgClass}`}
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-2"
      >
        {news.map((n: NewsItem) => (
          <div
            key={n.id}
            onClick={() => onNewsClick(n)}
            className={`min-w-[320px] rounded-xl p-5 cursor-pointer ${cardBgClass} ${cardHoverClass}`}
          >
            <span
              className={`absolute top-4 right-4 ${badgeClass(n.badge)} text-white px-3 py-1 rounded-full text-xs font-semibold`}
            >
              {n.badge === "BREAKING" ? "🔥" : "📰"} {n.badge}
            </span>
            <div
              className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4 ${theme === "dark" ? "dark:bg-gray-700" : ""}`}
            >
              {n.icon}
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${cardTitleClass}`}>
              {n.title}
            </h3>
            <p className={`text-sm mb-4 ${cardDescClass}`}>{n.description}</p>
            <div
              className={`flex items-center gap-4 text-sm ${cardDetailClass}`}
            >
              <span>🕐 {n.time}</span>
              <span>💬 {n.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MODALS
// ============================================

function MatchDetailModal({
  match,
  onClose,
  theme,
}: {
  match: LiveMatch;
  onClose: () => void;
  theme: "light" | "dark";
}) {
  const modalBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const headerBgClass =
    theme === "dark"
      ? "from-gray-700 to-gray-800"
      : "from-indigo-600 to-purple-600";
  const closeButtonClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-white/20";
  const statBgClass =
    theme === "dark"
      ? "bg-gray-700"
      : "bg-gradient-to-br from-gray-50 to-gray-100";
  const statTextClass = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const statScoreClass =
    theme === "dark" ? "text-indigo-400" : "text-indigo-600";
  const primaryButtonClass =
    theme === "dark"
      ? "bg-indigo-500 hover:bg-indigo-400"
      : "bg-indigo-600 hover:bg-indigo-700";
  const secondaryButtonClass =
    theme === "dark"
      ? "border-indigo-500 text-indigo-400 hover:bg-gray-700"
      : "border-indigo-600 text-indigo-600 hover:bg-indigo-50";
  const progressBgClass = theme === "dark" ? "bg-gray-600" : "bg-gray-200";
  const progressBarClass = theme === "dark" ? "bg-indigo-500" : "bg-indigo-600";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto ${modalBgClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 rounded-t-2xl ${headerBgClass}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center text-4xl ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}
              >
                {match.icon}
              </div>
              <div>
                <span className="inline-flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                  🔴 LIVE
                </span>
                <h2
                  className={`text-2xl font-bold ${theme === "dark" ? "text-white" : ""}`}
                >
                  {match.title}
                </h2>
                <p
                  className={`text-sm ${theme === "dark" ? "text-white/80" : "text-white/80"}`}
                >
                  {match.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${closeButtonClass}`}
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className={`rounded-xl p-6 ${statBgClass}`}>
            <div className="text-center mb-4">
              <div className={`text-5xl font-bold ${statScoreClass}`}>
                {match.score}
              </div>
              <div className={`mt-2 ${statTextClass}`}>{match.time}</div>
            </div>
            <div
              className={`flex items-center justify-center gap-6 text-sm ${statTextClass}`}
            >
              <span>👥 {match.viewers}</span>
            </div>
          </div>
          <div>
            <h3
              className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}
            >
              Match Statistics
            </h3>
            <div className="space-y-3">
              {[
                { l: "Possession", v: 55 },
                { l: "Shots", v: 70 },
                { l: "Accuracy", v: 85 },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className={statTextClass}>{s.l}</span>
                  <div
                    className={`flex-1 mx-4 ${progressBgClass} rounded-full h-2 overflow-hidden`}
                  >
                    <div
                      className={`bg-indigo-600 h-full`}
                      style={{ width: `${s.v}%` }}
                    />
                  </div>
                  <span
                    className={`font-semibold ${theme === "dark" ? "text-gray-300" : ""}`}
                  >
                    {s.v}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className={`flex-1 font-semibold py-3 rounded-xl ${primaryButtonClass} text-white`}
            >
              Watch Live 📺
            </button>
            <button
              className={`flex-1 border-2 font-semibold py-3 rounded-xl ${secondaryButtonClass}`}
            >
              Share 📤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsDetailModal({
  news,
  onClose,
  theme,
}: {
  news: NewsItem;
  onClose: () => void;
  theme: "light" | "dark";
}) {
  const modalBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const headerBgClass =
    theme === "dark"
      ? "from-gray-700 to-gray-800"
      : "from-indigo-600 to-purple-600";
  const closeButtonClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-white/20";
  const badgeBgClass =
    news.badge === "BREAKING"
      ? theme === "dark"
        ? "bg-blue-700"
        : "bg-blue-500"
      : theme === "dark"
        ? "bg-gray-600"
        : "bg-blue-400";
  const titleClass = theme === "dark" ? "text-white" : "";
  const descriptionClass = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const metaClass = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto ${modalBgClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 rounded-t-2xl ${headerBgClass}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center text-4xl ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}
              >
                {news.icon}
              </div>
              <div>
                <span
                  className={`inline-flex items-center gap-2 ${badgeBgClass} px-3 py-1 rounded-full text-xs font-semibold mb-2`}
                >
                  {news.badge === "BREAKING" ? "🔥" : "📰"} {news.badge}
                </span>
                <h2 className={`text-2xl font-bold ${titleClass}`}>
                  {news.title}
                </h2>
                <p
                  className={`text-sm ${theme === "dark" ? "text-white/80" : "text-white/80"}`}
                >
                  {news.time}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${closeButtonClass}`}
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className={`text-lg leading-relaxed mb-6 ${descriptionClass}`}>
            {news.description}
          </p>
          <div className={`flex items-center gap-4 text-sm ${metaClass}`}>
            <span>🕐 {news.time}</span>
            <span>💬 {news.comments}</span>
          </div>
          <div className="mt-6">
            <button
              onClick={onClose}
              className={`w-full font-semibold py-3 rounded-xl ${theme === "dark" ? "bg-indigo-500 hover:bg-indigo-400 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STYLESHEET
// ============================================
// Moved inline styles to a global style tag within the main component for simplicity.
// Add custom styles here if needed.
