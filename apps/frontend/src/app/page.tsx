"use client";

import React, { useState, useEffect, Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import { useMobile } from './hooks/useMobile';
import LoadingSkeleton from './components/LoadingSkeleton';

const HorizontalCarousel = dynamic(() => import('./components/HorizontalCarousel'), {
  loading: () => <LoadingSkeleton />,
  ssr: false
});

const ComprehensiveSportsHub = dynamic(() => import("@/app/components/ComprehensiveSportsHub"), {
  loading: () => <LoadingSkeleton />,
  ssr: false
});

const AuthorsSidebar = dynamic(() => import("@/app/components/AuthorsSidebar"), {
  loading: () => <LoadingSkeleton />,
  ssr: false
});

const ChessboardCompetitiveAnalysis = dynamic(() => import("./components/ChessboardCompetitiveAnalysis"), {
  loading: () => <LoadingSkeleton />,
  ssr: false
});

import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import NavBar from "@/app/components/NavBar";
import MobileHomeOptimizer from "./components/MobileHomeOptimizer";
import Link from "next/link";

export default function HomePage() {
  const isMobile = useMobile();
  const [liveStats, setLiveStats] = useState({
    activeUsers: 2341,
    predictions24h: 8547,
    accuracyRate: 78.5,
    topStreak: 12
  });

  const [currentFeature, setCurrentFeature] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (isMobile) {
      const images = document.querySelectorAll('img');
      let loadedCount = 0;
      
      images.forEach(img => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.addEventListener('load', () => {
            loadedCount++;
            if (loadedCount === images.length) {
              setImagesLoaded(true);
            }
          });
        }
      });
    }
  }, [isMobile]);

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
    <div className="min-h-screen bg-[#f5f5f7]">
      <MobileHomeOptimizer />
      <NavBar />
      {!isMobile && <Suspense fallback={<LoadingSkeleton />}><AuthorsSidebar /></Suspense>}

      <div className={isMobile ? "mt-16 px-4" : "ml-80 mt-16 px-8"}>
        <section className="py-8 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-3 text-[#1d1d1f] tracking-tight">
              🏆 Sports Central
            </h1>
            <p className="text-xl text-[#6e6e73] font-medium">
              AI-Powered Sports Intelligence • Live • Accurate • Profitable
            </p>
          </div>

          <div className={`grid ${isMobile ? 'grid-cols-2' : 'md:grid-cols-4'} gap-4 mb-10`}>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e5e5e7] hover:shadow-md transition-all">
              <div className="text-4xl font-bold text-[#007AFF] mb-1">{liveStats.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-[#6e6e73] font-medium">Active Users</div>
              <div className="w-2 h-2 bg-[#34C759] rounded-full mx-auto mt-3 animate-pulse"></div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e5e5e7] hover:shadow-md transition-all">
              <div className="text-4xl font-bold text-[#5856D6] mb-1">{liveStats.predictions24h.toLocaleString()}</div>
              <div className="text-sm text-[#6e6e73] font-medium">Predictions (24h)</div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e5e5e7] hover:shadow-md transition-all">
              <div className="text-4xl font-bold text-[#34C759] mb-1">{liveStats.accuracyRate}%</div>
              <div className="text-sm text-[#6e6e73] font-medium">Accuracy Rate</div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e5e5e7] hover:shadow-md transition-all">
              <div className="text-4xl font-bold text-[#FF9500] mb-1">{liveStats.topStreak}</div>
              <div className="text-sm text-[#6e6e73] font-medium">Top Streak Today</div>
            </div>
          </div>
        </section>

        <section className="py-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8 text-center tracking-tight">
            ✨ Explore Our Features
          </h2>

          <div className="relative h-72 mb-8">
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
                  <div className="bg-white rounded-[28px] p-10 h-full flex items-center cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-sm border border-[#e5e5e7] hover:shadow-lg">
                    <div className="flex-1">
                      <div className="text-7xl mb-5">{feature.icon}</div>
                      <h3 className="text-4xl font-bold text-[#1d1d1f] mb-3 tracking-tight">{feature.title}</h3>
                      <p className="text-lg text-[#6e6e73] mb-5 font-medium">{feature.description}</p>
                      <button className="px-8 py-3 bg-[#007AFF] hover:bg-[#0051D5] active:bg-[#004BB8] rounded-full text-white font-semibold transition-all shadow-sm text-base">
                        Try Now →
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            {featuredPreviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentFeature ? 'w-8 bg-[#007AFF]' : 'w-2 bg-[#d1d1d6]'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="py-8 pb-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link href="/predictions" className="bg-white rounded-[28px] p-8 border border-[#e5e5e7] hover:border-[#007AFF] active:border-[#0051D5] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md">
              <div className="text-5xl mb-5">🎯</div>
              <h3 className="text-2xl font-bold text-[#1d1d1f] mb-2 tracking-tight">Make Predictions</h3>
              <p className="text-[#6e6e73] font-medium">Start predicting and earn rewards</p>
            </Link>

            <Link href="/features" className="bg-white rounded-[28px] p-8 border border-[#e5e5e7] hover:border-[#5856D6] active:border-[#4745B8] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md">
              <div className="text-5xl mb-5">🌟</div>
              <h3 className="text-2xl font-bold text-[#1d1d1f] mb-2 tracking-tight">Explore Features</h3>
              <p className="text-[#6e6e73] font-medium">Discover all available tools</p>
            </Link>

            <Link href="/empire" className="bg-white rounded-[28px] p-8 border border-[#e5e5e7] hover:border-[#FF9500] active:border-[#CC7700] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md">
              <div className="text-5xl mb-5">🏛️</div>
              <h3 className="text-2xl font-bold text-[#1d1d1f] mb-2 tracking-tight">Build Empire</h3>
              <p className="text-[#6e6e73] font-medium">Grow your prediction empire</p>
            </Link>
          </div>
        </section>

        {!isMobile && (
          <Suspense fallback={<LoadingSkeleton />}>
            <ComprehensiveSportsHub />
          </Suspense>
        )}

        {isMobile && (
          <Suspense fallback={<LoadingSkeleton />}>
            <HorizontalCarousel />
          </Suspense>
        )}

        {!isMobile && (
          <Suspense fallback={<LoadingSkeleton />}>
            <ChessboardCompetitiveAnalysis />
          </Suspense>
        )}
      </div>
    </div>
  );
}
