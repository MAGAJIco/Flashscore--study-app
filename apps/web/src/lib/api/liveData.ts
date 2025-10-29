const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';

export interface LiveMatch {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  score: string;
  watching: string;
  homeTeam: string;
  awayTeam: string;
  status: string;
  league?: string;
}

export interface NewsItem {
  id: string;
  icon: string;
  badge: string;
  title: string;
  description: string;
  time: string;
  comments: string;
  author?: string;
  viewCount?: number;
  preview?: string;
  fullContent?: string;
  tags?: string[];
  createdAt?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:3001';

export const liveDataApi = {
  async fetchLiveMatches(): Promise<LiveMatch[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/matches/live`, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch live matches');

      const data = await response.json();

      return (data.matches || data || []).map((match: any) => ({
        id: match.id || match._id,
        icon: match.sport === 'football' ? '⚽' :
              match.sport === 'basketball' ? '🏀' :
              match.sport === 'tennis' ? '🎾' : '⚽',
        title: `${match.homeTeam?.name || match.homeTeam} vs ${match.awayTeam?.name || match.awayTeam}`,
        description: `${match.competition || match.league || 'Live Match'}`,
        time: match.minute ? `${match.minute}'` : match.status,
        score: `${match.homeTeam?.score || 0}-${match.awayTeam?.score || 0}`,
        watching: `${Math.floor(Math.random() * 200)}K`,
        homeTeam: match.homeTeam?.name || match.homeTeam,
        awayTeam: match.awayTeam?.name || match.awayTeam,
        status: match.status || 'live',
        league: match.competition || match.league
      }));
    } catch (error) {
      console.error('Error fetching live matches:', error);
      return [];
    }
  },

  async fetchLatestNews(): Promise<NewsItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news`);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        return data.data.map((item: any) => ({
          id: item.id?.toString() || item._id,
          icon: typeof item.author === 'object' ? item.author.icon : '📰',
          badge: item.collaborationType === 'prediction' ? 'BREAKING' : 'NEWS',
          title: item.title,
          description: item.preview,
          time: item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recently',
          comments: item.viewCount ? `${item.viewCount}` : '0',
          author: typeof item.author === 'object' ? item.author.name : item.author,
          viewCount: item.viewCount || 0,
          preview: item.preview,
          fullContent: item.fullContent,
          tags: item.tags || [],
          createdAt: item.createdAt
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  },

  formatTimeAgo(date: string): string {
    const now = new Date().getTime();
    const past = new Date(date).getTime();
    const diff = Math.floor((now - past) / 1000);

    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }
};

export async function fetchNews() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/news`);
    if (!response.ok) throw new Error('Failed to fetch news');
    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function fetchNewsAuthors() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/news/authors`);
    if (!response.ok) throw new Error('Failed to fetch news authors');
    return await response.json();
  } catch (error) {
    console.error('Error fetching news authors:', error);
    return [];
  }
}