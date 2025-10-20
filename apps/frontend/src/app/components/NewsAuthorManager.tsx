'use client';

import React, { useState, useEffect } from 'react';
import { NewsAuthorService } from '../services/newsAuthorService';
import { NewsService, NewsAuthor, NewsItem } from '../services/newsService';

interface NewsAuthorManagerProps {
  className?: string;
}

const NewsAuthorManager: React.FC<NewsAuthorManagerProps> = ({ className = '' }) => {
  const [authors, setAuthors] = useState<NewsAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthor, setSelectedAuthor] = useState<NewsAuthor | null>(null);
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
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
      const fetchedAuthors = await NewsAuthorService.getAllAuthors();
      setAuthors(fetchedAuthors);
    } catch (error) {
      console.error('Failed to load authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentNews = async () => {
    try {
      const news = await NewsService.getAllNews();
      setRecentNews(news.slice(0, 5)); // Show latest 5 news items
    } catch (error) {
      console.error('Failed to load recent news:', error);
    }
  };

  const handleCreateAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authorData = {
        ...newAuthor,
        expertise: newAuthor.expertise.split(',').map(e => e.trim()).filter(e => e.length > 0)
      };
      
      await NewsAuthorService.createOrUpdateAuthor(authorData);
      setNewAuthor({ id: '', name: '', icon: '📝', bio: '', expertise: '' });
      setShowCreateForm(false);
      loadAuthors();
    } catch (error) {
      console.error('Failed to create author:', error);
    }
  };

  const handleGenerateAutoNews = async (authorId: string, type: string) => {
    try {
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
        loadRecentNews(); // Refresh news list
        alert(`Auto news generated successfully for ${authors.find(a => a.id === authorId)?.name}!`);
      }
    } catch (error) {
      console.error('Failed to generate auto news:', error);
    }
  };

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

      {/* Create Author Form */}
      {showCreateForm && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Author</h3>
          <form onSubmit={handleCreateAuthor} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Author ID (e.g., mara)"
                value={newAuthor.id}
                onChange={(e) => setNewAuthor({ ...newAuthor, id: e.target.value })}
                className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Author Name"
                value={newAuthor.name}
                onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Icon (emoji)"
                value={newAuthor.icon}
                onChange={(e) => setNewAuthor({ ...newAuthor, icon: e.target.value })}
                className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Expertise (comma separated)"
                value={newAuthor.expertise}
                onChange={(e) => setNewAuthor({ ...newAuthor, expertise: e.target.value })}
                className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-blue-500"
              />
            </div>
            <textarea
              placeholder="Bio"
              value={newAuthor.bio}
              onChange={(e) => setNewAuthor({ ...newAuthor, bio: e.target.value })}
              className="w-full bg-gray-700 p-3 rounded border border-gray-600 focus:border-blue-500"
              rows={3}
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors"
            >
              Create Author
            </button>
          </form>
        </div>
      )}

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {loading ? (
          <div className="col-span-full text-center py-8">Loading authors...</div>
        ) : (
          authors.map((author) => (
            <div
              key={author.id}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => setSelectedAuthor(selectedAuthor?.id === author.id ? null : author)}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{author.icon}</span>
                <div>
                  <h3 className="font-semibold">{author.name}</h3>
                  <p className="text-gray-400 text-sm">{author.collaborationCount} collaborations</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-3">{author.bio}</p>
              <div className="flex flex-wrap gap-1">
                {author.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-600 text-xs px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              {/* Action Buttons */}
              {selectedAuthor?.id === author.id && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateAutoNews(author.id, 'prediction');
                    }}
                    className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1 rounded transition-colors"
                  >
                    🎯 Prediction News
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateAutoNews(author.id, 'milestone');
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-xs px-3 py-1 rounded transition-colors"
                  >
                    🏆 Milestone News
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateAutoNews(author.id, 'analysis');
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-xs px-3 py-1 rounded transition-colors"
                  >
                    📊 Analysis News
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Recent News Section */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>📰</span>
          Recent News by Authors
        </h3>
        <div className="space-y-3">
          {recentNews.map((news) => (
            <div key={news.id} className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{news.author.icon}</span>
                <span className="font-medium">{news.author.name}</span>
                <span className="bg-gray-700 text-xs px-2 py-1 rounded">
                  {news.collaborationType}
                </span>
              </div>
              <h4 className="font-semibold text-white">{news.title}</h4>
              <p className="text-gray-300 text-sm">{news.preview}</p>
              <div className="flex gap-2 mt-2">
                {news.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-700 text-xs px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Actions */}
      <div className="mt-6 bg-blue-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">⚡ Quick Demo Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => handleGenerateAutoNews('mara', 'prediction')}
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            ⚡ Mara Prediction Success
          </button>
          <button
            onClick={() => NewsAuthorService.initializeDefaultAuthors().then(() => loadAuthors())}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            🔄 Initialize Default Authors
          </button>
          <button
            onClick={() => loadRecentNews()}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            🔄 Refresh News
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsAuthorManager;