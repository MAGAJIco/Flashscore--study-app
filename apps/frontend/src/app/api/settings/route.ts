
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In a real app, fetch from database
    const settings = {
      siteName: 'Sports Central',
      siteDescription: 'AI-powered sports predictions and analysis',
      maintenanceMode: false,
      registrationEnabled: true,
      emailNotifications: true,
      pushNotifications: true,
      aiPredictionThreshold: 75,
      maxDailyPredictions: 50,
      piCoinExchangeRate: 0.01,
      premiumPricing: 29.99,
      freeTrialDays: 7,
      maxUsersPerPlan: 1000
    };

    return NextResponse.json({
      success: true,
      settings,
      message: "Settings retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();
    
    // In a real app, save to database
    console.log('Saving settings:', settings);

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully"
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save settings" },
      { status: 500 }
    );
  }
}
