// apps/frontend/src/app/api/sports-proxy/service.ts
export function createSportsAPIService() {
  return {
    async fetchEnhancedLiveMatches() {
      // Replace with your real fetch logic
      return [
        { id: 1, homeTeam: "Manchester United", awayTeam: "Liverpool", prediction: "Liverpool to win 2-1" },
        { id: 2, homeTeam: "Barcelona", awayTeam: "Real Madrid", prediction: "Draw 1-1" },
      ];
    },

    async fetchAllLiveMatches() {
      // Replace with your fallback fetch logic
      return [
        { id: 1, homeTeam: "Arsenal", awayTeam: "Chelsea", prediction: "Arsenal to win 2-0" },
        { id: 2, homeTeam: "Bayern Munich", awayTeam: "Borussia Dortmund", prediction: "Bayern Munich to win 3-0" },
      ];
    }
  };
}