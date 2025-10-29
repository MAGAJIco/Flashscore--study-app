import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock leaderboard data
    const leaderboard = [
      { rank: 1, username: 'EmpireBuilder', power: 150, achievements: 12 },
      { rank: 2, username: 'FoundationMaster', power: 120, achievements: 10 },
      { rank: 3, username: 'LegacySeeker', power: 95, achievements: 8 },
      { rank: 4, username: 'StrategyKing', power: 88, achievements: 7 },
      { rank: 5, username: 'VisionaryLeader', power: 75, achievements: 6 },
    ];

    return NextResponse.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}