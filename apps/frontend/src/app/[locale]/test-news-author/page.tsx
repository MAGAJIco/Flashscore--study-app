'use client';

import React, { useState } from 'react';
import { NewsAuthorService } from '@services/newsAuthorService';
import { NewsService } from '@services/newsService';

export default function TestNewsAuthorPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const initializeAuthors = async () => {
    setLoading(true);
    try {
      await NewsAuthorService.initializeDefaultAuthors();
      setResult('✅ Default authors initialized successfully!');
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    }
    setLoading(false);
  };

  const createTestNews = async () => {
    setLoading(true);
    try {
      const news = await NewsAuthorService.createCollaborationNews('mara', {
        title: 'My First Test News Article',
        preview: 'This is a test news article created from the test page...',
        fullContent: 'This is the full content of my first test news article. It demonstrates how the news author system works with Mara as the author. This content is visible to members only!',
        collaborationType: 'prediction',
        tags: ['test', 'first-news', 'prediction']
      });

      setResult(`✅ News created successfully! ID: ${news.id}`);
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    }
    setLoading(false);
  };

  const generateAutoNews = async (eventType: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/news-authors/auto-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: 'mara',
          eventType,
          eventData: {
            matchName: 'Barcelona vs Real Madrid',
            topic: 'Premier League Analysis',
            milestone: 25
          }
        })
      });

      const data = await response.json();
      setResult(data.success ? '✅ Auto news generated!' : `❌ ${data.message}`);
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    }
    setLoading(false);
  };

  const viewAllNews = async () => {
    setLoading(true);
    try {
      const response = await NewsService.getAllNews();
      setResult(`✅ Found ${response.data.length} news articles:\n${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🧪 Test News Author Publishing</h1>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={initializeAuthors}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              1️⃣ Initialize Default Authors
            </button>

            <button
              onClick={createTestNews}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              2️⃣ Create Test News
            </button>

            <button
              onClick={() => generateAutoNews('prediction_success')}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              🎯 Auto: Prediction Success
            </button>

            <button
              onClick={() => generateAutoNews('community_milestone')}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              🏆 Auto: Milestone
            </button>

            <button
              onClick={() => generateAutoNews('analysis_update')}
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              📊 Auto: Analysis Update
            </button>

            <button
              onClick={viewAllNews}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              📰 View All News
            </button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="text-white mt-2">Processing...</p>
            </div>
          )}

          {result && (
            <div className="bg-black/30 rounded-lg p-4 mt-4">
              <h3 className="text-white font-semibold mb-2">Result:</h3>
              <pre className="text-gray-300 text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <h2 className="text-xl font-bold text-white mb-4">📋 Testing Instructions</h2>
          <ol className="text-gray-300 space-y-2 list-decimal list-inside">
            <li>Click "Initialize Default Authors" to create Mara, Alex Sports, and Sarah Stats</li>
            <li>Click "Create Test News" to publish your first news article with Mara as author</li>
            <li>Try the "Auto" buttons to generate different types of news automatically</li>
            <li>Click "View All News" to see all published articles</li>
            <li>Visit the <a href="/" className="text-blue-400 hover:underline">home page</a> to see news in the NewsAuthorManager component</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

