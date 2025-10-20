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
  Globe,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from 'next-auth/react';
import LanguageSwitcher from "./LanguageSwitcher";
import GoogleStyleMenu from "./GoogleStyleMenu";

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
    label: "⚽ Matches",
    link: "/matches",
  },
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
    label: "🌈 Kids Mode",
    link: "/kids-mode",
  },
  {
    label: "Leaderboard",
    link: "/leaderboard",
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
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [quickMenuOpen, setQuickMenuOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const dropdownRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const quickMenuButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleDropdownKeyDown = (e: React.KeyboardEvent, label: string, hasSubItems: boolean) => {
    if (!hasSubItems) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDropdownToggle(label);
    } else if (e.key === 'Escape') {
      setOpenDropdown(null);
      dropdownRefs.current[label]?.focus();
    }
  };

  const handleQuickMenuToggle = () => {
    setQuickMenuOpen(!quickMenuOpen);
  };

  // Focus management for quick menu
  React.useEffect(() => {
    if (!quickMenuOpen && quickMenuButtonRef.current) {
      quickMenuButtonRef.current.focus();
    }
  }, [quickMenuOpen]);

  return (
    <nav className="shadow-md fixed top-0 w-full z-50 transition-colors duration-300" style={{
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo with Quick Menu */}
          <div className="flex-shrink-0 flex items-center relative" onMouseLeave={() => setQuickMenuOpen(false)}>
            <button
              ref={quickMenuButtonRef}
              onClick={handleQuickMenuToggle}
              onMouseEnter={() => setQuickMenuOpen(true)}
              className="text-green-400 font-bold text-xl cursor-pointer hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 rounded transition-colors"
              aria-label="Sports Central - Home and Quick Menu"
              aria-haspopup="true"
              aria-expanded={quickMenuOpen}
            >
              <span aria-hidden="true">⚡</span> Sports Central
            </button>

            {/* Quick Menu - Shows on hover or keyboard activation */}
            {quickMenuOpen && (
              <div className="absolute left-0 top-full mt-2 rounded-md shadow-lg overflow-hidden z-50 min-w-[200px]" role="menu" aria-label="Quick navigation" style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)'
              }}>
                {quickMenuItems.map((item) => (
                  <a
                    key={item.link}
                    href={item.link}
                    className="block px-4 py-2 text-sm transition cursor-pointer"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-color)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    role="menuitem"
                    onClick={() => setQuickMenuOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setQuickMenuOpen(false);
                        quickMenuButtonRef.current?.focus();
                      }
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex space-x-6" role="menubar">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => item.subItems && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.subItems ? (
                  <button
                    ref={(el) => { dropdownRefs.current[item.label] = el; }}
                    onClick={() => handleDropdownToggle(item.label)}
                    onKeyDown={(e) => handleDropdownKeyDown(e, item.label, true)}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-400 transition cursor-pointer"
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.label ? "true" : "false"}
                  >
                    {item.label}
                  </button>
                ) : (
                  <a
                    href={item.link}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-400 transition cursor-pointer"
                    role="menuitem"
                  >
                    {item.label}
                  </a>
                )}

                {/* Dropdown */}
                {item.subItems && openDropdown === item.label && (
                  <div className="absolute left-0 mt-2 w-40 rounded-md shadow-lg overflow-hidden z-50" role="menu" aria-label={`${item.label} submenu`} style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)'
                  }}>
                    {item.subItems.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.link}
                        className="block px-4 py-2 text-sm transition cursor-pointer"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--accent-color)';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        role="menuitem"
                        onClick={() => setOpenDropdown(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setOpenDropdown(null);
                            dropdownRefs.current[item.label]?.focus();
                          }
                        }}
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Empire AI CEO Page link */}
            <Link href="/empire" className="nav-link">
              🏆 Empire
            </Link>
            <Link href="/features" className="nav-link">
              ✨ Features
            </Link>
          </div>

          {/* Right-side quick links / buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSwitcher />
            <GoogleStyleMenu />
            
            {status === 'loading' ? (
              <div className="w-20 h-10 bg-gray-700 animate-pulse rounded-full"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 rounded-full text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                >
                  <User size={16} />
                  <span>{session.user?.name || 'User'}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50" style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-sm transition"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--accent-color)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} className="inline mr-2" />
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full text-left px-4 py-3 text-sm transition"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--error-color)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/signup">
                  <button className="px-4 py-2 bg-green-500 rounded-full text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition cursor-pointer" aria-label="Sign up for an account">
                    Sign Up
                  </button>
                </Link>
                <Link href="/auth/signin">
                  <button className="px-4 py-2 bg-yellow-500 rounded-full text-sm font-medium hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition cursor-pointer" aria-label="Login to your account">
                    Login
                  </button>
                </Link>
              </>
            )}
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

            {/* Mobile Language & Apps */}
            <div className="px-4 py-3 border-t border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1">
                  <LanguageSwitcher />
                </div>
                <GoogleStyleMenu />
              </div>
            </div>

            {/* Mobile buttons */}
            <div className="flex flex-col space-y-2 px-4 py-3 border-t border-gray-700">
              {session ? (
                <>
                  <div className="px-4 py-2 bg-green-500/20 rounded-lg text-sm text-green-400 font-medium text-center">
                    Hello, {session.user?.name || 'User'}!
                  </div>
                  <Link href="/profile" onClick={() => setMenuOpen(false)}>
                    <button className="px-4 py-2 bg-green-500 rounded-full text-sm font-medium hover:bg-green-600 transition w-full">
                      My Profile
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="px-4 py-2 bg-red-500 rounded-full text-sm font-medium hover:bg-red-600 transition w-full"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>
                    <button className="px-4 py-2 bg-green-500 rounded-full text-sm font-medium hover:bg-green-600 transition w-full">
                      Sign Up
                    </button>
                  </Link>
                  <Link href="/auth/signin" onClick={() => setMenuOpen(false)}>
                    <button className="px-4 py-2 bg-yellow-500 rounded-full text-sm font-medium hover:bg-yellow-600 transition w-full">
                      Login
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;