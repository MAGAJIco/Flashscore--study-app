'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Circle, Star, Newspaper, Trophy } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

export function BottomNavigation() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    {
      id: 'all-games',
      label: 'All Games',
      icon: <Home className="w-5 h-5" />,
      href: '/matches'
    },
    {
      id: 'live',
      label: 'LIVE',
      icon: <Circle className="w-5 h-5" />,
      href: '/live',
      badge: 127
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Star className="w-5 h-5" />,
      href: '/favorites'
    },
    {
      id: 'news',
      label: 'News',
      icon: <Newspaper className="w-5 h-5" />,
      href: '/news'
    },
    {
      id: 'leagues',
      label: 'Leagues',
      icon: <Trophy className="w-5 h-5" />,
      href: '/leagues'
    }
  ];

  if (!mounted) {
    return (
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 border-t"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="flex justify-around items-center h-16 max-w-7xl mx-auto px-2" />
      </nav>
    );
  }

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 border-t transition-colors"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex justify-around items-center h-16 max-w-7xl mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 gap-1 py-2 px-1 transition-all relative"
              style={{
                color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                minWidth: '60px'
              }}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span 
                className="text-[11px] font-medium whitespace-nowrap"
                style={{
                  color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)'
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
