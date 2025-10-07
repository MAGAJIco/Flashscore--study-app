
export const foundationApi = {
  async getLeaderboard() {
    try {
      const response = await fetch('/api/empire/leaderboard');
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  },

  async submitContribution(data: any) {
    try {
      const response = await fetch('/api/empire/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to submit contribution');
      return await response.json();
    } catch (error) {
      console.error('Error submitting contribution:', error);
      throw error;
    }
  }
};
