
"use client";
import React from 'react';
import { navItems } from '@config/navItems';
import { useMobile } from '@hooks/useMobile';

interface SidebarNavProps {
  items: typeof navItems;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ items }) => {
  const isMobile = useMobile();

  // Hide on mobile and small screens
  if (isMobile || (typeof window !== 'undefined' && window.innerWidth < 768)) return null;

  return (
    <div className="hidden md:flex w-64 min-h-screen bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-sm border-r border-gray-700/50">
      <nav className="flex flex-col w-full p-4 space-y-2">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-2">🏆 Sports Central</h2>
          <div className="w-full h-px bg-gradient-to-r from-cyan-400 to-blue-500"></div>
        </div>
        
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span className="font-medium">
              {item.label.replace(/^🔮|📊|📰|🎯|🛠️|🏠/, '').trim()}
            </span>
          </a>
        ))}
        
        <div className="mt-auto pt-4 border-t border-gray-700/50">
          <div className="text-xs text-gray-500 text-center">
            Sports Central v2.0
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SidebarNav;
