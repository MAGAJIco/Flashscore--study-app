// ============================================
// FILE: tailwind.config.ts
// PATH: apps/frontend/tailwind.config.ts
// ============================================

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'slide-in': 'slideIn 0.5s ease forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;


// ============================================
// FILE: app/globals.css
// PATH: apps/frontend/src/app/globals.css
// ============================================

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom Scrollbar Hide */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Smooth Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease forwards;
}

/* Custom Gradient Background */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Hover Effects */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}


// ============================================
// FILE: app/(portal)/layout.tsx
// PATH: apps/frontend/src/app/(portal)/layout.tsx
// ============================================

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="portal-layout">
      {children}
    </div>
  );
}

export const metadata = {
  title: 'Sports Central - Portal',
  description: 'Feature-Based Architecture Documentation',
};


// ============================================
// FILE: components/cards/FeatureCard.tsx
// PATH: apps/frontend/src/components/cards/FeatureCard.tsx
// ============================================

"use client";

import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  items: string[];
  onClick?: () => void;
}

export function FeatureCard({ icon, title, description, items, onClick }: FeatureCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-6 transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 cursor-pointer"
    >
      <h3 className="text-2xl font-bold text-indigo-600 mb-3 flex items-center gap-2">
        <span className="text-3xl">{icon}</span>
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li 
            key={i}
            className="text-sm text-gray-700 py-2 border-b border-gray-300 last:border-0 transition-all hover:pl-2 hover:text-indigo-600"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}


// ============================================
// FILE: components/cards/CarouselCard.tsx
// PATH: apps/frontend/src/components/cards/CarouselCard.tsx
// ============================================

"use client";

import React from 'react';

interface CarouselCardProps {
  icon: string;
  title: string;
  description: string;
  badge?: {
    text: string;
    color: 'red' | 'blue';
  };
  metadata: Array<{
    icon: string;
    text: string;
  }>;
  onClick?: () => void;
}

