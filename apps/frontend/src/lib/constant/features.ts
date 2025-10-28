// lib/constants/features.ts

import { FeatureApp } from "../types";

export const FEATURE_APPS: FeatureApp[] = [
  {
    icon: "🏠",
    title: "Portal",
    description: "Main dashboard & navigation hub",
    items: [
      "page.tsx - Landing with feature cards",
      "layout.tsx - Portal-specific layout",
    ],
    route: "/",
  },
  {
    icon: "🤖",
    title: "Predictions",
    description: "AI Predictions & ML Features",
    items: [
      "ai-predictions/ - ML interface",
      "coach/ - AI coach assistant",
      "analytics/ - Prediction analytics",
    ],
    route: "/predictions",
  },
  {
    icon: "⚡",
    title: "Live Tracking",
    description: "Real-time sports updates",
    items: [
      "matches/ - Live match tracker",
      "scores/ - Live scores display",
      "odds/ - Live odds updates",
    ],
    route: "/live",
  },
  {
    icon: "👥",
    title: "Social",
    description: "Community & engagement",
    items: [
      "feed/ - Social feed",
      "challenges/ - Friend challenges",
      "chat/ - Live match chat",
      "forum/ - Community discussions",
    ],
    route: "/social",
  },
  {
    icon: "🎮",
    title: "Kids Mode",
    description: "Safe environment for children",
    items: [
      "dashboard/ - Kids dashboard",
      "quizzes/ - Educational quizzes",
      "learning/ - Learning paths",
    ],
    route: "/kids",
  },
  {
    icon: "🏆",
    title: "Rewards",
    description: "Achievements & gamification",
    items: [
      "achievements/ - Achievement system",
      "leaderboard/ - Global rankings",
      "coins/ - Pi Coin management",
    ],
    route: "/rewards",
  },
];