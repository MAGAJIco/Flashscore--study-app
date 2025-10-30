
'use client';

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

// Portal Icon - Home/Dashboard
export const PortalIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 22V12h6v10"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Predictions Icon - Chart/Analytics
export const PredictionsIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M3 3v18h18"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 9l-5 5-4-4-4 4"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="18" cy="9" r="2" stroke="currentColor" strokeWidth={strokeWidth} />
  </svg>
);

// Live Icon - Pulse/Activity
export const LiveIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M3 12h4l3-9 4 18 3-9h4"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// Social Icon - Users/People
export const SocialIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth={strokeWidth} />
    <path
      d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Kids Mode Icon - Star/Shield
export const KidsIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Rewards Icon - Trophy/Award
export const RewardsIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 4v5a6 6 0 01-12 0V4h12z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15v7M8 22h8"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Analytics Icon - Bar Chart
export const AnalyticsIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="10" width="4" height="11" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
    <rect x="10" y="6" width="4" height="15" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
    <rect x="17" y="3" width="4" height="18" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
  </svg>
);

// Chat Icon - Message Bubble
export const ChatIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Challenges Icon - Target
export const ChallengesIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={strokeWidth} />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth={strokeWidth} />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

// Search Icon
export const SearchIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth={strokeWidth} />
    <path
      d="M21 21l-4.35-4.35"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

// Help Icon
export const HelpIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={strokeWidth} />
    <path
      d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Settings Icon
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
    <path
      d="M12 1v6m0 6v10M1 12h6m6 0h10"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

// Menu/Apps Icon
export const AppsIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
    <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
    <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
    <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
  </svg>
);

// Soccer Ball Icon
export const SoccerIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={strokeWidth} />
    <path
      d="M12 2v4m0 12v4M2 12h4m12 0h4M5.64 5.64l2.83 2.83m7.07 7.07l2.83 2.83M5.64 18.36l2.83-2.83m7.07-7.07l2.83-2.83"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

// Close Icon
export const CloseIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Arrow Left
export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Arrow Right
export const ArrowRightIcon: React.FC<IconProps> = ({ size = 24, className = '', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M5 12h14M12 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
