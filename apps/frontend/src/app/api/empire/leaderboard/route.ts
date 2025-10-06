import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sampleLeaderboard = [
      {
        rank: 1,
        userId: 'user-elite-001',
        username: 'ElitePro',
        totalPredictions: 250,
        correctPredictions: 205,
        winRate: 0.82,
        growthLevel: 6,
        empireRank: 'Legendary Rooftop',
        streak: 12,
      },
      {
        rank: 2,
        userId: 'user-master-002',
        username: 'StrategyMaster',
        totalPredictions: 180,
        correctPredictions: 130,
        winRate: 0.72,
        growthLevel: 4,
        empireRank: 'Master Strategist',
        streak: 5,
      },
      {
        rank: 3,
        userId: 'user-expert-003',
        username: 'ExpertAnalyst',
        totalPredictions: 120,
        correctPredictions: 75,
        winRate: 0.625,
        growthLevel: 3,
        empireRank: 'Expert Predictor',
        streak: 3,
      },
      {
        rank: 4,
        userId: 'user-rising-004',
        username: 'RisingAnalyst',
        totalPredictions: 45,
        correctPredictions: 25,
        winRate: 0.556,
        growthLevel: 2,
        empireRank: 'Rising Analyst',
        streak: 2,
      },
      {
        rank: 5,
        userId: 'user-builder-005',
        username: 'FoundationBuilder',
        totalPredictions: 8,
        correctPredictions: 3,
        winRate: 0.375,
        growthLevel: 1,
        empireRank: 'Foundation Builder',
        streak: 0,
      },
    ];

    return NextResponse.json(sampleLeaderboard);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
