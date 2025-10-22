import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch real predictions from database
    const predictionsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001'}/api/predictions?limit=500`, {
      cache: 'no-store'
    });
    
    if (!predictionsResponse.ok) {
      throw new Error('Failed to fetch predictions');
    }
    
    const predictionsData = await predictionsResponse.json();
    
    if (!predictionsData.success || !predictionsData.predictions) {
      throw new Error('Invalid predictions data');
    }
    
    // Group by user and calculate stats
    const userStatsMap = new Map<string, any>();
    const EMPIRE_RANKS = [
      { level: 1, title: 'Foundation Builder', minWinRate: 0 },
      { level: 2, title: 'Rising Analyst', minWinRate: 0.5 },
      { level: 3, title: 'Expert Predictor', minWinRate: 0.6 },
      { level: 4, title: 'Master Strategist', minWinRate: 0.7 },
      { level: 5, title: 'Elite Champion', minWinRate: 0.75 },
      { level: 6, title: 'Legendary Rooftop', minWinRate: 0.8 },
    ];
    
    (predictionsData.predictions || []).forEach((pred: any) => {
      if (!pred) return;
      
      const userId = pred.userId?.toString() || pred.authorId?.toString() || `user-${pred._id?.toString()?.slice(-8) || 'unknown'}`;
      
      if (!userStatsMap.has(userId)) {
        userStatsMap.set(userId, {
          userId,
          username: pred.username || `Predictor ${userId.slice(-8)}`,
          totalPredictions: 0,
          correctPredictions: 0,
          winRate: 0,
          growthLevel: 1,
          empireRank: 'Foundation Builder',
          streak: 0,
        });
      }
      
      const stats = userStatsMap.get(userId);
      stats.totalPredictions++;
      
      // Count correct predictions
      if (pred.result === 'correct' || (pred.status === 'completed' && pred.confidence > 75)) {
        stats.correctPredictions++;
      }
    });
    
    // Calculate final stats and rankings
    const leaderboard = Array.from(userStatsMap.values())
      .filter(stats => stats.totalPredictions >= 3) // Minimum 3 predictions
      .map(stats => {
        const winRate = stats.totalPredictions > 0 
          ? stats.correctPredictions / stats.totalPredictions 
          : 0;
        
        // Determine growth level
        let growthLevel = 1;
        for (const rank of EMPIRE_RANKS.reverse()) {
          if (winRate >= rank.minWinRate && stats.totalPredictions >= rank.level * 5) {
            growthLevel = rank.level;
            break;
          }
        }
        
        const empireRank = EMPIRE_RANKS.find(r => r.level === growthLevel)?.title || 'Foundation Builder';
        
        return {
          ...stats,
          winRate: Number(winRate.toFixed(3)),
          growthLevel,
          empireRank,
          streak: Math.max(0, Math.floor(stats.correctPredictions / 3)), // Simplified streak calculation
        };
      })
      .sort((a, b) => {
        // Sort by win rate, then by total predictions
        if (b.winRate !== a.winRate) {
          return b.winRate - a.winRate;
        }
        return b.totalPredictions - a.totalPredictions;
      })
      .slice(0, 20) // Top 20
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
    
    // If no real data, return sample
    const sampleLeaderboard = leaderboard.length > 0 ? leaderboard : [
      {
        rank: 1,
        userId: 'sample-001',
        username: 'SampleUser',
        totalPredictions: 10,
        correctPredictions: 7,
        winRate: 0.7,
        growthLevel: 3,
        empireRank: 'Expert Predictor',
        streak: 2,
      },
    ];

    return NextResponse.json(sampleLeaderboard);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
