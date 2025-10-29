"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { appMenuItems } from '@/lib/navigation/navigation-items';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';

interface SidebarNavProps {
  items?: typeof appMenuItems;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ items = appMenuItems }) => {
  const { isOpen, isMobileMenuOpen, toggleSidebar, toggleMobileMenu, setIsMobileMenuOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-gray-800/90 backdrop-blur-sm text-white hover:bg-gray-700 transition-colors shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900/95 to-black/95 
          backdrop-blur-sm border-r border-gray-700/50
          transition-all duration-300 ease-in-out z-40
          ${isMobileMenuOpen ? 'w-full sm:w-80' : (isOpen ? 'w-64' : 'w-20')}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <h2
              className={`
                text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 
                bg-clip-text text-transparent transition-all duration-300
                ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}
              `}
            >
              🏆 Sports Central
            </h2>
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-colors"
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isOpen ? (
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-3">
              {items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-3 rounded-lg 
                        transition-all duration-200 group relative
                        ${isActive 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20' 
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }
                        ${!isOpen && !isMobileMenuOpen && 'justify-center'}
                      `}
                      title={!isOpen && !isMobileMenuOpen ? item.label : ''}
                    >
                      <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      <span
                        className={`
                          flex-1 font-medium transition-all duration-300
                          ${(isOpen || isMobileMenuOpen) ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}
                        `}
                      >
                        {item.label.replace(/^🔮|📊|📰|🎯|🛠️|🏠|⚽|⭐|🏆|✍️|🤝|📈/, '').trim()}
                      </span>
                      {item.badge && (isOpen || isMobileMenuOpen) && (
                        <span
                          className={`
                            px-2 py-1 text-xs font-bold rounded-full
                            ${item.badge === 'AI' || item.badge === 'New'
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                              : 'bg-gray-700 text-gray-300'
                            }
                          `}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-700/50">
            <div
              className={`
                text-xs text-gray-500 transition-all duration-300
                ${(isOpen || isMobileMenuOpen) ? 'opacity-100 text-center' : 'opacity-0 w-0 overflow-hidden'}
              `}
            >
              <p className="font-semibold text-gray-400 mb-1">AI-Powered</p>
              <p>Sports Central v2.0</p>
            </div>
            {!isOpen && !isMobileMenuOpen && (
              <div className="flex justify-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export { SidebarNav };