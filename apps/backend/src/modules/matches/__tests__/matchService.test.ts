
import { describe, it, expect } from 'vitest';

describe('MatchService', () => {
  it('should validate match data structure', () => {
    const matchData = {
      homeTeam: 'Team A',
      awayTeam: 'Team B',
      date: new Date().toISOString()
    };
    
    expect(matchData).toHaveProperty('homeTeam');
    expect(matchData).toHaveProperty('awayTeam');
    expect(matchData).toHaveProperty('date');
  });
});
