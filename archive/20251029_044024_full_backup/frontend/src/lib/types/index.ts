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
  badge: "BREAKING" | "NEWS";
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
  status: "complete" | "progress" | "pending";
  description: string;
}

export interface AppItem {
  icon: string;
  name: string;
  route?: string;
}
