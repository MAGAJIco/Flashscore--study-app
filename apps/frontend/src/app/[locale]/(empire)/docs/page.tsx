
"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { AppDrawer } from '@/app/components/layout/AppDrawer';

export default function EmpireDocsPage() {
  const t = useTranslations('empire.docs');
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const featureApps = [
    { id: 'portal', icon: '🏠', name: t('apps.portal.name'), route: '/', description: t('apps.portal.description') },
    { id: 'predictions', icon: '🤖', name: t('apps.predictions.name'), route: '/predictions', description: t('apps.predictions.description') },
    { id: 'live', icon: '⚡', name: t('apps.live.name'), route: '/matches', description: t('apps.live.description') },
    { id: 'social', icon: '👥', name: t('apps.social.name'), route: '/social/feed', description: t('apps.social.description') },
    { id: 'kids', icon: '🎮', name: t('apps.kids.name'), route: '/kids', description: t('apps.kids.description') },
    { id: 'rewards', icon: '🏆', name: t('apps.rewards.name'), route: '/rewards/achievements', description: t('apps.rewards.description') },
    { id: 'analytics', icon: '📊', name: t('apps.analytics.name'), route: '/analytics', description: t('apps.analytics.description') },
    { id: 'news', icon: '📰', name: t('apps.news.name'), route: '/news', description: t('apps.news.description') },
    { id: 'empire', icon: '👑', name: t('apps.empire.name'), route: '/empire', description: t('apps.empire.description') },
  ];

  const liveMatches = [
    { id: '1', home: 'Man United', away: 'Arsenal', score: '2-1', minute: "67'", badge: 'LIVE' },
    { id: '2', home: 'Lakers', away: 'Warriors', score: '98-95', minute: 'Q3 5:23', badge: 'LIVE' },
    { id: '3', home: 'Djokovic', away: 'Alcaraz', score: '6-4, 3-4', minute: 'Set 2', badge: 'LIVE' },
  ];

  const newsItems = [
    { id: '1', title: t('news.item1.title'), description: t('news.item1.description'), badge: 'NEWS', views: '2.4K' },
    { id: '2', title: t('news.item2.title'), description: t('news.item2.description'), badge: 'NEWS', views: '1.8K' },
    { id: '3', title: t('news.item3.title'), description: t('news.item3.description'), badge: 'NEWS', views: '3.1K' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <Breadcrumbs items={[{ label: t('breadcrumb.empire'), href: '/empire' }, { label: t('breadcrumb.docs') }]} />

      {/* Header */}
      <header className="text-center mb-12 animate-fadeInDown">
        <h1 className="text-5xl font-bold mb-4 text-shadow-lg">
          {t('header.title')}
        </h1>
        <p className="text-xl opacity-95">{t('header.subtitle')}</p>
      </header>

      {/* App Drawer Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setAppDrawerOpen(true)}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all"
        >
          🏗️ {t('buttons.apps')}
        </button>
      </div>

      {/* Overview Section */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-purple-300">
          {t('overview.title')}
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          {t('overview.description')}
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 p-4 rounded-xl">
              <div className="text-2xl mb-2">{t(`overview.feature${i}.icon`)}</div>
              <h3 className="font-bold mb-2">{t(`overview.feature${i}.title`)}</h3>
              <p className="text-sm text-gray-300">{t(`overview.feature${i}.description`)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Matches Carousel */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
            🔴 {t('carousel.live.title')}
          </h2>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">←</button>
            <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">→</button>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {liveMatches.map((match) => (
            <div
              key={match.id}
              className="min-w-[320px] bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-red-500/30 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                {match.badge}
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">{match.home}</span>
                <span className="text-2xl font-bold text-yellow-400">{match.score}</span>
                <span className="font-bold">{match.away}</span>
              </div>
              <div className="text-sm text-gray-300 text-center">{match.minute}</div>
            </div>
          ))}
        </div>
      </div>

      {/* News Carousel */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            📰 {t('carousel.news.title')}
          </h2>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">←</button>
            <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">→</button>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="min-w-[320px] bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {item.badge}
              </div>
              <h3 className="text-lg font-bold mb-3">{item.title}</h3>
              <p className="text-sm text-gray-300 mb-4">{item.description}</p>
              <div className="text-xs text-gray-400">👁️ {item.views}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Apps Grid */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-green-400">
          {t('apps.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureApps.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app.id)}
              className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/20 hover:border-purple-500 hover:scale-105 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-4">{app.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-purple-300">{app.name}</h3>
              <p className="text-sm text-gray-300">{app.description}</p>
              <div className="mt-4 text-xs text-gray-400">
                {t('apps.route')}: {app.route}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* App Drawer */}
      <AppDrawer isOpen={appDrawerOpen} onClose={() => setAppDrawerOpen(false)} />
    </div>
  );
}
