
export interface FeatureMetadata {
  id: string;
  name: string;
  description: string;
  category: 'ai' | 'social' | 'analytics' | 'education' | 'safety' | 'sports';
  status: 'live' | 'beta' | 'coming-soon';
  component?: string;
  icon: string;
  link?: string;
}

export const FEATURE_REGISTRY: Record<string, FeatureMetadata> = {
  // AI Features
  'ai-predictions': {
    id: 'ai-predictions',
    name: 'AI-Powered Predictions',
    description: 'Get real-time predictions with 87% accuracy using advanced ML models',
    category: 'ai',
    status: 'live',
    icon: '🤖',
    link: '/empire/ai-ceo'
  },
  'live-chat': {
    id: 'live-chat',
    name: 'ChatGPT-like Interface',
    description: 'Chat naturally with MagajiCo AI for predictions and insights',
    category: 'ai',
    status: 'live',
    icon: '💬',
    link: '/empire/ai-ceo'
  },
  'coach-assistant': {
    id: 'coach-assistant',
    name: 'AI Coach Assistant',
    description: 'Personal AI coach analyzes your predictions and helps you improve',
    category: 'education',
    status: 'live',
    icon: '🎓'
  },

  // Social Features
  'social-challenges': {
    id: 'social-challenges',
    name: 'Friend Challenges',
    description: 'Challenge friends to prediction battles and climb leaderboards',
    category: 'social',
    status: 'live',
    icon: '🏆'
  },
  'live-match-chat': {
    id: 'live-match-chat',
    name: 'Live Match Chat',
    description: 'Real-time chat during matches with other predictors',
    category: 'social',
    status: 'live',
    icon: '⚡'
  },

  // Analytics Features
  'advanced-analytics': {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Deep dive into your prediction patterns and performance',
    category: 'analytics',
    status: 'live',
    icon: '📊',
    link: '/analytics'
  },

  // Safety Features
  'kids-mode': {
    id: 'kids-mode',
    name: 'Kids Safe Mode',
    description: 'COPPA-compliant safe environment for young users',
    category: 'safety',
    status: 'live',
    icon: '👶'
  },
  'parental-dashboard': {
    id: 'parental-dashboard',
    name: 'Parental Dashboard',
    description: 'Real-time monitoring and controls for parents',
    category: 'safety',
    status: 'live',
    icon: '👨‍👩‍👧'
  }
};

export function getFeaturesByCategory(category: string): FeatureMetadata[] {
  return Object.values(FEATURE_REGISTRY).filter(f => f.category === category);
}

export function getFeaturesByStatus(status: string): FeatureMetadata[] {
  return Object.values(FEATURE_REGISTRY).filter(f => f.status === status);
}

export function getFeature(id: string): FeatureMetadata | undefined {
  return FEATURE_REGISTRY[id];
}
