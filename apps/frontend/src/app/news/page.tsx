"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  category: string;
  url: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "football", "basketball", "tennis", "cricket"];

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      // const res = await fetch(`/api/news?category=${selectedCategory}`);
      // const data = await res.json();
      
      // Mock data for demonstration
      const mockNews: NewsArticle[] = [
        {
          id: "1",
          title: "Barcelona start talks with Benfica teenager's agent as sporting director Deco considers offer for centre-back",
          excerpt: "Barcelona are exploring options to strengthen their defense with a potential move for a promising young talent.",
          imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
          source: "Goal.com",
          publishedAt: "1d",
          category: "football",
          url: "#"
        },
        {
          id: "2",
          title: "Manchester United close to finalizing deal for £60m midfielder from Real Madrid",
          excerpt: "United are in advanced negotiations to bring in a world-class midfielder to bolster their squad.",
          imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
          source: "Sky Sports",
          publishedAt: "3h",
          category: "football",
          url: "#"
        },
        {
          id: "3",
          title: "Lakers targeting three-team trade to land All-Star guard before deadline",
          excerpt: "Los Angeles is making moves to strengthen their championship aspirations with a blockbuster deal.",
          imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
          source: "ESPN",
          publishedAt: "5h",
          category: "basketball",
          url: "#"
        },
        {
          id: "4",
          title: "Djokovic reveals retirement plans after Australian Open triumph",
          excerpt: "The tennis legend opens up about his future in the sport and potential timeline for stepping away.",
          imageUrl: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80",
          source: "Tennis World",
          publishedAt: "8h",
          category: "tennis",
          url: "#"
        },
        {
          id: "5",
          title: "India secures thrilling victory in final over against Australia",
          excerpt: "A nail-biting finish sees India clinch the series with an incredible performance from their bowlers.",
          imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
          source: "Cricinfo",
          publishedAt: "12h",
          category: "cricket",
          url: "#"
        }
      ];

      const filtered = selectedCategory === "all" 
        ? mockNews 
        : mockNews.filter(article => article.category === selectedCategory);
      
      setNews(filtered);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                <span className="text-sm font-semibold">Back</span>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Sports News
              </h1>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span className="text-sm font-semibold">Home</span>
            </Link>
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 animate-pulse">
                <div className="h-48 bg-white/10 rounded-xl mb-4"></div>
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map(article => (
              <article
                key={article.id}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10 transition-all group cursor-pointer"
                onClick={() => window.location.href = article.url}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-cyan-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Title */}
                  <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                        </svg>
                        {article.source}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{article.publishedAt}</span>
                    </div>
                    
                    {/* Share Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add share functionality
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <p className="text-gray-400 text-lg">No news available in this category</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}