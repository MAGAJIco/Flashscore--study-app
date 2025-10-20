// apps/backend/src/utils/authorHelpers.ts

// Define INewsAuthor interface
export interface INewsAuthor {
  id: string;
  name: string;
  icon: string;
  bio?: string;
  expertise?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  collaborations?: number;
  views?: number;
  engagement?: number;
}

// Define collaboration types
export interface ICollaboration {
  id: string;
  authorId: string;
  title: string;
  preview: string;
  fullContent: string;
  collaborationType: "prediction" | "analysis" | "community" | "update";
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to validate author data
export function validateAuthorData(author: Partial<INewsAuthor>): boolean {
  if (!author.id || !author.name || !author.icon) {
    return false;
  }
  return true;
}

// Helper function to format author for response
export function formatAuthorResponse(author: INewsAuthor) {
  return {
    id: author.id,
    name: author.name,
    icon: author.icon,
    bio: author.bio || '',
    expertise: author.expertise || [],
    stats: {
      collaborations: author.collaborations || 0,
      views: author.views || 0,
      engagement: author.engagement || 0
    }
  };
}

// Helper function to create author slug
export function createAuthorSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to validate collaboration data
export function validateCollaborationData(collaboration: Partial<ICollaboration>): boolean {
  if (!collaboration.authorId || !collaboration.title || !collaboration.fullContent) {
    return false;
  }
  
  const validTypes = ["prediction", "analysis", "community", "update"];
  if (collaboration.collaborationType && !validTypes.includes(collaboration.collaborationType)) {
    return false;
  }
  
  return true;
}

// Example usage of INewsAuthor (around line 69)
export function getAuthorById(id: string): INewsAuthor | null {
  // Your implementation here
  // This is just an example showing INewsAuthor usage
  const author: INewsAuthor = {
    id,
    name: 'Example Author',
    icon: 'default.png',
    bio: 'Example bio',
    expertise: ['Sports', 'Analytics']
  };
  
  return author;
}