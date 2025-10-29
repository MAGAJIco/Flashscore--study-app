
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { liveDataApi, NewsItem } from '@/lib/api/liveData';

export function NewsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNews = async () => {
    try {
      const data = await liveDataApi.fetchLatestNews();
      setNews(data.length > 0 ? data : getFallbackNews());
    } catch (error) {
      console.error('Error:', error);
      setNews(getFallbackNews());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackNews = (): NewsItem[] => [
    {
      id: '1',
      icon: '⚽',
      badge: 'BREAKING',
      title: 'Mbappe Signs Historic Deal',
      description: 'Real Madrid announces record-breaking transfer for French superstar',
      time: '2 hours ago',
      comments: '1.2K',
    },
    {
      id: '2',
      icon: '🏀',
      badge: 'NEWS',
      title: 'LeBron Reaches 40K Points',
      description: 'King James makes history with unprecedented milestone achievement',
      time: '5 hours ago',
      comments: '892',
    }
  ];

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction * 340,
        behavior: 'smooth',
      });
    }
  };

  const handleNewsClick = (item: NewsItem) => {
    setSelectedNews(item);
  };

  const handleShare = (item: NewsItem) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${item.title} - ${window.location.href}`);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse">
        <div className="h-8 bg-white/20 rounded mb-4 w-48"></div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[320px] h-48 bg-white/10 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 animate-fadeIn">
            📰 Latest News
            <span className="text-sm font-normal text-gray-300">({news.length})</span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              aria-label="Scroll right"
            >
              →
            </button>
            <button
              onClick={fetchNews}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              aria-label="Refresh"
              title="Refresh news"
            >
              🔄
            </button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {news.map((item, index) => (
            <div 
              key={item.id}
              onClick={() => handleNewsClick(item)}
              className="min-w-[320px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-5 border-2 border-blue-500/30 hover:border-blue-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 cursor-pointer relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                  item.badge === 'BREAKING' 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {item.badge === 'BREAKING' ? '🔥 BREAKING' : '📰 NEWS'}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-300">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 hover:scale-110 transition-transform">🕐 {item.time}</span>
                  <span className="flex items-center gap-1 hover:scale-110 transition-transform">💬 {item.comments}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(item);
                  }}
                  className="hover:text-blue-400 hover:scale-125 transition-all"
                  title="Share"
                >
                  🔗
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedNews && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedNews(null)}
        >
          <div 
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-3xl w-full border-2 border-blue-500 shadow-2xl transform animate-scaleIn max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                  selectedNews.badge === 'BREAKING' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {selectedNews.badge}
                </span>
                <h3 className="text-3xl font-bold text-white mb-2">{selectedNews.title}</h3>
                <p className="text-gray-400">{selectedNews.time}</p>
              </div>
              <button 
                onClick={() => setSelectedNews(null)}
                className="text-white hover:text-red-500 text-2xl transition-colors ml-4"
              >
                ✕
              </button>
            </div>
            
            <div className="text-gray-300 text-lg leading-relaxed mb-6">
              {selectedNews.description}
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
              <span className="flex items-center gap-2">💬 {selectedNews.comments} comments</span>
              {selectedNews.author && <span className="flex items-center gap-2">✍️ {selectedNews.author}</span>}
              {selectedNews.viewCount && <span className="flex items-center gap-2">👁️ {selectedNews.viewCount} views</span>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleShare(selectedNews)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
              >
                Share 🔗
              </button>
              <button
                onClick={() => setSelectedNews(null)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
