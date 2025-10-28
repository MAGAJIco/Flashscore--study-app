'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ManagementSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/management', label: 'Dashboard', icon: '📊' },
    { href: '/management/users', label: 'Users', icon: '👥' },
    { href: '/management/content', label: 'Content', icon: '📝' },
    { href: '/management/analytics', label: 'Analytics', icon: '📈' },
    { href: '/management/notifications', label: 'Notifications', icon: '🔔' },
    { href: '/management/settings', label: 'Settings', icon: '⚙️' },
    { href: '/settings', label: 'User Settings', icon: '👤' },
  ];

  return (
    <aside className="w-64 bg-gray-900/50 backdrop-blur-md border-r border-gray-800 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">Management</h2>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
