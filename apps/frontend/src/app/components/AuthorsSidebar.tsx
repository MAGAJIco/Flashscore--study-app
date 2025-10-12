
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Trophy, 
  Building2, 
  Bot, 
  TrendingUp, 
  Users, 
  Newspaper, 
  BarChart3, 
  DollarSign, 
  LineChart,
  Zap
} from "lucide-react";

interface Author {
  id: number;
  name: string;
  expertise: string;
  newsCount: number;
  avatar?: string;
  accuracy?: number;
  totalPredictions?: number;
}

interface NewsItem {
  id: string;
  title: string;
  authorId: number;
  date: string;
}

interface LeaderboardAuthor {
  id: number;
  name: string;
  accuracy: number;
  totalPredictions: number;
  rank: number;
}

export default function AuthorsSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([
    { id: 1, name: "John Smith", expertise: "Premier League", newsCount: 12, accuracy: 87, totalPredictions: 145 },
    { id: 2, name: "Sarah Johnson", expertise: "La Liga", newsCount: 8, accuracy: 82, totalPredictions: 98 },
    { id: 3, name: "Mike Chen", expertise: "Champions League", newsCount: 15, accuracy: 91, totalPredictions: 203 },
    { id: 4, name: "Emma Williams", expertise: "Serie A", newsCount: 6, accuracy: 78, totalPredictions: 67 },
    { id: 5, name: "David Brown", expertise: "Bundesliga", newsCount: 10, accuracy: 85, totalPredictions: 132 }
  ]);

  const [recentNews, setRecentNews] = useState<NewsItem[]>([
    { id: "1", title: "Manchester United's Winning Streak Continues", authorId: 1, date: "2h ago" },
    { id: "2", title: "Real Madrid Eyes New Striker", authorId: 2, date: "4h ago" },
    { id: "3", title: "Champions League Semi-Finals Preview", authorId: 3, date: "6h ago" },
    { id: "4", title: "Juventus Transfer Window Analysis", authorId: 4, date: "8h ago" },
    { id: "5", title: "Bayern Munich's Tactical Evolution", authorId: 5, date: "10h ago" }
  ]);

  const [selectedAuthor, setSelectedAuthor] = useState<number | null>(null);

  const getAuthorName = (authorId: number) => {
    return authors.find(a => a.id === authorId)?.name || "Unknown";
  };

  const filteredNews = selectedAuthor 
    ? recentNews.filter(n => n.authorId === selectedAuthor)
    : recentNews;

  const leaderboardAuthors: LeaderboardAuthor[] = authors
    .map((author, index) => ({
      id: author.id,
      name: author.name,
      accuracy: author.accuracy || 0,
      totalPredictions: author.totalPredictions || 0,
      rank: index + 1
    }))
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 5);

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-[#0a0e1a] border-r border-gray-700/50 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'}`}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 -right-3 z-50 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Header */}
      <Link href="/" className="block p-4 border-b border-gray-700/50 hover:bg-white/5 transition-colors">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          {!isCollapsed && 'Sports Central'}
        </h2>
        {!isCollapsed && <p className="text-gray-400 text-sm mt-1">Authors & News</p>}
      </Link>

      {!isCollapsed && (
        <>
          {/* Authors Leaderboard Section */}
          <div className="p-4 border-b border-gray-700/50">
            <h3 className="text-gray-400 text-xs font-semibold uppercase mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              Top Authors
            </h3>
            <div className="space-y-2">
              {leaderboardAuthors.map((author) => (
                <div
                  key={author.id}
                  className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 font-bold text-sm">#{author.rank}</span>
                      <div>
                        <div className="text-white text-sm font-medium">{author.name}</div>
                        <div className="text-xs text-gray-400">{author.totalPredictions} predictions</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-bold text-sm">{author.accuracy}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prediction Foundation Section */}
          <div className="p-4 border-b border-gray-700/50">
            <h3 className="text-gray-400 text-xs font-semibold uppercase mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              Prediction Foundation
            </h3>
            <div className="space-y-2">
              <Link
                href="/empire/MagajiCoFoundation"
                className="block p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium text-sm">Empire Builder</span>
                </div>
                <p className="text-xs text-gray-400">Build your prediction empire</p>
              </Link>

              <Link
                href="/empire/ai-ceo"
                className="block p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium text-sm">AI CEO</span>
                </div>
                <p className="text-xs text-gray-400">AI-powered predictions</p>
              </Link>

              <Link
                href="/empire/growth"
                className="block p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium text-sm">Growth Dashboard</span>
                </div>
                <p className="text-xs text-gray-400">Track your progress</p>
              </Link>
            </div>
          </div>

          {/* Authors Section */}
          <div className="p-4 border-b border-gray-700/50">
            <h3 className="text-gray-400 text-xs font-semibold uppercase mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Authors
            </h3>
            <div className="space-y-2">
              {authors.map((author) => (
                <button
                  key={author.id}
                  onClick={() => setSelectedAuthor(selectedAuthor === author.id ? null : author.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    selectedAuthor === author.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {author.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{author.name}</div>
                      <div className="text-xs opacity-75">{author.expertise}</div>
                    </div>
                    <div className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                      {author.newsCount}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent News Section */}
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-xs font-semibold uppercase flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                {selectedAuthor ? 'Author News' : 'Recent News'}
              </h3>
              {selectedAuthor && (
                <button
                  onClick={() => setSelectedAuthor(null)}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-3">
              {filteredNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-gray-700/50 hover:border-gray-600"
                >
                  <h4 className="text-white text-sm font-medium mb-1 line-clamp-2">
                    {news.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>By {getAuthorName(news.authorId)}</span>
                    <span>{news.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="p-4 border-b border-gray-700/50">
            <h3 className="text-gray-400 text-xs font-semibold uppercase mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Quick Links
            </h3>
            <div className="space-y-1">
              <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link href="/author" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
                <Users className="w-4 h-4" />
                All Authors
              </Link>
              <Link href="/news" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
                <Newspaper className="w-4 h-4" />
                All News
              </Link>
              <Link href="/predictions" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
                <BarChart3 className="w-4 h-4" />
                Predictions
              </Link>
              <Link href="/odds" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
                <DollarSign className="w-4 h-4" />
                Odds
              </Link>
              <Link href="/analytics" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
                <LineChart className="w-4 h-4" />
                Analytics
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-4">
            <h3 className="text-gray-400 text-xs font-semibold uppercase mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Platform Stats
            </h3>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-white/5">
                <div className="text-xs text-gray-400">Total Predictions</div>
                <div className="text-white font-bold">12,845</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <div className="text-xs text-gray-400">Active Users</div>
                <div className="text-white font-bold">3,421</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <div className="text-xs text-gray-400">Avg Accuracy</div>
                <div className="text-green-400 font-bold">84.6%</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Collapsed State Icons */}
      {isCollapsed && (
        <div className="flex flex-col items-center gap-4 mt-4">
          <Link href="/" className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition" title="Home">
            <Home className="w-5 h-5" />
          </Link>
          <Link href="/author" className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition" title="Authors">
            <Users className="w-5 h-5" />
          </Link>
          <Link href="/news" className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition" title="News">
            <Newspaper className="w-5 h-5" />
          </Link>
          <Link href="/predictions" className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition" title="Predictions">
            <BarChart3 className="w-5 h-5" />
          </Link>
          <Link href="/empire/MagajiCoFoundation" className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition" title="Empire">
            <Building2 className="w-5 h-5" />
          </Link>
        </div>
      )}
    </aside>
  );
}
