
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface AuthorProfile {
  author: {
    id: string;
    name: string;
    icon: string;
    bio: string;
    expertise: string[];
    collaborationCount: number;
    lastCollaboration?: string;
    isActive: boolean;
  };
  recentNews: Array<{
    id: number;
    title: string;
    preview: string;
    createdAt: string;
    viewCount: number;
    tags: string[];
  }>;
  stats: {
    totalArticles: number;
    totalViews: number;
  };
}

export default function AuthorProfilePage() {
  const params = useParams();
  const authorId = params.id as string;
  const [profile, setProfile] = useState<AuthorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthorProfile();
  }, [authorId]);

  const fetchAuthorProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://0.0.0.0:3001/api/news/authors/${authorId}/profile`);
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
      } else {
        setError(data.message || 'Failed to fetch author profile');
      }
    } catch (err) {
      setError('Failed to load author profile. Please try again.');
      console.error('Error fetching author profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-600 rounded-xl p-8 max-w-md">
          <h2 className="text-white text-xl font-bold mb-2">Error</h2>
          <p className="text-red-200 mb-4">{error || 'Author not found'}</p>
          <Link href="/en/author" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block">
            Back to Authors
          </Link>
        </div>
      </div>
    );
  }

  const { author, recentNews, stats } = profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/en/author" 
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Authors
        </Link>

        {/* Author Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-start gap-6">
            <div className="text-6xl">{author.icon}</div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{author.name}</h1>
              <p className="text-gray-300 text-lg mb-4">{author.bio}</p>
              
              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {author.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-500/20 border border-blue-500/50 text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  author.isActive 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/50'
                }`}>
                  {author.isActive ? '✓ Active' : 'Inactive'}
                </span>
                {author.lastCollaboration && (
                  <span className="text-gray-400 text-sm">
                    Last active: {new Date(author.lastCollaboration).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="text-blue-300 text-sm font-semibold mb-2">Total Collaborations</div>
            <div className="text-white text-3xl font-bold">{author.collaborationCount}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="text-green-300 text-sm font-semibold mb-2">Total Articles</div>
            <div className="text-white text-3xl font-bold">{stats.totalArticles}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="text-orange-300 text-sm font-semibold mb-2">Total Views</div>
            <div className="text-white text-3xl font-bold">{stats.totalViews.toLocaleString()}</div>
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📰</span>
            Recent Articles
          </h2>

          {recentNews.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No articles yet</p>
          ) : (
            <div className="space-y-4">
              {recentNews.map((news) => (
                <div
                  key={news.id}
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-white/10 transition-all hover:border-blue-500/50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white flex-1">{news.title}</h3>
                    <span className="text-gray-400 text-sm whitespace-nowrap ml-4">
                      {new Date(news.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{news.preview}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {news.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <span>👁️</span>
                        {news.viewCount} views
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
