import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB Connection
const uri = process.env.MONGODB_URI as string;
let client: MongoClient | null = null;

async function getClient() {
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set. Please configure it in your Replit Secrets.');
  }
  
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

// Types
export interface Prediction {
  _id?: ObjectId;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  predictedWinner: string;
  confidence: number;
  odds?: number;
  status: "upcoming" | "completed";
  matchDate: Date;
  source: "scraping" | "ml" | "hybrid";
  createdAt?: Date;
}

// Service: Scraping Layer
async function fetchScrapedMatches(): Promise<any[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/scrape/matches`);
  if (!response.ok) {
    throw new Error("Failed to fetch scraped matches");
  }
  return response.json();
}

// Service: ML Layer
async function getMlPrediction(match: any): Promise<any> {
  const mlServiceUrl = process.env.ML_SERVICE_URL || "http://0.0.0.0:8000";
  const response = await fetch(`${mlServiceUrl}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      features: [
        0.7,  // home strength
        0.65, // away strength
        0.6,  // home form
        0.55, // away form
        0.5,  // head to head
        2.0,  // home goals for
        1.0   // away goals against
      ]
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to get ML prediction");
  }
  return response.json();
}

// GET - Fetch all predictions
export async function GET(req: NextRequest) {
  try {
    const client = await getClient();
    const db = client.db("magajico");
    const predictions = db.collection<Prediction>("predictions");

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const results = await predictions
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ success: true, predictions: results }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/predictions error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch predictions" },
      { status: 500 }
    );
  }
}

// POST - Create new predictions
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode = "hybrid" } = body; // mode: "scraping" | "ml" | "hybrid"

    const client = await getClient();
    const db = client.db("magajico");
    const predictionsCollection = db.collection<Prediction>("predictions");

    const scrapedMatches = await fetchScrapedMatches();
    const predictions: Prediction[] = [];

    for (const match of scrapedMatches) {
      let mlResult: any = {};

      if (mode !== "scraping") {
        try {
          mlResult = await getMlPrediction(match);
        } catch (error) {
          console.error(`ML prediction failed for match ${match.id}:`, error);
        }
      }

      const prediction: Prediction = {
        matchId: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        predictedWinner: mlResult.predictedWinner || match.homeTeam,
        confidence: mlResult.confidence || 50,
        odds: match.odds,
        status: "upcoming",
        matchDate: new Date(match.date),
        source: mode,
        createdAt: new Date(),
      };

      const result = await predictionsCollection.insertOne(prediction);
      predictions.push({ ...prediction, _id: result.insertedId });
    }

    revalidatePath("/predictions");

    return NextResponse.json({ success: true, predictions }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/predictions error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate predictions" },
      { status: 500 }
    );
  }
}