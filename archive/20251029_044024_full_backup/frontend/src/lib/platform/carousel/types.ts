
export type CarouselCategory = 'sports' | 'social' | 'achievements' | 'finance' | 'community';

export interface CarouselCard {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  gradient: string;
  bgGradient: string;
  icon: string;
  action: () => void;
  priority: number;
  show: boolean;
  category: CarouselCategory;
}

export interface CarouselConfig {
  enableDrag?: boolean;
  enableTouch?: boolean;
  snapToCenter?: boolean;
  autoRefreshInterval?: number;
  visibleCards?: number;
}
