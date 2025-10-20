"use client";
import React, { useState } from "react";
import Link from "next/link";

const Sidebar: React.FC = () => {
  // Start minimized by default on smaller screens
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  // Hide completely on mobile (< 768px)
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  const menuItems = [
    { name: "Users", path: "/management/users", icon: "👥" },
    { name: "Content", path: "/management/content", icon: "📝" },
    { name: "Payments", path: "/management/payments", icon: "💳" },
    { name: "Notifications", path: "/management/notifications", icon: "🔔" },
    { name: "Predictions", path: "/management/predictions", icon: "🎯" },
    { name: "Settings", path: "/management/settings", icon: "⚙️" },
    { name: "Analytics", path: "/management/analytics", icon: "📊" },
  ];

  return (
    <aside
      className={`
        h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-16"}
        fixed top-0 left-0 flex flex-col shadow-xl z-40
      `}
    >
      {/* Sticky header */}
      <div className="sticky top-0 bg-gray-900 z-10 flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className={`text-lg font-bold transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
          Management
        </h2>
        <button
          onClick={toggleSidebar}
          className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition-colors"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition-all group ${!isOpen && 'justify-center'}`}
                title={!isOpen ? item.name : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer - Home Link */}
      <div className="p-2 border-t border-gray-700">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800 transition-all ${!isOpen && 'justify-center'}`}
          title={!isOpen ? "Home" : undefined}
        >
          <span className="text-xl">🏠</span>
          <span className={`transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
            Home
          </span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;