
/**
 * Centralized Navigation Configuration
 * Single source of truth for all navigation items across the app
 */

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number | string;
  description?: string;
  color?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Bottom Navigation Items (Mobile)
export const bottomNavItems: NavItem[] = [
  {
    id: 'all-games',
    label: 'All Games',
    icon: '🏠',
    href: '/matches'
  },
  {
    id: 'live',
    label: 'LIVE',
    icon: '⚽',
    href: '/live',
    badge: 127
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: '⭐',
    href: '/favorites'
  },
  {
    id: 'news',
    label: 'News',
    icon: '📰',
    href: '/news'
  },
  {
    id: 'leagues',
    label: 'Leagues',
    icon: '🏆',
    href: '/leagues'
  }
];

// App Drawer Sections
export const drawerSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { id: 'home', label: 'Home', icon: '🏠', href: '/' },
      { id: 'empire', label: 'Empire', icon: '👑', href: '/empire' },
      { id: 'news', label: 'News', icon: '📰', href: '/news', badge: 'New' },
      { id: 'predictions', label: 'Predictions', icon: '📊', href: '/predictions', badge: 'AI' },
    ]
  },
  {
    title: 'Content',
    items: [
      { id: 'authors', label: 'Authors', icon: '✍️', href: '/author' },
      { id: 'create-author', label: 'Create Author', icon: '➕', href: '/author/new' },
    ]
  },
  {
    title: 'Management',
    items: [
      { id: 'users', label: 'Users', icon: '👥', href: '/management/users' },
      { id: 'content', label: 'Content', icon: '📝', href: '/management/content' },
      { id: 'analytics', label: 'Analytics', icon: '📈', href: '/management/analytics' },
      { id: 'payments', label: 'Payments', icon: '💳', href: '/management/payments' },
      { id: 'notifications', label: 'Notifications', icon: '🔔', href: '/management/notifications' },
      { id: 'settings', label: 'Settings', icon: '⚙️', href: '/management/settings' },
    ]
  },
  {
    title: 'More',
    items: [
      { id: 'partnerships', label: 'Partnerships', icon: '🤝', href: '/partnerships' },
      { id: 'privacy', label: 'Privacy', icon: '🔒', href: '/privacy' },
      { id: 'terms', label: 'Terms', icon: '📜', href: '/terms' },
    ]
  }
];

// Google-Style Menu Items
export const appMenuItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: '🏠', href: '/', description: 'Main Dashboard', color: 'bg-blue-500' },
  { id: 'live-matches', label: 'Live Matches', icon: '⚽', href: '/matches', description: 'FlashScore Style', color: 'bg-emerald-500' },
  { id: 'news', label: 'News', icon: '📰', href: '/news', description: 'Latest Sports News', color: 'bg-green-500' },
  { id: 'predictions', label: 'Predictions', icon: '📊', href: '/predictions', description: 'AI Predictions', color: 'bg-purple-500' },
  { id: 'kids-mode', label: 'Kids Mode', icon: '🌈', href: '/kids-mode', description: 'Safe Learning', color: 'bg-pink-500' },
  { id: 'authors', label: 'Authors', icon: '✍️', href: '/author', description: 'Content Authors', color: 'bg-orange-500' },
  { id: 'partnerships', label: 'Partnerships', icon: '🤝', href: '/partnerships', description: 'Partner Portal', color: 'bg-teal-500' },
  { id: 'management', label: 'Management', icon: '🛠️', href: '/management/users', description: 'Admin Panel', color: 'bg-red-500' },
  { id: 'analytics', label: 'Analytics', icon: '📈', href: '/management/analytics', description: 'Data Analytics', color: 'bg-indigo-500' },
];
