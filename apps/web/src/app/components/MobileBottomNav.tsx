
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Home, Trophy, TrendingUp, Users, Settings } from 'lucide-react';

export function MobileBottomNav() {
  const params = useParams();
  const locale = params?.locale as string || 'en';

  const navItems = [
    { href: `/${locale}`, icon: Home, label: 'Home' },
    { href: `/${locale}/predictions`, icon: TrendingUp, label: 'Predict' },
    { href: `/${locale}/live`, icon: Trophy, label: 'Live' },
    { href: `/${locale}/social/feed`, icon: Users, label: 'Social' },
    { href: `/${locale}/settings`, icon: Settings, label: 'More' },
  ];

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex justify-around items-center max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-2 min-w-touch transition-all hover:scale-105 active:scale-95"
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
