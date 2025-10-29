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

// Placeholder for QuickMenuItem interface if it were defined elsewhere
interface QuickMenuItem {
  label: string;
  link: string;
}

const quickMenuItems: QuickMenuItem[] = [
  { label: "🏠 Home", link: "/" },
  { label: "📰 News", link: "/news" },
  { label: "📊 Predictions", link: "/predictions" },
  { label: "📂 Archive", link: "/archive" },
  { label: "✍️ Author", link: "/author" },
];

export function AuthorsSidebar() {
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
    <aside className={`fixed left-0 top-0 h-screen bg-white/95 backdrop-blur-xl border-r border-[#e5e5e7] overflow-y-auto transition-all duration-300 shadow-sm ${isCollapsed ? 'w-16' : 'w-80'}`}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 -right-3 z-50 w-7 h-7 bg-[#007AFF] rounded-full flex items-center justify-center text-white hover:bg-[#0051D5] active:bg-[#004BB8] transition-all shadow-md"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Header */}
      <Link href="/" className="block p-5 border-b border-[#e5e5e7] hover:bg-[#f5f5f7] transition-colors">
        <h2 className="text-[#1d1d1f] text-xl font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#FF9500]" />
          {!isCollapsed && 'Sports Central'}
        </h2>
        {!isCollapsed && <p className="text-[#6e6e73] text-sm mt-1 font-medium">Authors & News</p>}
      </Link>

      {!isCollapsed && (
        <>
          {/* Authors Leaderboard Section */}
          <div className="p-5 border-b border-[#e5e5e7]">
            <h3 className="text-[#6e6e73] text-xs font-bold uppercase mb-4 flex items-center gap-2 tracking-wide">
              <Trophy className="w-4 h-4 text-[#FFD700]" />
              Top Authors
            </h3>
            <div className="space-y-2.5">
              {leaderboardAuthors.map((author) => (
                <div
                  key={author.id}
                  className="p-3 rounded-2xl bg-[#f5f5f7] border border-[#e5e5e7] hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#FFD700] font-bold text-sm">#{author.rank}</span>
                      <div>
                        <div className="text-[#1d1d1f] text-sm font-semibold">{author.name}</div>
                        <div className="text-xs text-[#6e6e73] font-medium">{author.totalPredictions} predictions</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-bold text-sm">{author.accuracy}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prediction Foundation Section */}
          <div className="p-5 border-b border-[#e5e5e7]">
            <h3 className="text-[#6e6e73] text-xs font-bold uppercase mb-4 flex items-center gap-2 tracking-wide">
              <Zap className="w-4 h-4 text-[#5856D6]" />
              Prediction Foundation
            </h3>
            <div className="space-y-2.5">
              <Link
                href="/empire/MagajiCoFoundation"
                className="block p-3 rounded-2xl bg-[#f5f5f7] border border-[#e5e5e7] hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <Building2 className="w-5 h-5 text-[#5856D6]" />
                  <span className="text-[#1d1d1f] font-semibold text-sm">Empire Builder</span>
                </div>
                <p className="text-xs text-[#6e6e73] font-medium">Build your prediction empire</p>
              </Link>

              <Link
                href="/empire/ai-ceo"
                className="block p-3 rounded-2xl bg-[#f5f5f7] border border-[#e5e5e7] hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <Bot className="w-5 h-5 text-[#007AFF]" />
                  <span className="text-[#1d1d1f] font-semibold text-sm">AI CEO</span>
                </div>
                <p className="text-xs text-[#6e6e73] font-medium">AI-powered predictions</p>
              </Link>

              <Link
                href="/empire/growth"
                className="block p-3 rounded-2xl bg-[#f5f5f7] border border-[#e5e5e7] hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <TrendingUp className="w-5 h-5 text-[#34C759]" />
                  <span className="text-[#1d1d1f] font-semibold text-sm">Growth Dashboard</span>
                </div>
                <p className="text-xs text-[#6e6e73] font-medium">Track your progress</p>
              </Link>
            </div>
          </div>

          {/* Authors Section */}
          <div className="p-5 border-b border-[#e5e5e7]">
            <h3 className="text-[#6e6e73] text-xs font-bold uppercase mb-4 flex items-center gap-2 tracking-wide">
              <Users className="w-4 h-4" />
              Authors
            </h3>
            <div className="space-y-2">
              {authors.map((author) => (
                <button
                  key={author.id}
                  onClick={() => setSelectedAuthor(selectedAuthor === author.id ? null : author.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-2xl transition-all ${
                    selectedAuthor === author.id 
                      ? 'bg-[#007AFF] text-white shadow-sm' 
                      : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center text-white font-bold text-sm">
                      {author.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{author.name}</div>
                      <div className={`text-xs ${selectedAuthor === author.id ? 'text-white/80' : 'text-[#6e6e73]'}`}>{author.expertise}</div>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedAuthor === author.id ? 'bg-white/20 text-white' : 'bg-white text-[#1d1d1f]'
                    }`}>
                      {author.newsCount}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent News Section */}
          <div className="p-5 border-b border-[#e5e5e7]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#6e6e73] text-xs font-bold uppercase flex items-center gap-2 tracking-wide">
                <Newspaper className="w-4 h-4" />
                {selectedAuthor ? 'Author News' : 'Recent News'}
              </h3>
              {selectedAuthor && (
                <button
                  onClick={() => setSelectedAuthor(null)}
                  className="text-xs text-[#007AFF] hover:text-[#0051D5] font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2.5">
              {filteredNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="block p-3 rounded-2xl bg-[#f5f5f7] hover:bg-white hover:shadow-sm transition-all border border-[#e5e5e7]"
                >
                  <h4 className="text-[#1d1d1f] text-sm font-semibold mb-2 line-clamp-2">
                    {news.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-[#6e6e73] font-medium">
                    <span>By {getAuthorName(news.authorId)}</span>
                    <span>{news.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="p-5 border-b border-[#e5e5e7]">
            <h3 className="text-[#6e6e73] text-xs font-bold uppercase mb-3 flex items-center gap-2 tracking-wide">
              <Zap className="w-4 h-4" />
              Quick Links
            </h3>
            <div className="space-y-1.5">
              {quickMenuItems.map((item) => (
                <Link 
                  key={item.link} 
                  href={item.link} 
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#1d1d1f] font-medium hover:bg-[#f5f5f7] rounded-xl transition"
                >
                  {/* Icon mapping would go here if needed, otherwise keep as is */}
                  {item.label.split(' ')[0]} {/* Simple way to show first char as placeholder */}
                  {item.label.substring(item.label.indexOf(' ') + 1)}
                </Link>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-5 pb-8">
            <h3 className="text-[#6e6e73] text-xs font-bold uppercase mb-4 flex items-center gap-2 tracking-wide">
              <BarChart3 className="w-4 h-4" />
              Platform Stats
            </h3>
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-[#f5f5f7] border border-[#e5e5e7]">
                <div className="text-xs text-[#6e6e73] font-medium mb-1">Total Predictions</div>
                <div className="text-[#1d1d1f] font-bold text-lg">12,845</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#f5f5f7] border border-[#e5e5e7]">
                <div className="text-xs text-[#6e6e73] font-medium mb-1">Active Users</div>
                <div className="text-[#1d1d1f] font-bold text-lg">3,421</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#f5f5f7] border border-[#e5e5e7]">
                <div className="text-xs text-[#6e6e73] font-medium mb-1">Avg Accuracy</div>
                <div className="text-[#34C759] font-bold text-lg">84.6%</div>
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