class Author {
  constructor(id, name, email, bio, expertise, isActive = true, badges = [], stats = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.bio = bio;
    this.expertise = expertise; // Array of sports/areas of expertise
    this.isActive = isActive;
    this.badges = badges || []; // Array of earned badges
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

  // Static method to create author from data
  static fromData(data) {
    return new Author(
      data.id,
      data.name,
      data.email,
      data.bio,
      data.expertise,
      data.isActive
    );
  }

  // Method to update author info
  update(updateData) {
    Object.keys(updateData).forEach(key => {
      if (this.hasOwnProperty(key) && key !== 'id' && key !== 'createdAt') {
        this[key] = updateData[key];
      }
    });
    this.updatedAt = new Date();
  }

  // Method to get author's active predictions
  getActivePredictions(predictions) {
    return predictions.filter(prediction => 
      prediction.authorId === this.id && prediction.isActive
    );
  }

  // Method to validate author data
  validate() {
    const errors = [];

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

  // Helper method to validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Method to format author for display
  toDisplay() {
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

  // Calculate win rate
  getWinRate() {
    if (this.stats.totalPredictions === 0) return 0;
    return Math.round((this.stats.correctPredictions / this.stats.totalPredictions) * 100);
  }

  // Calculate author level based on stats
  getLevel() {
    const points = this.stats.correctPredictions * 10 + this.stats.followers * 2 + this.stats.engagement;
    return Math.floor(points / 100) + 1;
  }

  // Add badge to author
  addBadge(badge) {
    if (!this.badges.find(b => b.id === badge.id)) {
      this.badges.push(badge);
      this.updatedAt = new Date();
    }
  }

  // Check if author qualifies for new badges
  checkForNewBadges() {
    const newBadges = [];
    const winRate = this.getWinRate();

    // Win rate badges
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

module.exports = Author;