"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Author {
  id: number;
  name: string;
  expertise: string;
  newsCount: number;
  avatar?: string;
}

interface NewsItem {
  id: string;
  title: string;
  authorId: number;
  date: string;
}

export default function AuthorsSidebar() {
  const [authors, setAuthors] = useState<Author[]>([
    { id: 1, name: "John Smith", expertise: "Premier League", newsCount: 12 },
    { id: 2, name: "Sarah Johnson", expertise: "La Liga", newsCount: 8 },
    { id: 3, name: "Mike Chen", expertise: "Champions League", newsCount: 15 },
    { id: 4, name: "Emma Williams", expertise: "Serie A", newsCount: 6 },
    { id: 5, name: "David Brown", expertise: "Bundesliga", newsCount: 10 }
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

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 bg-[#0a0e1a] border-r border-gray-700/50 overflow-y-auto">
      {/* Header */}
      <Link href="/" className="block p-4 border-b border-gray-700/50 hover:bg-white/5 transition-colors">
        <h2 className="text-white text-xl font-bold">⚡ Sports Central</h2>
        <p className="text-gray-400 text-sm mt-1">Authors & News</p>
      </Link>

      {/* Authors Section */}
      <div className="p-4">
        <h3 className="text-gray-400 text-xs font-semibold uppercase mb-3">Authors</h3>
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
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-400 text-xs font-semibold uppercase">
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

      {/* Footer Links */}
      <div className="p-4 border-t border-gray-700/50">
        <h3 className="text-gray-400 text-xs font-semibold uppercase mb-2">Quick Links</h3>
        <div className="space-y-1">
          <Link href="/" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
            🏠 Home
          </Link>
          <Link href="/author" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
            ✍️ All Authors
          </Link>
          <Link href="/news" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
            📰 All News
          </Link>
          <Link href="/predictions" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition">
            📊 Predictions
          </Link>
        </div>
      </div>
    </aside>
  );
}
