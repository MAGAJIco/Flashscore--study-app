"use client";

import React, { useState } from 'react';
import MagajicoCEO from '@/components/MagajicoCEO';

export default function ChatsPage() {
  const [isCEOChatOpen, setIsCEOChatOpen] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{id: string, title: string, date: string}>>([
    { id: '1', title: 'Premier League Predictions', date: '2 hours ago' },
    { id: '2', title: 'La Liga Analysis', date: 'Yesterday' },
    { id: '3', title: 'Champions League Tips', date: '2 days ago' },
  ]);

  const handleNewChat = () => {
    setIsCEOChatOpen(true);
    setShowArchive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                💬 Chats
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with AI assistants and get personalized betting insights
              </p>
            </div>
          </div>

          {/* Chat Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {/* Magajico CEO Chat */}
            <div 
              onClick={() => setIsCEOChatOpen(!isCEOChatOpen)}
              className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-purple-500"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">🤖</div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isCEOChatOpen ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                  {isCEOChatOpen ? 'Active' : 'Start'}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Magajico CEO
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Your personal AI betting manager. Build smart bet slips with AI assistance.
              </p>
              <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-semibold">
                <span>🎯</span>
                <span>AI-Powered Recommendations</span>
              </div>
            </div>

            {/* AI Coach Assistant - Coming Soon */}
            <div className="bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-xl p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">🏆</div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-700">
                  Coming Soon
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                AI Coach
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Get expert training tips and performance analysis from our AI coach.
              </p>
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                <span>📊</span>
                <span>Performance Analytics</span>
              </div>
            </div>

            {/* Live Match Chat - Coming Soon */}
            <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">⚡</div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-700">
                  Coming Soon
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Live Match Chat
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Discuss live matches with AI and get real-time insights as games unfold.
              </p>
              <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 font-semibold">
                <span>🔴</span>
                <span>Real-time Updates</span>
              </div>
            </div>

            {/* Stats Expert - Coming Soon */}
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">📈</div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-700">
                  Coming Soon
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Stats Expert
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Deep dive into team and player statistics with our analytics AI.
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                <span>🔢</span>
                <span>Advanced Analytics</span>
              </div>
            </div>

            {/* News Curator - Coming Soon */}
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-xl p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">📰</div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-700">
                  Coming Soon
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                News Curator
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Get personalized sports news summaries tailored to your interests.
              </p>
              <div className="flex items-center gap-2 text-xs text-pink-600 dark:text-pink-400 font-semibold">
                <span>🎯</span>
                <span>Personalized Updates</span>
              </div>
            </div>

            {/* Community Chat - Coming Soon */}
            <div className="bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-xl p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">👥</div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-700">
                  Coming Soon
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Community Hub
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Connect with other sports enthusiasts and share predictions.
              </p>
              <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                <span>💬</span>
                <span>Social Features</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized AI Chat Modal */}
        {isCEOChatOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
              onClick={() => setIsCEOChatOpen(false)}
            />
            
            {/* Chat Modal */}
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
              <div className="bg-white dark:bg-gray-900 w-full h-full md:h-[90vh] md:max-w-4xl md:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto animate-slideUp flex flex-col">
                {/* Header with Controls */}
                <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-4 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🤖</div>
                    <div>
                      <h2 className="text-white font-bold text-xl">Magajico CEO</h2>
                      <p className="text-purple-100 text-xs">AI Betting Manager</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Archive Button */}
                    <button
                      onClick={() => setShowArchive(!showArchive)}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                      title="Chat Archive"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    
                    {/* New Chat Button */}
                    <button
                      onClick={handleNewChat}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                      title="New Chat"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    
                    {/* Close Button */}
                    <button
                      onClick={() => setIsCEOChatOpen(false)}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                      title="Close"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Archive Sidebar */}
                {showArchive && (
                  <div className="absolute top-[72px] left-0 right-0 md:relative md:top-0 bg-gray-50 dark:bg-gray-800 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 z-10 max-h-64 md:max-h-full overflow-y-auto md:w-72 animate-slideDown">
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        📚 Chat History
                      </h3>
                      <div className="space-y-2">
                        {chatHistory.map((chat) => (
                          <div
                            key={chat.id}
                            className="bg-white dark:bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                            onClick={() => setShowArchive(false)}
                          >
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {chat.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {chat.date}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Bible Quote Section */}
                      <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">📖</span>
                          <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Daily Wisdom</span>
                        </div>
                        <p className="text-xs italic text-gray-700 dark:text-gray-300 mb-1">
                          "Trust in the Lord with all your heart and lean not on your own understanding."
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                          - Proverbs 3:5
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Chat Content */}
                <div className="flex-1 overflow-hidden">
                  <MagajicoCEO />
                </div>

                {/* Footer Info */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                    🙏 Remember to gamble responsibly • AI-powered insights for entertainment
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Help Section */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl p-6 mt-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                How to Use AI Chats
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">1.</span>
                  <span>Click on the <strong>Magajico CEO</strong> card to open the chat interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">2.</span>
                  <span>Tell the AI which games you're interested in betting on</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">3.</span>
                  <span>Get personalized recommendations and build your bet slip</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">4.</span>
                  <span>Always remember to gamble responsibly!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @media (max-width: 768px) {
          .animate-slideUp {
            animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }
      `}</style>
    </div>
  );
}
