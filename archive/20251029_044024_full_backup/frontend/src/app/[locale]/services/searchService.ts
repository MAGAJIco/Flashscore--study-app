
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export interface SearchResult {
  id: string;
  type: 'article' | 'author' | 'prediction';
  title: string;
  content?: string;
  author?: string;
  sport?: string;
  confidence?: string;
  tags?: string[];
  publishDate?: string;
  winRate?: number;
  expertise?: string[];
  source?: string;
}

export interface SearchFilters {
  type?: 'all' | 'articles' | 'authors' | 'predictions';
  sport?: string;
  dateRange?: '24h' | '7d' | '30d' | 'all';
  sortBy?: 'relevance' | 'date' | 'popularity' | 'confidence';
  limit?: number;
}

export class SearchService {
  static async search(query: string, filters: SearchFilters = {}): Promise<{
    results: SearchResult[];
    total: number;
  }> {
    try {
      const searchParams = new URLSearchParams({
        query,
        ...(filters.type && { type: filters.type }),
        ...(filters.sport && { sport: filters.sport }),
        ...(filters.limit && { limit: filters.limit.toString() })
      });

      const response = await fetch(`/api/search?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Search failed');
      }

      return {
        results: data.results || [],
        total: data.total || 0
      };

    } catch (error) {
      console.error('Search service error:', error);
      
      // Return fallback/mock data if API fails
      return this.getFallbackResults(query, filters);
    }
  }

  static async getSearchSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];

    const commonSuggestions = [
      'Manchester United', 'Premier League', 'NBA playoffs', 'Transfer news',
      'Basketball predictions', 'Football analysis', 'Champions League',
      'Tennis predictions', 'Liverpool vs Arsenal', 'Real Madrid',
      'Cristiano Ronaldo', 'Messi', 'LeBron James', 'Tom Brady'
    ];

    return commonSuggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }

  private static getFallbackResults(query: string, filters: SearchFilters): {
    results: SearchResult[];
    total: number;
  } {
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'article',
        title: 'Premier League Transfer Window Analysis',
        content: 'Comprehensive analysis of the latest transfer moves in the Premier League...',
        author: 'Sports Editor',
        tags: ['transfers', 'premier-league', 'analysis'],
        publishDate: '2024-01-15',
        source: 'internal'
      },
      {
        id: '2',
        type: 'author',
        title: 'John "The Rocket" Rodriguez',
        content: 'Former NFL quarterback turned elite sports analyst with 12+ years experience.',
        expertise: ['Football', 'Soccer', 'Basketball'],
        winRate: 85,
        source: 'internal'
      },
      {
        id: '3',
        type: 'prediction',
        title: 'Manchester United vs Liverpool - Home Win Expected',
        content: 'Manchester United shows strong form at home this season.',
        author: 'John Rodriguez',
        sport: 'Soccer',
        confidence: '75%',
        publishDate: '2024-01-20',
        source: 'internal'
      }
    ];

    // Filter mock results based on query and filters
    const filteredResults = mockResults.filter(result => {
      const matchesQuery = result.title.toLowerCase().includes(query.toLowerCase()) ||
                          result.content?.toLowerCase().includes(query.toLowerCase());
      
      const matchesType = !filters.type || filters.type === 'all' || 
                         (filters.type === 'articles' && result.type === 'article') ||
                         (filters.type === 'authors' && result.type === 'author') ||
                         (filters.type === 'predictions' && result.type === 'prediction');
      
      return matchesQuery && matchesType;
    });

    return {
      results: filteredResults,
      total: filteredResults.length
    };
  }
}
