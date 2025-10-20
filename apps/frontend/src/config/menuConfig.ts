// apps/frontend/src/config/menuConfig.ts
export interface MenuCategory {
  id: string;
  label: string;
  items: MenuItem[];
}

export interface MenuItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  description?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export const menuCategories: MenuCategory[] = [
  {
    id: 'main',
    label: 'Main',
    items: [
      { label: 'Home', href: '/', icon: '🏠', description: 'Dashboard and overview' },
      { label: 'News', href: '/news', icon: '📰', badge: 'New', description: 'Latest sports news' },
      { label: 'Predictions', href: '/predictions', icon: '🎯', badge: 'AI', isPopular: true, description: 'AI-powered predictions' },
      { label: 'Leaderboard', href: '/leaderboard', icon: '🏆', description: 'Top performers' },
    ]
  },
  {
    id: 'features',
    label: 'Features',
    items: [
      { label: 'Live Matches', href: '/live', icon: '📺', isNew: true, description: 'Watch live games' },
      { label: 'Pi Wallet', href: '/wallet', icon: '💰', description: 'Manage your Pi coins' },
      { label: 'Analytics', href: '/analytics', icon: '📈', description: 'Performance metrics' },
      { label: 'Community', href: '/community', icon: '👥', description: 'Join discussions' },
    ]
  },
  {
    id: 'content',
    label: 'Content',
    items: [
      { label: 'Authors', href: '/author', icon: '✍️', description: 'Content creators' },
      { label: 'Archive', href: '/archive', icon: '📂', description: 'Past articles' },
      { label: 'Partnerships', href: '/partnerships', icon: '🤝', description: 'Partner with us' },
    ]
  },
  {
    id: 'account',
    label: 'Account',
    items: [
      { label: 'Profile', href: '/profile', icon: '👤', description: 'Your account' },
      { label: 'Profile', href: '/profile', icon: '👤', description: 'Your profile' },
      { label: 'Settings', href: '/settings', icon: '⚙️', description: 'Preferences' },
      { label: 'Management', href: '/management', icon: '🛠️', description: 'Admin panel' },
    ]
  },
  {
    id: 'info',
    label: 'Information',
    items: [
      { label: 'About', href: '/about', icon: 'ℹ️', description: 'Learn more' },
      { label: 'Help', href: '/help', icon: '❓', description: 'Get support' },
      { label: 'Privacy', href: '/privacy', icon: '🔒', description: 'Privacy policy' },
      { label: 'Terms', href: '/terms', icon: '📜', description: 'Terms of service' },
    ]
  }
];

export const menuItems = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "Predictions", href: "/predictions" },
  { label: "Authors", href: "/authors" },
  { label: "Management", href: "/management" },
];