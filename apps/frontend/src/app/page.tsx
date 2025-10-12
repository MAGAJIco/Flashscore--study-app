
"use client";
import React, { useState, useEffect } from "react";
import ComprehensiveSportsHub from "@/app/components/ComprehensiveSportsHub";
import AuthorsSidebar from "@/app/components/AuthorsSidebar";
import Link from "next/link";

export default function HomePage() {
  const [liveStats, setLiveStats] = useState({
    activeUsers: 2341,
    predictions24h: 8547,
    accuracyRate: 78.5,
    topStreak: 12
  });

  const [currentFeature, setCurrentFeature] = useState(0);

  const featuredPreviews = [
    {
      title: "AI-Powered Predictions",
      description: "Get 87% accurate predictions with our advanced ML models",
      icon: "🤖",
      link: "/empire/ai-ceo",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Live Match Tracking",
      description: "Real-time updates and analytics for every game",
      icon: "⚡",
      link: "/predictions",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Achievement System",
      description: "Earn badges and climb the leaderboard",
      icon: "🏆",
      link: "/features",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Kids Safe Mode",
      description: "COPPA-compliant safe environment for young users",
      icon: "🛡️",
      link: "/privacy",
      color: "from-green-500 to-emerald-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % featuredPreviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <AuthorsSidebar />
      
      <div className="ml-80">
        {/* Hero Section with Live Stats */}
        <section className="relative overflow-hidden py-12 px-6">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                🏆 SPORTS CENTRAL
              </h1>
              <p className="text-xl text-cyan-200 mb-6">
                AI-Powered Sports Intelligence • Live • Accurate • Profitable
              </p>
              
              {/* Live Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-3xl font-bold text-cyan-400">{liveStats.activeUsers.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Active Users</div>
                  <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mt-2 animate-pulse"></div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-3xl font-bold text-purple-400">{liveStats.predictions24h.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Predictions (24h)</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-3xl font-bold text-green-400">{liveStats.accuracyRate}%</div>
                  <div className="text-sm text-gray-300">Accuracy Rate</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-3xl font-bold text-orange-400">{liveStats.topStreak}</div>
                  <div className="text-sm text-gray-300">Top Streak Today</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Feature Preview Carousel */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              ✨ Explore Our Features
            </h2>
            
            <div className="relative h-64 mb-8">
              {featuredPreviews.map((feature, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ${
                    index === currentFeature 
                      ? 'opacity-100 translate-x-0' 
                      : index < currentFeature 
                        ? 'opacity-0 -translate-x-full' 
                        : 'opacity-0 translate-x-full'
                  }`}
                >
                  <Link href={feature.link}>
                    <div className={`bg-gradient-to-r ${feature.color} rounded-2xl p-8 h-full flex items-center justify-between cursor-pointer transform hover:scale-105 transition-transform`}>
                      <div className="flex-1">
                        <div className="text-6xl mb-4">{feature.icon}</div>
                        <h3 className="text-3xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-lg text-white/90">{feature.description}</p>
                        <button className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white font-semibold transition">
                          Try Now →
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2">
              {featuredPreviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentFeature ? 'w-8 bg-cyan-400' : 'w-2 bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Quick Action Cards */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/predictions" className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-cyan-400 transition-all transform hover:scale-105">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">Make Predictions</h3>
                <p className="text-gray-300">Start predicting and earn rewards</p>
              </Link>

              <Link href="/features" className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-purple-400 transition-all transform hover:scale-105">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-bold text-white mb-2">Explore Features</h3>
                <p className="text-gray-300">Discover all available tools</p>
              </Link>

              <Link href="/empire" className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-orange-400 transition-all transform hover:scale-105">
                <div className="text-4xl mb-4">👑</div>
                <h3 className="text-xl font-bold text-white mb-2">Join Empire</h3>
                <p className="text-gray-300">Build the future together</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-12 px-6 bg-white/5">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              🌟 Join 1000+ Winning Predictors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-400 mb-2">87%</div>
                <div className="text-gray-300">Average Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-cyan-400 mb-2">50K+</div>
                <div className="text-gray-300">Predictions Made</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-300">Live Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <ComprehensiveSportsHub />

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Winning? 🚀
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users making accurate predictions with AI-powered insights
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white font-bold text-lg hover:scale-105 transition-transform">
                Get Started Free
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full text-white font-bold text-lg border border-white/20 hover:bg-white/20 transition">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}
