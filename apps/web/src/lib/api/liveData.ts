
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
}

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
      const response = await fetch(`${BACKEND_URL}/api/news`, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch news');

      const data = await response.json();
      
      return (data.news || data || []).slice(0, 5).map((item: any, index: number) => ({
        id: item.id || item._id,
        icon: item.tags?.[0] === 'football' ? '⚽' : 
              item.tags?.[0] === 'basketball' ? '🏀' : 
              item.tags?.[0] === 'tennis' ? '🎾' : '📰',
        badge: index < 2 ? 'BREAKING' : 'NEWS',
        title: item.title,
        description: item.preview || item.fullContent?.substring(0, 100) + '...',
        time: this.formatTimeAgo(item.createdAt),
        comments: `${item.viewCount || Math.floor(Math.random() * 3000)}`,
        author: item.author?.name,
        viewCount: item.viewCount
      }));
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
