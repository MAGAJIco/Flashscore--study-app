
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary?: string;
  image?: string;
  author: NewsAuthor;
  publishedAt: Date | string;
  updatedAt?: Date | string;
  tags?: string[];
  category?: string;
  views?: number;
  likes?: number;
}

export interface NewsAuthor {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  verified?: boolean;
  articlesCount?: number;
}
