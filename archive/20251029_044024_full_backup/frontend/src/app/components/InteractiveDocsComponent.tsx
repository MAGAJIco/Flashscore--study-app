"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GoogleStyleNav,
  DocsAppDrawer,
  DocsCarousel,
  DocsArchitecture,
  DocsOverview,
  DocsHeader,
  DocsFooter,
} from './docs';

interface FeatureApp {
  id: string;
  icon: string;
  name: string;
}

interface CarouselCard {
  badge: string;
  badgeType: 'live' | 'news';
  icon: string;
  title: string;
  description: string;
  meta: Array<{ icon: string; text: string }>;
}

export default function InteractiveDocsComponent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const featureApps: FeatureApp[] = [
    { id: 'portal', icon: '🏠', name: 'Portal' },
    { id: 'predictions', icon: '🤖', name: 'Predictions' },
    { id: 'live', icon: '⚡', name: 'Live' },
    { id: 'social', icon: '👥', name: 'Social' },
    { id: 'kids', icon: '🎮', name: 'Kids Mode' },
    { id: 'rewards', icon: '🏆', name: 'Rewards' },
    { id: 'analytics', icon: '📊', name: 'Analytics' },
    { id: 'chat', icon: '💬', name: 'Chat' },
    { id: 'challenges', icon: '🎯', name: 'Challenges' },
  ];

  const liveMatches: CarouselCard[] = [
    {
      badge: '🔴 LIVE',
      badgeType: 'live',
      icon: '⚽',
      title: 'Man United vs Arsenal',
      description: 'Premier League - Thrilling match at Old Trafford',
      meta: [
        { icon: '⏱️', text: "67'" },
        { icon: '📊', text: '2-1' },
        { icon: '👥', text: '73K watching' },
      ],
    },
    {
      badge: '🔴 LIVE',
      badgeType: 'live',
      icon: '🏀',
      title: 'Lakers vs Warriors',
      description: 'NBA - Western Conference showdown',
      meta: [
        { icon: '⏱️', text: 'Q3 5:23' },
        { icon: '📊', text: '98-95' },
        { icon: '👥', text: '120K watching' },
      ],
    },
    {
      badge: '🔴 LIVE',
      badgeType: 'live',
      icon: '🏈',
      title: 'Patriots vs Chiefs',
      description: 'NFL - Championship game intensity',
      meta: [
        { icon: '⏱️', text: 'Q2 8:14' },
        { icon: '📊', text: '14-21' },
        { icon: '👥', text: '250K watching' },
      ],
    },
  ];

  const newsCards: CarouselCard[] = [
    {
      badge: '🔥 BREAKING',
      badgeType: 'news',
      icon: '⚽',
      title: 'Mbappe Signs Historic Deal',
      description: 'Real Madrid announces record-breaking transfer for French superstar',
      meta: [
        { icon: '🕐', text: '2 hours ago' },
        { icon: '💬', text: '1.2K comments' },
      ],
    },
    {
      badge: '📰 NEWS',
      badgeType: 'news',
      icon: '🏀',
      title: 'LeBron Reaches 40K Points',
      description: 'King James makes history with unprecedented milestone achievement',
      meta: [
        { icon: '🕐', text: '5 hours ago' },
        { icon: '💬', text: '892 comments' },
      ],
    },
  ];

  const scrollCarousel = (type: 'live' | 'news', direction: number) => {
    const carouselId = type === 'live' ? 'liveCarousel' : 'newsCarousel';
    const carousel = document.getElementById(carouselId);
    if (carousel) {
      const scrollAmount = 340;
      carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600">
      <GoogleStyleNav
        menuOpen={menuOpen}
        appDrawerOpen={appDrawerOpen}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
        onAppDrawerToggle={() => setAppDrawerOpen(!appDrawerOpen)}
      />

      <DocsAppDrawer
        isOpen={appDrawerOpen}
        onClose={() => setAppDrawerOpen(false)}
        apps={featureApps}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <DocsHeader />

        <DocsCarousel
          title="Live Matches"
          icon="⚡"
          cards={liveMatches}
          carouselId="liveCarousel"
          onScroll={scrollCarousel}
        />

        <DocsCarousel
          title="Latest News"
          icon="📰"
          cards={newsCards}
          carouselId="newsCarousel"
          onScroll={scrollCarousel}
        />

        <DocsOverview />

        <DocsArchitecture />

        <DocsFooter />
      </div>
    </div>
  );
}