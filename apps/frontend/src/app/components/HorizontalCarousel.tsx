
import React, { useState, useEffect } from "react";

interface Card {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  gradient: string;
  bgGradient: string;
  icon: string;
  action: () => void;
  priority: number;
  show: boolean;
  category: 'sports' | 'social' | 'achievements' | 'finance' | 'community';
}

export default function HorizontalCarousel() {
  const [liveMatches, setLiveMatches] = useState(0);
  const [todayPredictions, setTodayPredictions] = useState(0);
  const [piBalance, setPiBalance] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [todayAchievements, setTodayAchievements] = useState(0);
  const [friendsOnline, setFriendsOnline] = useState(0);
  const [communityEvents, setCommunityEvents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLiveMatches(5);
        setTodayPredictions(18);
        setPiBalance(342.5);
        setUserRank(89);
        setActiveUsers(1247);
        setTodayAchievements(3);
        setFriendsOnline(12);
        setCommunityEvents(2);
      } catch (error) {
        console.error("Error fetching carousel data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const lifeConnectingCards: Card[] = [
    {
      id: "live-matches",
      title: "Live Matches",
      subtitle: `${liveMatches} ongoing`,
      value: "⚽ LIVE",
      gradient: "from-red-500 to-orange-500",
      bgGradient: "from-red-500/20 to-orange-500/20",
      icon: "🔴",
      action: () => {
        document.getElementById("prediction-preview")?.scrollIntoView({ behavior: "smooth" });
      },
      priority: 1,
      show: liveMatches > 0,
      category: 'sports'
    },
    {
      id: "community-hub",
      title: "Community Hub",
      subtitle: `${friendsOnline} friends • ${activeUsers.toLocaleString()} online`,
      value: `${communityEvents} events`,
      gradient: "from-green-500 to-cyan-500",
      bgGradient: "from-green-500/20 to-cyan-500/20",
      icon: "🌍",
      action: () => {
        document.getElementById("social-hub")?.scrollIntoView({ behavior: "smooth" });
      },
      priority: 2,
      show: activeUsers > 0,
      category: 'community'
    },
    {
      id: "today-predictions",
      title: "Today's Tips",
      subtitle: "Expert predictions",
      value: `${todayPredictions}`,
      gradient: "from-blue-500 to-purple-500",
      bgGradient: "from-blue-500/20 to-purple-500/20",
      icon: "💡",
      action: () => {
        document.getElementById("prediction-preview")?.scrollIntoView({ behavior: "smooth" });
      },
      priority: 3,
      show: true,
      category: 'sports'
    },
    {
      id: "achievements",
      title: "Achievements",
      subtitle: `Rank #${userRank}`,
      value: `${todayAchievements} new 🎯`,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/20 to-orange-500/20",
      icon: "🏆",
      action: () => {
        document.getElementById("prediction-league")?.scrollIntoView({ behavior: "smooth" });
      },
      priority: 4,
      show: todayAchievements > 0 || userRank > 0,
      category: 'achievements'
    },
    {
      id: "pi-balance",
      title: "Pi Balance",
      subtitle: "Your wallet",
      value: `${piBalance.toFixed(1)}π`,
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-500/20 to-orange-500/20",
      icon: "💰",
      action: () => {
        alert("Opening Pi Wallet...");
      },
      priority: 5,
      show: true,
      category: 'finance'
    },
  ];

  const visibleCards = lifeConnectingCards.filter((card) => card.show);

  if (visibleCards.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-8 relative z-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-green-400">⚡</span>
          Life Connection Hub
        </h3>
        {visibleCards.length > 2 && (
          <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
            Swipe →
          </span>
        )}
      </div>

      {/* Fixed Horizontal Scrolling Container */}
      <div className="relative w-full">
        <div className="carousel-scroll flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-mandatory">
          {visibleCards.map((card, index) => (
            <button
              key={card.id}
              onClick={card.action}
              className="carousel-item min-w-[170px] flex-shrink-0 snap-start focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-2xl transition-all duration-300"
              style={{
                animation: `slideInUp 0.5s ease-out ${index * 0.1}s forwards`,
                opacity: 0,
              }}
              aria-label={`${card.title}: ${card.value}`}
            >
              {/* Glass Card with Gradient */}
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-5 rounded-2xl hover:scale-105 hover:bg-white/15 hover:border-white/40 group cursor-pointer h-full relative overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-green-500/20">
                {/* Gradient Background Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
                ></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon & Status Indicator */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{card.icon}</span>
                    {(card.id === "live-matches" || card.id === "friends-online") && (
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex-1 mb-2">
                    <h4 className="text-xs font-semibold text-white mb-0.5 line-clamp-1">
                      {card.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 line-clamp-1">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Value */}
                  <div
                    className={`text-xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}
                  >
                    {card.value}
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
            </button>
          ))}
        </div>

        {/* Fade Edges Effect */}
        {visibleCards.length > 2 && (
          <>
            <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-10"></div>
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Critical fix for smooth scrolling */
        .carousel-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          overscroll-behavior-x: contain;
          touch-action: pan-x pinch-zoom;
        }

        .carousel-scroll::-webkit-scrollbar {
          display: none;
        }

        /* Ensure items snap properly */
        .carousel-item {
          scroll-snap-align: start;
          scroll-snap-stop: normal;
        }
      `}</style>
    </div>
  );
}