export function CarouselCard({ icon, title, description, badge, metadata, onClick }: CarouselCardProps) {
  const badgeColors = {
    red: 'bg-red-500 animate-pulse',
    blue: 'bg-blue-500',
  };

  return (
    <div 
      onClick={onClick}
      className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 relative"
    >
      {badge && (
        <span className={`absolute top-4 right-4 ${badgeColors[badge.color]} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
          {badge.text}
        </span>
      )}
      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {description}
      </p>
      <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
        {metadata.map((item, index) => (
          <span key={index} className="flex items-center gap-1">
            {item.icon} {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}


// ============================================
// FILE: components/ui/StatusBadge.tsx
// PATH: apps/frontend/src/components/ui/StatusBadge.tsx
// ============================================

"use client";

import React from 'react';

interface StatusBadgeProps {
  status: 'complete' | 'progress' | 'pending';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    complete: {
      className: 'bg-green-500 text-white',
      label: '✅ Complete',
    },
    progress: {
      className: 'bg-orange-500 text-white',
      label: '🔄 In Progress',
    },
    pending: {
      className: 'bg-gray-500 text-white',
      label: '⏳ Pending',
    },
  };

  const { className, label } = config[status];

  return (
    <span className={`${className} px-4 py-1 rounded-full text-sm font-semibold ml-3 inline-block`}>
      {label}
    </span>
  );
}


// ============================================
// FILE: components/ui/ScrollButton.tsx
// PATH: apps/frontend/src/components/ui/ScrollButton.tsx
// ============================================

"use client";

import React from 'react';

interface ScrollButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

export function ScrollButton({ direction, onClick }: ScrollButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      aria-label={`Scroll ${direction}`}
    >
      {direction === 'left' ? '←' : '→'}
    </button>
  );
}


// ============================================
// FILE: lib/types/index.ts
// PATH: apps/frontend/src/lib/types/index.ts
// ============================================

export interface LiveMatch {
  icon: string;
  title: string;
  description: string;
  time: string;
  score: string;
  viewers: string;
}

export interface NewsItem {
  icon: string;
  title: string;
  description: string;
  time: string;
  comments: string;
  badge: 'BREAKING' | 'NEWS';
}

export interface FeatureApp {
  icon: string;
  title: string;
  description: string;
  items: string[];
  route?: string;
}

export interface TimelineItem {
  title: string;
  status: 'complete' | 'progress' | 'pending';
  description: string;
}

export interface AppItem {
  icon: string;
  name: string;
  route?: string;
}


// ============================================
// FILE: lib/constants/apps.ts
// PATH: apps/frontend/src/lib/constants/apps.ts
// ============================================

import { AppItem } from '../types';

export const APP_DRAWER_ITEMS: AppItem[] = [
  { icon: '🏠', name: 'Portal', route: '/' },
  { icon: '🤖', name: 'Predictions', route: '/predictions' },
  { icon: '⚡', name: 'Live', route: '/live' },
  { icon: '👥', name: 'Social', route: '/social' },
  { icon: '🎮', name: 'Kids Mode', route: '/kids' },
  { icon: '🏆', name: 'Rewards', route: '/rewards' },
  { icon: '📊', name: 'Analytics', route: '/analytics' },
  { icon: '💬', name: 'Chat', route: '/chat' },
  { icon: '🎯', name: 'Challenges', route: '/challenges' },
];


// ============================================
// FILE: lib/constants/features.ts
// PATH: apps/frontend/src/lib/constants/features.ts
// ============================================

import { FeatureApp } from '../types';

export const FEATURE_APPS: FeatureApp[] = [
  {
    icon: '🏠',
    title: 'Portal',
    description: 'Main dashboard & navigation hub',
    items: ['page.tsx - Landing with feature cards', 'layout.tsx - Portal-specific layout'],
    route: '/',
  },
  {
    icon: '🤖',
    title: 'Predictions',
    description: 'AI Predictions & ML Features',
    items: ['ai-predictions/ - ML interface', 'coach/ - AI coach assistant', 'analytics/ - Prediction analytics'],
    route: '/predictions',
  },
  {
    icon: '⚡',
    title: 'Live Tracking',
    description: 'Real-time sports updates',
    items: ['matches/ - Live match tracker', 'scores/ - Live scores display', 'odds/ - Live odds updates'],
    route: '/live',
  },
  {
    icon: '👥',
    title: 'Social',
    description: 'Community & engagement',
    items: ['feed/ - Social feed', 'challenges/ - Friend challenges', 'chat/ - Live match chat', 'forum/ - Community discussions'],
    route: '/social',
  },
  {
    icon: '🎮',
    title: 'Kids Mode',
    description: 'Safe environment for children',
    items: ['dashboard/ - Kids dashboard', 'quizzes/ - Educational quizzes', 'learning/ - Learning paths'],
    route: '/kids',
  },
  {
    icon: '🏆',
    title: 'Rewards',
    description: 'Achievements & gamification',
    items: ['achievements/ - Achievement system', 'leaderboard/ - Global rankings', 'coins/ - Pi Coin management'],
    route: '/rewards',
  },
];


// ============================================
// FILE: lib/constants/mockData.ts
// PATH: apps/frontend/src/lib/constants/mockData.ts
// ============================================

import { LiveMatch, NewsItem, TimelineItem } from '../types';

export const LIVE_MATCHES: LiveMatch[] = [
  {
    icon: '⚽',
    title: 'Man United vs Arsenal',
    description: 'Premier League - Thrilling match at Old Trafford',
    time: "67'",
    score: '2-1',
    viewers: '73K watching'
  },
  {
    icon: '🏀',
    title: 'Lakers vs Warriors',
    description: 'NBA - Western Conference showdown',
    time: 'Q3 5:23',
    score: '98-95',
    viewers: '120K watching'
  },
  {
    icon: '🏈',
    title: 'Patriots vs Chiefs',
    description: 'NFL - Championship game intensity',
    time: 'Q2 8:14',
    score: '14-21',
    viewers: '250K watching'
  },
  {
    icon: '🎾',
    title: 'Djokovic vs Alcaraz',
    description: 'Wimbledon Final - Epic rally battle',
    time: 'Set 2',
    score: '6-4, 3-4',
    viewers: '89K watching'
  },
  {
    icon: '🏏',
    title: 'India vs Australia',
    description: 'Test Cricket - Day 4 decisive moments',
    time: '45.2 overs',
    score: '234/5',
    viewers: '156K watching'
  },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    icon: '⚽',
    title: 'Mbappe Signs Historic Deal',
    description: 'Real Madrid announces record-breaking transfer for French superstar',
    time: '2 hours ago',
    comments: '1.2K comments',
    badge: 'BREAKING'
  },
  {
    icon: '🏀',
    title: 'LeBron Reaches 40K Points',
    description: 'King James makes history with unprecedented milestone achievement',
    time: '5 hours ago',
    comments: '892 comments',
    badge: 'NEWS'
  },
  {
    icon: '🎾',
    title: 'Serena Returns to Court',
    description: 'Tennis legend announces comeback tournament in Miami next month',
    time: '8 hours ago',
    comments: '645 comments',
    badge: 'NEWS'
  },
  {
    icon: '⚾',
    title: 'Yankees Win World Series',
    description: 'First championship in 15 years with dramatic Game 7 victory',
    time: '1 day ago',
    comments: '2.1K comments',
    badge: 'NEWS'
  },
  {
    icon: '🏁',
    title: 'Hamilton Breaks Records',
    description: 'Formula 1 legend secures 8th world championship in Abu Dhabi',
    time: '2 days ago',
    comments: '1.5K comments',
    badge: 'NEWS'
  },
];

export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    title: 'Frontend Route Groups',
    status: 'complete',
    description: 'All feature route groups created with proper layouts and navigation updated'
  },
  {
    title: 'Backend Modules',
    status: 'complete',
    description: 'Module structure created and routes reorganized with feature grouping'
  },
  {
    title: 'Service Layer',
    status: 'progress',
    description: 'Currently refactoring service layers for each module'
  },
  {
    title: 'Testing & Deployment',
    status: 'pending',
    description: 'Feature-specific testing and deployment pipeline setup'
  },
];

export const KEY_BENEFITS = [
  '✅ Better Organization',
  '✅ Easier Maintenance',
  '✅ Improved Performance',
  '✅ Team Scalability',
  '✅ Independent Testing',
  '✅ Flexible Deployment',
];

export const NEXT_STEPS = [
  '1. Move remaining components into feature directories',
  '2. Create service layers for each module',
  '3. Add module-specific middleware',
  '4. Implement feature-specific testing',
];


// ============================================
// FILE: hooks/useCarousel.ts
// PATH: apps/frontend/src/hooks/useCarousel.ts
// ============================================

"use client";

import { useRef, RefObject } from 'react';

export function useCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ 
        left: direction * 340, 
        behavior: 'smooth' 
      });
    }
  };

  return { carouselRef, scroll };
}


// ============================================
// FILE: package.json dependencies to add
// ============================================

/*
Make sure these are in your package.json:

{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  }
}
*/


// ============================================
// INSTALLATION INSTRUCTIONS
// ============================================

/*
1. Copy all files to their respective paths
2. Install dependencies: npm install
3. Run development server: npm run dev
4. Open http://localhost:3000
5. The portal page should render with all features!

THAT'S IT! 🎉
*/