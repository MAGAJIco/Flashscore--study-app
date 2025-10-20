import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      preferences: {
        favoriteSports: [],
        favoriteTeams: [],
        predictionStyle: 'balanced',
        language: 'en',
        notificationSettings: {
          enabled: true,
          minConfidence: 70,
          sportsFilter: [],
        },
        dashboardLayout: [
          { id: '1', type: 'predictions', position: 0, enabled: true },
          { id: '2', type: 'live-scores', position: 1, enabled: true },
          { id: '3', type: 'news', position: 2, enabled: true },
          { id: '4', type: 'leaderboard', position: 3, enabled: true },
          { id: '5', type: 'social-feed', position: 4, enabled: true },
          { id: '6', type: 'achievements', position: 5, enabled: true },
        ],
      },
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const preferences = await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences,
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
