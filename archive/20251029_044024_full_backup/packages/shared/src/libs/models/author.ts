
export interface AuthorStats {
  totalPredictions: number;
  correctPredictions: number;
  winStreak: number;
  maxWinStreak: number;
  followers: number;
  engagement: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface AuthorData {
  id: string;
  name: string;
  email: string;
  bio?: string;
  expertise: string[];
  isActive?: boolean;
  badges?: Badge[];
  stats?: Partial<AuthorStats>;
}

export interface AuthorDisplay {
  id: string;
  name: string;
  bio?: string;
  expertise: string[];
  isActive: boolean;
  badges: Badge[];
  stats: AuthorStats;
  winRate: number;
  level: number;
}

export interface Prediction {
  authorId: string;
  isActive: boolean;
  [key: string]: any;
}

export class Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  expertise: string[];
  isActive: boolean;
  badges: Badge[];
  stats: AuthorStats;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    bio?: string,
    expertise: string[] = [],
    isActive: boolean = true,
    badges: Badge[] = [],
    stats: Partial<AuthorStats> = {}
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.bio = bio;
    this.expertise = expertise;
    this.isActive = isActive;
    this.badges = badges || [];
    this.stats = {
      totalPredictions: 0,
      correctPredictions: 0,
      winStreak: 0,
      maxWinStreak: 0,
      followers: 0,
      engagement: 0,
      ...stats
    };
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static fromData(data: AuthorData): Author {
    return new Author(
      data.id,
      data.name,
      data.email,
      data.bio,
      data.expertise,
      data.isActive,
      data.badges,
      data.stats
    );
  }

  update(updateData: Partial<AuthorData>): void {
    Object.keys(updateData).forEach(key => {
      if (this.hasOwnProperty(key) && key !== 'id' && key !== 'createdAt') {
        (this as any)[key] = (updateData as any)[key];
      }
    });
    this.updatedAt = new Date();
  }

  getActivePredictions(predictions: Prediction[]): Prediction[] {
    return predictions.filter(prediction => 
      prediction.authorId === this.id && prediction.isActive
    );
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name || this.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Valid email is required');
    }

    if (!this.expertise || !Array.isArray(this.expertise) || this.expertise.length === 0) {
      errors.push('At least one area of expertise is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toDisplay(): AuthorDisplay {
    return {
      id: this.id,
      name: this.name,
      bio: this.bio,
      expertise: this.expertise,
      isActive: this.isActive,
      badges: this.badges,
      stats: this.stats,
      winRate: this.getWinRate(),
      level: this.getLevel()
    };
  }

  getWinRate(): number {
    if (this.stats.totalPredictions === 0) return 0;
    return Math.round((this.stats.correctPredictions / this.stats.totalPredictions) * 100);
  }

  getLevel(): number {
    const points = this.stats.correctPredictions * 10 + this.stats.followers * 2 + this.stats.engagement;
    return Math.floor(points / 100) + 1;
  }

  addBadge(badge: Badge): void {
    if (!this.badges.find(b => b.id === badge.id)) {
      this.badges.push(badge);
      this.updatedAt = new Date();
    }
  }

  checkForNewBadges(): Badge[] {
    const newBadges: Badge[] = [];
    const winRate = this.getWinRate();

    if (winRate >= 80 && !this.badges.find(b => b.id === 'expert_predictor')) {
      newBadges.push({
        id: 'expert_predictor',
        name: 'Expert Predictor',
        description: '80%+ win rate',
        icon: '🏆',
        color: '#FFD700'
      });
    }

    if (this.stats.winStreak >= 5 && !this.badges.find(b => b.id === 'hot_streak')) {
      newBadges.push({
        id: 'hot_streak',
        name: 'Hot Streak',
        description: '5+ correct predictions in a row',
        icon: '🔥',
        color: '#FF4500'
      });
    }

    if (this.stats.totalPredictions >= 100 && !this.badges.find(b => b.id === 'veteran')) {
      newBadges.push({
        id: 'veteran',
        name: 'Veteran',
        description: '100+ total predictions',
        icon: '⭐',
        color: '#9370DB'
      });
    }

    if (this.stats.followers >= 50 && !this.badges.find(b => b.id === 'popular')) {
      newBadges.push({
        id: 'popular',
        name: 'Popular',
        description: '50+ followers',
        icon: '👥',
        color: '#1E90FF'
      });
    }

    newBadges.forEach(badge => this.addBadge(badge));
    return newBadges;
  }
}
