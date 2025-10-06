
"use client";

import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Star,
  Users,
  Wallet,
  MoreHorizontal,
} from "lucide-react";

interface SubItem {
  label: string;
  link: string;
}

interface NavItem {
  label: string;
  link: string;
  subItems?: SubItem[];
}

interface QuickMenuItem {
  label: string;
  link: string;
}

const navItems: NavItem[] = [
  {
    label: "Sports",
    link: "/sports",
    subItems: [
      { label: "Football", link: "/sports/football" },
      { label: "Basketball", link: "/sports/basketball" },
      { label: "Baseball", link: "/sports/baseball" },
    ],
  },
  {
    label: "Predictions",
    link: "/predictions",
  },
  {
    label: "Leaderboard",
    link: "/leaderboard",
  },
  {
    label: "About",
    link: "/about",
  },
];

const quickMenuItems: QuickMenuItem[] = [
  { label: "🏠 Home", link: "/" },
  { label: "📰 News", link: "/news" },
  { label: "📊 Predictions", link: "/predictions" },
  { label: "📂 Archive", link: "/archive" },
  { label: "✍️ Author", link: "/author" },
];

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-[#0a0e1a] text-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo with Hover Menu */}
          <div className="flex-shrink-0 flex items-center relative group">
            <a
              href="/"
              className="text-green-400 font-bold text-xl cursor-pointer hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 rounded transition-colors"
              aria-label="Sports Central - Home"
            >
              <span aria-hidden="true">⚡</span> Sports Central
            </a>

            {/* Hover Menu - Only shows on hover */}
            <div className="absolute left-0 top-full mt-2 bg-[#1f2937] rounded-md shadow-lg overflow-hidden z-50 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" role="menu" aria-label="Quick navigation">
              {quickMenuItems.map((item) => (
                <a
                  key={item.link}
                  href={item.link}
                  className="block px-4 py-2 text-sm hover:bg-green-500 hover:text-white focus:outline-none focus:bg-green-500 focus:text-white transition cursor-pointer"
                  role="menuitem"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex space-x-6" role="menubar">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <a
                  href={item.link || "#"}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-400 transition cursor-pointer"
                  role="menuitem"
                  aria-haspopup={item.subItems ? "true" : undefined}
                  aria-expanded={item.subItems && openDropdown === item.label ? "true" : "false"}
                >
                  {item.label}
                </a>

                {/* Dropdown */}
                {item.subItems && openDropdown === item.label && (
                  <div className="absolute left-0 mt-2 w-40 bg-[#1f2937] rounded-md shadow-lg overflow-hidden z-50" role="menu" aria-label={`${item.label} submenu`}>
                    {item.subItems.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.link}
                        className="block px-4 py-2 text-sm hover:bg-green-500 hover:text-white focus:outline-none focus:bg-green-500 focus:text-white transition cursor-pointer"
                        role="menuitem"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right-side quick links / buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 bg-green-500 rounded-full text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition cursor-pointer" aria-label="Sign up for an account">
              Sign Up
            </button>
            <button className="px-4 py-2 bg-yellow-500 rounded-full text-sm font-medium hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition cursor-pointer" aria-label="Login to your account">
              Login
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-2xl text-white focus:outline-none"
            onClick={handleMenuToggle}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[#1f2937] shadow-lg border-t border-gray-700">
          <div className="flex flex-col py-2">
            {navItems.map((item) => (
              <div key={item.label}>
                <a
                  href={item.link}
                  className="block px-4 py-3 font-semibold text-white hover:text-green-400 hover:bg-white/10 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
                {/* Mobile Submenu */}
                {item.subItems && (
                  <div className="bg-[#0a0e1a] ml-4">
                    {item.subItems.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.link}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-green-500 hover:text-white transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile buttons */}
            <div className="flex flex-col space-y-2 px-4 py-3 mt-2 border-t border-gray-700">
              <button className="px-4 py-2 bg-green-500 rounded-full text-sm font-medium hover:bg-green-600 transition w-full">
                Sign Up
              </button>
              <button className="px-4 py-2 bg-yellow-500 rounded-full text-sm font-medium hover:bg-yellow-600 transition w-full">
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
