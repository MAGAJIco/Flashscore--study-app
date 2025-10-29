'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Star, Clock } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  preview: string;
  author: {
    name: string;
    icon: string;
    expertise?: string[];
  };
  tags: string[];
  viewCount: number;
  createdAt: string;
}

export const ConnectedNewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    fetchNews();
  }, [selectedTag]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news/latest?tag=${selectedTag}`);
      const data = await response.json();

      if (data.success) {
        setNews(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const tags = ['all', 'predictions', 'analysis', 'community', 'updates'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            Sports News Feed
          </h1>
          <p className="text-gray-400">Latest updates from expert analysts</p>
        </div>

        {/* Tag Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>

        {/* News Articles */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((article) => (
              <article
                key={article.id}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {article.author.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{article.author.name}</p>
                      {article.author.expertise && (
                        <p className="text-xs text-gray-400">{article.author.expertise.join(', ')}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {article.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h2>

                <p className="text-gray-300 mb-4 line-clamp-2">{article.preview}</p>

                <div className="flex gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && news.length === 0 && (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No news articles found</p>
          </div>
        )}
      </div>
    </div>
  );
};