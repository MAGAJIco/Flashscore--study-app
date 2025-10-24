'use client';

import React, { useState, useEffect } from 'react';

// Mock types for demonstration
interface NewsAuthor {
  id: string;
  name: string;
  icon: string;
  bio: string;
  expertise: string[];
  collaborationCount?: number;
}

interface NewsItem {
  id: string;
  preview: string;
  collaborationType: string;
  author: NewsAuthor | string;
  timestamp?: number;
}

// Mock services for demonstration
const NewsAuthorService = {
  getAllAuthors: async (): Promise<NewsAuthor[]> => {
    return [
      { id: 'mara', name: 'Mara AI', icon: '🤖', bio: 'AI Football Analyst', expertise: ['Predictions', 'Data Analysis'], collaborationCount: 15 },
      { id: 'alex', name: 'Alex Stone', icon: '⚽', bio: 'Senior Football Reporter', expertise: ['Premier League', 'Transfers'], collaborationCount: 23 }
    ];
  },
  createOrUpdateAuthor: async (author: any) => {
    console.log('Creating author:', author);
    return author;
  },
  simulateMaraCollaboration: async () => {
    return { id: Date.now().toString(), success: true };
  },
  celebrateMilestone: async (authorId: string, count: number) => {
    return { id: Date.now().toString(), success: true };
  },
  shareAnalysis: async (authorId: string, topic: string) => {
    return { id: Date.now().toString(), success: true };
  }
};

const NewsService = {
  getAllNews: async () => {
    return {
      data: [
        { id: '1', preview: 'Manchester United predicted to win next match with 72% confidence', collaborationType: 'prediction', author: 'mara' },
        { id: '2', preview: 'Transfer deadline day analysis: Top 5 signings breakdown', collaborationType: 'analysis', author: 'alex' }
      ]
    };
  }
};

interface NewsAuthorManagerProps {
  className?: string;
}

export function NewsAuthorManager({ className = '' }: NewsAuthorManagerProps) {
  const [authors, setAuthors] = useState<NewsAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newAuthor, setNewAuthor] = useState({
    id: '',
    name: '',
    icon: '📝',
    bio: '',
    expertise: ''
  });

  useEffect(() => {
    loadAuthors();
    loadRecentNews();
  }, []);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAuthors = await NewsAuthorService.getAllAuthors();
      setAuthors(fetchedAuthors);
    } catch (error) {
      console.error('Failed to load authors:', error);
      setError('Failed to load authors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentNews = async () => {
    try {
      const newsResponse = await NewsService.getAllNews();
      setRecentNews(newsResponse.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load recent news:', error);
    }
  };

  const handleCreateAuthor = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newAuthor.id || !newAuthor.name) {
      setError('ID and Name are required');
      return;
    }

    try {
      setError(null);
      const authorData = {
        ...newAuthor,
        expertise: newAuthor.expertise.split(',').map(e => e.trim()).filter(e => e.length > 0)
      };

      await NewsAuthorService.createOrUpdateAuthor(authorData);
      setNewAuthor({ id: '', name: '', icon: '📝', bio: '', expertise: '' });
      setShowCreateForm(false);
      setSuccessMessage('Author created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      loadAuthors();
    } catch (error) {
      console.error('Failed to create author:', error);
      setError('Failed to create author. Please try again.');
    }
  };

  const handleGenerateAutoNews = async (authorId: string, type: string) => {
    try {
      setError(null);
      let result = null;

      switch (type) {
        case 'prediction':
          result = await NewsAuthorService.simulateMaraCollaboration();
          break;
        case 'milestone':
          result = await NewsAuthorService.celebrateMilestone(authorId, Math.floor(Math.random() * 20) + 10);
          break;
        case 'analysis':
          result = await NewsAuthorService.shareAnalysis(authorId, 'Premier League Form Analysis');
          break;
      }

      if (result) {
        loadRecentNews();
        const author = authors.find(a => a.id === authorId);
        setSuccessMessage(`Auto news generated successfully for ${author?.name}!`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Failed to generate auto news:', error);
      setError('Failed to generate news. Please try again.');
    }
  };

  const normalizeAuthor = (author: NewsAuthor | string): NewsAuthor => {
    if (typeof author === 'string') {
      return {
        id: author,
        name: author,
        icon: '📝',
        bio: '',
        expertise: [],
        collaborationCount: 0
      };
    }
    return author;
  };

  if (loading) {
    return (
      <div className={`bg-gray-900 text-white p-6 rounded-lg shadow-lg ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 text-white p-6 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>📰</span>
          News Author Management
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          {showCreateForm ? 'Cancel' : '+ Add Author'}
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-900/50 border border-green-600 text-green-200 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Create Author Form */}
      {showCreateForm && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Author</h3>
          <form onSubmit={handleCreateAuthor} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 block mb-1">ID *</label>
                <input
                  required
                  value={newAuthor.id}
                  onChange={(e) => setNewAuthor(prev => ({ ...prev, id: e.target.value }))}
                  className="w-full p-2 bg-gray-700 rounded text-white"
                  placeholder="e.g., john-doe"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Name *</label>
                <input
                  required
                  value={newAuthor.name}
                  onChange={(e) => setNewAuthor(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 bg-gray-700 rounded text-white"
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Icon</label>
                <input
                  value={newAuthor.icon}
                  onChange={(e) => setNewAuthor(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full p-2 bg-gray-700 rounded text-white"
                  placeholder="e.g., ⚽"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Expertise (comma separated)</label>
                <input
                  value={newAuthor.expertise}
                  onChange={(e) => setNewAuthor(prev => ({ ...prev, expertise: e.target.value }))}
                  className="w-full p-2 bg-gray-700 rounded text-white"
                  placeholder="e.g., Transfers, Tactics"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-300 block mb-1">Bio</label>
                <textarea
                  value={newAuthor.bio}
                  onChange={(e) => setNewAuthor(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full p-2 bg-gray-700 rounded text-white"
                  rows={3}
                  placeholder="Brief description of the author..."
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors">
                Create Author
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowCreateForm(false);
                  setNewAuthor({ id: '', name: '', icon: '📝', bio: '', expertise: '' });
                }} 
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recent News */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Recent Auto News</h3>

        {recentNews.length === 0 ? (
          <p className="text-sm text-gray-400">No recent auto-generated news</p>
        ) : (
          <div className="space-y-3">
            {recentNews.map((news) => {
              const author = normalizeAuthor(news.author);

              return (
                <div key={news.id} className="bg-gray-800 border-l-4 border-blue-500 p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{author.icon}</span>
                    <span className="font-medium">{author.name}</span>
                    <span className="bg-gray-700 text-xs px-2 py-1 rounded">
                      {news.collaborationType}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">{news.preview}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Author List */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Authors ({authors.length})</h3>
        {authors.length === 0 ? (
          <p className="text-gray-400">No authors yet. Create one to get started!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authors.map(author => (
              <div key={author.id} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                    {author.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{author.name}</div>
                    <div className="text-xs text-gray-400">{author.expertise?.join(', ') || 'No expertise listed'}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mb-3 line-clamp-2">{author.bio}</div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleGenerateAutoNews(author.id, 'prediction')}
                    className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm transition-colors"
                  >
                    📊 Prediction
                  </button>
                  <button
                    onClick={() => handleGenerateAutoNews(author.id, 'milestone')}
                    className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm transition-colors"
                  >
                    🎉 Milestone
                  </button>
                  <button
                    onClick={() => handleGenerateAutoNews(author.id, 'analysis')}
                    className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                  >
                    📈 Analysis
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}