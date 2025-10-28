// lib/constants/mockData.ts
import { LiveMatch, NewsItem, TimelineItem } from "../types";

export const LIVE_MATCHES: LiveMatch[] = [
  {
    icon: "⚽",
    title: "Man United vs Arsenal",
    description: "Premier League - Thrilling match at Old Trafford",
    time: "67'",
    score: "2-1",
    viewers: "73K watching",
  },
  {
    icon: "🏀",
    title: "Lakers vs Warriors",
    description: "NBA - Western Conference showdown",
    time: "Q3 5:23",
    score: "98-95",
    viewers: "120K watching",
  },
  {
    icon: "🏈",
    title: "Patriots vs Chiefs",
    description: "NFL - Championship game intensity",
    time: "Q2 8:14",
    score: "14-21",
    viewers: "250K watching",
  },
  {
    icon: "🎾",
    title: "Djokovic vs Alcaraz",
    description: "Wimbledon Final - Epic rally battle",
    time: "Set 2",
    score: "6-4, 3-4",
    viewers: "89K watching",
  },
  {
    icon: "🏏",
    title: "India vs Australia",
    description: "Test Cricket - Day 4 decisive moments",
    time: "45.2 overs",
    score: "234/5",
    viewers: "156K watching",
  },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    icon: "⚽",
    title: "Mbappe Signs Historic Deal",
    description:
      "Real Madrid announces record-breaking transfer for French superstar",
    time: "2 hours ago",
    comments: "1.2K comments",
    badge: "BREAKING",
  },
  {
    icon: "🏀",
    title: "LeBron Reaches 40K Points",
    description:
      "King James makes history with unprecedented milestone achievement",
    time: "5 hours ago",
    comments: "892 comments",
    badge: "NEWS",
  },
  {
    icon: "🎾",
    title: "Serena Returns to Court",
    description:
      "Tennis legend announces comeback tournament in Miami next month",
    time: "8 hours ago",
    comments: "645 comments",
    badge: "NEWS",
  },
  {
    icon: "⚾",
    title: "Yankees Win World Series",
    description: "First championship in 15 years with dramatic Game 7 victory",
    time: "1 day ago",
    comments: "2.1K comments",
    badge: "NEWS",
  },
  {
    icon: "🏁",
    title: "Hamilton Breaks Records",
    description: "Formula 1 legend secures 8th world championship in Abu Dhabi",
    time: "2 days ago",
    comments: "1.5K comments",
    badge: "NEWS",
  },
];

export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    title: "Frontend Route Groups",
    status: "complete",
    description:
      "All feature route groups created with proper layouts and navigation updated",
  },
  {
    title: "Backend Modules",
    status: "complete",
    description:
      "Module structure created and routes reorganized with feature grouping",
  },
  {
    title: "Service Layer",
    status: "progress",
    description: "Currently refactoring service layers for each module",
  },
  {
    title: "Testing & Deployment",
    status: "pending",
    description: "Feature-specific testing and deployment pipeline setup",
  },
];

export const KEY_BENEFITS = [
  "✅ Better Organization",
  "✅ Easier Maintenance",
  "✅ Improved Performance",
  "✅ Team Scalability",
  "✅ Independent Testing",
  "✅ Flexible Deployment",
];

export const NEXT_STEPS = [
  "1. Move remaining components into feature directories",
  "2. Create service layers for each module",
  "3. Add module-specific middleware",
  "4. Implement feature-specific testing",
];
