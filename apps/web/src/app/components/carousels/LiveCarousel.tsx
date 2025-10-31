"use client";

import React, { useRef, useState, useEffect } from 'react';

interface SentimentData {
  mood: 'excited' | 'tense' | 'disappointed' | 'jubilant' | 'anxious';
  intensity: number; // 0-100
  trendingHashtags: string[];
  emotionBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

// Define Match interface based on the provided changes for clarity, though not explicitly changed in content.
interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  time: string;
  venue?: string;
  competition?: string; // Added for potential API data
  sentiment?: SentimentData; // Added for potential API data
  watching?: string; // Added for potential API data
}

// No fallback data - only show actual live matches from API
const FALLBACK_MATCHES: Match[] = [];

const LIVE_MATCHES_DATA = [ // This original LIVE_MATCHES data is now effectively replaced by the API fetch and fallback logic.
  {
    icon: '⚽',
    title: 'Man United vs Arsenal',
    description: 'Premier League - Thrilling match at Old Trafford',
    time: "67'",
    score: '2-1',
    watching: '73K watching',
    venue: 'Old Trafford',
    competition: 'Premier League',
    sentiment: {
      mood: 'excited' as const,
      intensity: 85,
      trendingHashtags: ['#MUNARS', '#PremierLeague', '#OldTrafford'],
      emotionBreakdown: { positive: 65, negative: 20, neutral: 15 }
    }
  },
  {
    icon: '🏀',
    title: 'Lakers vs Warriors',
    description: 'NBA - Western Conference showdown',
    time: "Q3 5:32",
    score: '89-92',
    watching: '125K watching',
    venue: 'Chase Center',
    competition: 'NBA',
    sentiment: {
      mood: 'tense' as const,
      intensity: 92,
      trendingHashtags: ['#LakeShow', '#DubNation', '#NBAonESPN'],
      emotionBreakdown: { positive: 45, negative: 35, neutral: 20 }
    }
  },
  {
    icon: '🎾',
    title: 'Djokovic vs Alcaraz',
    description: 'ATP Finals - Semi-final clash',
    time: 'Set 2',
    score: '6-4, 3-3',
    watching: '45K watching',
    venue: 'Pala Alpitour',
    competition: 'ATP Finals',
    sentiment: {
      mood: 'anxious' as const,
      intensity: 78,
      trendingHashtags: ['#ATPFinals', '#Tennis', '#Djokovic'],
      emotionBreakdown: { positive: 55, negative: 25, neutral: 20 }
    }
  },
  {
    icon: '🏈',
    title: 'Chiefs vs Eagles',
    description: 'NFL - Super Bowl rematch',
    time: "Q2 7:15",
    score: '14-10',
    watching: '210K watching',
    venue: 'Arrowhead Stadium',
    competition: 'NFL',
    sentiment: {
      mood: 'jubilant' as const,
      intensity: 88,
      trendingHashtags: ['#ChiefsKingdom', '#FlyEaglesFly', '#NFL'],
      emotionBreakdown: { positive: 70, negative: 15, neutral: 15 }
    }
  },
];


const getMoodEmoji = (mood: SentimentData['mood']) => {
  const moods = {
    excited: '🔥',
    tense: '😰',
    disappointed: '😔',
    jubilant: '🎉',
    anxious: '😬'
  };
  return moods[mood];
};

const getMoodColor = (mood: SentimentData['mood']) => {
  const colors = {
    excited: 'from-orange-500 to-red-500',
    tense: 'from-yellow-500 to-orange-500',
    disappointed: 'from-gray-500 to-blue-500',
    jubilant: 'from-green-500 to-emerald-500',
    anxious: 'from-purple-500 to-pink-500'
  };
  return colors[mood];
};

