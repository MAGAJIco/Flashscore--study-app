const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://flashscore-study-app.vercel.app"
    : "http://localhost:3001");

export interface NewsAuthor {
  id: string;
  name: string;
  icon: string;
  bio?: string;
  expertise?: string[];
  collaborationCount?: number;
}

export interface NewsItem {
  id: number;
  title: string;
  preview: string;
  fullContent: string;
  author: string | NewsAuthor;
  collaborationType?: "prediction" | "analysis" | "community" | "update";
  tags: string[];
  createdAt: string;
  viewCount: number;
  isActive?: boolean;
}

export interface NewsResponse {
  success: boolean;
  data: NewsItem[];
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export class NewsService {
  private static getAuthHeaders() {
    if (typeof window !== "undefined") {
      const memberAccess = localStorage.getItem("memberAccess") === "true";
      const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
      const userData = localStorage.getItem("currentUser");

      if (memberAccess || adminLoggedIn || userData) {
        return { Authorization: "Bearer member" };
      }
    }
    return {};
  }

  static async getAllNews(): Promise<NewsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news`, {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching news:", error);
      // Return fallback data
      return {
        success: false,
        data: this.getFallbackNews(),
        message: "Using fallback news data",
      };
    }
  }

  static async getNewsByAuthor(authorId: string): Promise<NewsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news/author/${authorId}`, {
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching news by author:", error);
      return {
        success: false,
        data: [],
        message: "Failed to fetch author news",
      };
    }
  }

  static async createNews(newsData: {
    title: string;
    preview: string;
    fullContent: string;
    authorId?: string;
    collaborationType?: "prediction" | "analysis" | "community" | "update";
    tags?: string[];
  }): Promise<NewsItem | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error creating news:", error);
      return null;
    }
  }

  static async deleteNews(newsId: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news/${newsId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error deleting news:", error);
      return false;
    }
  }

  private static getFallbackNews(): NewsItem[] {
    return [
      {
        id: 1,
        title: "Mara's Latest Prediction Analysis",
        preview: "Our expert Mara shares insights on upcoming matches...",
        fullContent:
          "Detailed analysis of upcoming football matches with statistical predictions and team performance metrics.",
        author: {
          id: "mara",
          name: "Mara",
          icon: "⚡",
          bio: "Sports analytics expert",
          expertise: ["analytics", "predictions"],
          collaborationCount: 15,
        },
        collaborationType: "prediction",
        tags: ["prediction", "analysis"],
        createdAt: new Date().toISOString(),
        viewCount: 245,
        isActive: true,
      },
      {
        id: 2,
        title: "Community Milestone Reached!",
        preview: "We've hit another major milestone in our sports community...",
        fullContent: "Thanks to all our members, we've reached 1000 successful predictions this month!",
        author: {
          id: "community",
          name: "Community Team",
          icon: "🏆",
          bio: "Community management",
          expertise: ["community"],
          collaborationCount: 50,
        },
        collaborationType: "community",
        tags: ["milestone", "community"],
        createdAt: new Date().toISOString(),
        viewCount: 189,
        isActive: true,
      },
    ];
  }
}