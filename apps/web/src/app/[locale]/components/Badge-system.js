
// Badge System for Authors
class AuthorBadgeSystem {
  constructor() {
    this.authors = new Map();
    this.badgeLevels = [
      { name: 'Newcomer', minScore: 0, color: '#gray', icon: '🌱' },
      { name: 'Contributor', minScore: 100, color: '#blue', icon: '✍️' },
      { name: 'Regular', minScore: 300, color: '#green', icon: '⭐' },
      { name: 'Expert', minScore: 700, color: '#orange', icon: '🏆' },
      { name: 'Master', minScore: 1500, color: '#purple', icon: '👑' },
      { name: 'Legend', minScore: 3000, color: '#gold', icon: '🏅' }
    ];
  }

  // Initialize or get author data
  getAuthor(authorId, name = '') {
    if (!this.authors.has(authorId)) {
      this.authors.set(authorId, {
        id: authorId,
        name: name,
        posts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalViews: 0,
        score: 0,
        badge: this.badgeLevels[0],
        joinDate: new Date()
      });
    }
    return this.authors.get(authorId);
  }

  // Calculate engagement score based on activity
  calculateScore(author) {
    const postScore = author.posts * 10;
    const likeScore = author.totalLikes * 2;
    const commentScore = author.totalComments * 3;
    const shareScore = author.totalShares * 5;
    const viewScore = Math.floor(author.totalViews / 10);
    
    // Bonus for consistent posting (posts per day since joining)
    const daysSinceJoin = Math.max(1, Math.floor((new Date() - author.joinDate) / (1000 * 60 * 60 * 24)));
    const consistencyBonus = Math.floor((author.posts / daysSinceJoin) * 50);

    return postScore + likeScore + commentScore + shareScore + viewScore + consistencyBonus;
  }

  // Update author stats when they post
  recordPost(authorId, engagement = {}) {
    const author = this.getAuthor(authorId);
    author.posts++;
    
    if (engagement.likes) author.totalLikes += engagement.likes;
    if (engagement.comments) author.totalComments += engagement.comments;
    if (engagement.shares) author.totalShares += engagement.shares;
    if (engagement.views) author.totalViews += engagement.views;

    this.updateBadge(author);
    return author;
  }

  // Update engagement stats for existing posts
  recordEngagement(authorId, engagement) {
    const author = this.getAuthor(authorId);
    
    if (engagement.likes) author.totalLikes += engagement.likes;
    if (engagement.comments) author.totalComments += engagement.comments;
    if (engagement.shares) author.totalShares += engagement.shares;
    if (engagement.views) author.totalViews += engagement.views;

    this.updateBadge(author);
    return author;
  }

  // Update badge based on current score
  updateBadge(author) {
    author.score = this.calculateScore(author);
    
    // Find appropriate badge level
    for (let i = this.badgeLevels.length - 1; i >= 0; i--) {
      if (author.score >= this.badgeLevels[i].minScore) {
        author.badge = this.badgeLevels[i];
        break;
      }
    }
  }

  // Get all authors sorted by score
  getLeaderboard() {
    return Array.from(this.authors.values())
      .sort((a, b) => b.score - a.score);
  }

  // Generate HTML badge for display
  generateBadgeHTML(authorId) {
    const author = this.getAuthor(authorId);
    const badge = author.badge;
    
    return `
      <div class="author-badge" style="
        background: linear-gradient(45deg, ${badge.color}, ${this.lightenColor(badge.color)});
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">
        <span class="badge-icon">${badge.icon}</span>
        <span class="badge-name">${badge.name}</span>
        <span class="badge-score">${author.score}</span>
      </div>
    `;
  }

  // Helper function to lighten colors
  lightenColor(color) {
    const colors = {
      '#gray': '#a0a0a0',
      '#blue': '#4a90e2',
      '#green': '#4caf50',
      '#orange': '#ff9800',
      '#purple': '#9c27b0',
      '#gold': '#ffd700'
    };
    return colors[color] || color;
  }

  // Get progress to next badge level
  getProgressToNextBadge(authorId) {
    const author = this.getAuthor(authorId);
    const currentBadgeIndex = this.badgeLevels.findIndex(badge => badge.name === author.badge.name);
    
    if (currentBadgeIndex === this.badgeLevels.length - 1) {
      return { isMaxLevel: true };
    }

    const nextBadge = this.badgeLevels[currentBadgeIndex + 1];
    const progress = ((author.score - author.badge.minScore) / (nextBadge.minScore - author.badge.minScore)) * 100;
    const remaining = nextBadge.minScore - author.score;

    return {
      isMaxLevel: false,
      nextBadge: nextBadge,
      progress: Math.min(100, Math.max(0, progress)),
      remaining: Math.max(0, remaining)
    };
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthorBadgeSystem;
}