export function LiveCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showSentiment, setShowSentiment] = useState(true);
  const [animatingCards, setAnimatingCards] = useState<Set<number>>(new Set());
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch only live matches from API
    fetch('/api/matches/live', {
      cache: 'no-store'
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('API not available');
        }
        return res.json();
      })
      .then(data => {
        if (data?.data && Array.isArray(data.data)) {
          setMatches(data.data);
        } else {
          setMatches([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setMatches([]);
        setLoading(false);
      });
  }, []);

  // Simulate real-time sentiment updates - This part remains unchanged in functionality
  useEffect(() => {
    const interval = setInterval(() => {
      // Use the length of the currently displayed `matches` for simulation, not `LIVE_MATCHES_DATA`
      if (matches.length > 0) {
        const randomIndex = Math.floor(Math.random() * matches.length);
        setAnimatingCards(prev => new Set(prev).add(randomIndex));
        setTimeout(() => {
          setAnimatingCards(prev => {
            const next = new Set(prev);
            next.delete(randomIndex);
            return next;
          });
        }, 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [matches]); // Depend on `matches` to ensure randomIndex is within bounds

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction * 340,
        behavior: 'smooth',
      });
    }
  };

  // Helper to map fetched/fallback match data to the structure expected by the JSX
  const getMatchDisplayData = (match: Match) => {
    const defaultSentiment: SentimentData = {
      mood: 'anxious', // Changed from 'neutral' to a more dynamic mood
      intensity: 50,
      trendingHashtags: [],
      emotionBreakdown: { positive: 30, negative: 30, neutral: 40 }
    };

    // Use provided sentiment if available, otherwise use default.
    const sentimentData = match.sentiment || defaultSentiment;

    // Determine icon based on competition.
    let competitionIcon = '❓'; // Default icon
    if (match.competition) {
      if (match.competition.toLowerCase().includes('premier league')) competitionIcon = '⚽';
      else if (match.competition.toLowerCase().includes('nba')) competitionIcon = '🏀';
      else if (match.competition.toLowerCase().includes('atp') || match.competition.toLowerCase().includes('tennis')) competitionIcon = '🎾';
      else if (match.competition.toLowerCase().includes('nfl')) competitionIcon = '🏈';
    }

    return {
      ...match,
      icon: competitionIcon,
      sentiment: sentimentData,
      competition: match.competition || 'Unknown Competition', // Ensure competition is displayed
      title: match.homeTeam && match.awayTeam ? `${match.homeTeam} vs ${match.awayTeam}` : 'Match Title Missing', // Construct title from teams
      description: match.status ? `${match.status} - ${match.venue || 'Unknown Venue'}` : 'Match Description Missing', // Construct description
      watching: match.watching || 'N/A', // Use provided watching count or placeholder
      time: match.time || 'N/A', // Use provided time or placeholder
      score: match.homeScore !== undefined && match.awayScore !== undefined ? `${match.homeScore}-${match.awayScore}` : 'Score N/A' // Construct score
    };
  };


  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3 animate-fadeIn">
          ⚡ Live Matches
          <span className="text-sm font-normal text-gray-300">({matches.length})</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSentiment(!showSentiment)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-110 ${
              showSentiment
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            title="Toggle Sentiment Analysis"
          >
            {showSentiment ? '🧠 AI ON' : '🧠 AI OFF'}
          </button>
          <button
            onClick={() => scroll(-1)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-red-500 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-red-500/50 active:scale-95 active:bg-red-600 text-xl font-bold"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-red-500 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-red-500/50 active:scale-95 active:bg-red-600 text-xl font-bold"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-white text-xl">Loading live matches...</div>
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">⚽</div>
          <div className="text-white text-xl font-semibold mb-2">No Live Matches</div>
          <div className="text-gray-300">Check back when games are in progress</div>
        </div>
      ) : (
        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {matches.map((match, index) => {
          // Get display data, mapping API/fallback data to the component's needs
          const displayMatch = getMatchDisplayData(match);
          return (
            <div
              key={index} // Using index as key is generally discouraged if items can be reordered/deleted. If `matches` array comes from an API with stable IDs, use `match.id` instead.
              className={`min-w-[320px] max-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-2 border-transparent hover:border-red-500 relative group overflow-hidden ${
                animatingCards.has(index) ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient border effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" style={{ padding: '2px' }}>
                <div className="absolute inset-[2px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl"></div>
              </div>

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {/* LIVE Badge with enhanced pulse */}
              <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse-badge shadow-lg">
                🔴 LIVE
              </span>

              {/* Sentiment Indicator - NEW FEATURE */}
              {showSentiment && (
                <div className="absolute top-4 left-4 z-10">
                  <div className={`bg-gradient-to-r ${getMoodColor(displayMatch.sentiment.mood)} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse-badge`}>
                    {getMoodEmoji(displayMatch.sentiment.mood)}
                    <span className="capitalize">{displayMatch.sentiment.mood}</span>
                  </div>
                  <div className="mt-1 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                    Intensity: {displayMatch.sentiment.intensity}%
                  </div>
                </div>
              )}

              {/* Icon with white background and hover effect */}
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4 shadow-md transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                {displayMatch.icon}
              </div>

              {/* Title with hover color change */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                {displayMatch.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {displayMatch.description}
              </p>

              {/* Metadata - Enhanced */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1 hover:scale-110 transition-transform">⏱️ {displayMatch.time}</span>
                  <span className="flex items-center gap-1 font-bold text-gray-900 hover:scale-110 transition-transform">📊 {displayMatch.score}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1 hover:scale-110 transition-transform">📍 {displayMatch.venue}</span>
                  <span className="flex items-center gap-1 hover:scale-110 transition-transform">👥 {displayMatch.watching}</span>
                </div>
              </div>

              {/* Competition badge */}
              <div className="absolute bottom-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-md">
                {displayMatch.competition}
              </div>

              {/* Sentiment Analysis Panel - Expandable on Hover */}
              {showSentiment && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent text-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-b-xl">
                  <div className="text-xs font-bold mb-2">🧠 AI Sentiment Analysis</div>

                  {/* Emotion Breakdown Bar */}
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-green-500"
                      style={{ width: `${displayMatch.sentiment.emotionBreakdown.positive}%` }}
                      title={`Positive: ${displayMatch.sentiment.emotionBreakdown.positive}%`}
                    ></div>
                    <div
                      className="bg-gray-400"
                      style={{ width: `${displayMatch.sentiment.emotionBreakdown.neutral}%` }}
                      title={`Neutral: ${displayMatch.sentiment.emotionBreakdown.neutral}%`}
                    ></div>
                    <div
                      className="bg-red-500"
                      style={{ width: `${displayMatch.sentiment.emotionBreakdown.negative}%` }}
                      title={`Negative: ${displayMatch.sentiment.emotionBreakdown.negative}%`}
                    ></div>
                  </div>

                  {/* Trending Hashtags */}
                  <div className="flex flex-wrap gap-1">
                    {displayMatch.sentiment.trendingHashtags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-500/30 px-2 py-0.5 rounded text-xs hover:bg-blue-500/50 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}