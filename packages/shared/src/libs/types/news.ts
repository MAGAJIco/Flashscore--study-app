
export interface NewsArticle {
  _id?: string;
  id: number | string;
  title: string;
  preview: string;
  fullContent: string;
  author: string | NewsAuthor;
  collaborationType?: 'prediction' | 'analysis' | 'community' | 'update';
  tags: string[];
  imageUrl?: string;
  isActive: boolean;
  viewCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface NewsAuthor {
  id: string;
  name: string;
  icon: string;
  bio?: string;
  expertise?: string[];
  collaborationCount?: number;
  isActive?: boolean;
  lastCollaboration?: Date | string;
}
