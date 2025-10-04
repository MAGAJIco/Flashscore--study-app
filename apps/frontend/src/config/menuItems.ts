export interface MenuItem {
  id: string;
  title: string;
  link: string;
  icon?: string;
  badge?: string;
  color?: string;
  subMenu?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  { 
    id: 'home', 
    title: 'Home', 
    link: '/', 
    icon: '🏠',
    color: 'blue'
  },
  { 
    id: 'news', 
    title: 'News', 
    link: '/news', 
    icon: '📰',
    badge: 'New',
    color: 'green'
  },
  { 
    id: 'predictions', 
    title: 'Predictions', 
    link: '/predictions', 
    icon: '🎯',
    badge: 'AI',
    color: 'purple'
  },
  { 
    id: 'leaderboard', 
    title: 'Leaderboard', 
    link: '/leaderboard', 
    icon: '🏆',
    color: 'yellow'
  },
  { 
    id: 'wallet', 
    title: 'Pi Wallet', 
    link: '/wallet', 
    icon: '💰',
    color: 'orange'
  },
  {
    id: 'sports',
    title: 'Sports',
    link: '#',
    icon: '⚽',
    color: 'teal',
    subMenu: [
      { id: 'football', title: 'Football', link: '/sports/football', icon: '⚽' },
      { id: 'basketball', title: 'Basketball', link: '/sports/basketball', icon: '🏀' },
      { id: 'baseball', title: 'Baseball', link: '/sports/baseball', icon: '⚾' },
      { id: 'tennis', title: 'Tennis', link: '/sports/tennis', icon: '🎾' },
    ],
  },
  {
    id: 'more',
    title: 'More',
    link: '#',
    icon: '⋯',
    color: 'gray',
    subMenu: [
      { id: 'analytics', title: 'Analytics', link: '/analytics', icon: '📈' },
      { id: 'community', title: 'Community', link: '/community', icon: '👥' },
      { id: 'partnerships', title: 'Partnerships', link: '/partnerships', icon: '🤝' },
      { id: 'about', title: 'About Us', link: '/about', icon: 'ℹ️' },
      { id: 'contact', title: 'Contact', link: '/contact', icon: '📧' },
      { id: 'help', title: 'Help Center', link: '/help', icon: '❓' },
    ],
  },
];