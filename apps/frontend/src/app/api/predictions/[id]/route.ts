import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB Connection
const uri = process.env.MONGODB_URI as string;
let client: MongoClient | null = null;

async function getClient() {
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Fetch single prediction by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid prediction ID" },
        { status: 400 }
      );
    }

    const client = await getClient();
    const db = client.db("magajico");
    const predictions = db.collection("predictions");

    const prediction = await predictions.findOne({ _id: new ObjectId(id) });

    if (!prediction) {
      return NextResponse.json(
        { error: "Prediction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, prediction }, { status: 200 });
  } catch (error: any) {
    console.error(`GET /api/predictions/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch prediction" },
      { status: 500 }
    );
  }
}

// PATCH - Update prediction
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid prediction ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const allowedUpdates = [
      "status",
      "predictedWinner",
      "confidence",
      "odds",
    ];

    const updates: any = {};
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid update fields provided" },
        { status: 400 }
      );
    }

    const client = await getClient();
    const db = client.db("magajico");
    const predictions = db.collection("predictions");

    const result = await predictions.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Prediction not found" },
        { status: 404 }
      );
    }

    revalidatePath("/predictions");

    return NextResponse.json(
      { success: true, prediction: result },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`PATCH /api/predictions/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to update prediction" },
      { status: 500 }
    );
  }
}

// DELETE - Delete prediction
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid prediction ID" },
        { status: 400 }
      );
    }

    const client = await getClient();
    const db = client.db("magajico");
    const predictions = db.collection("predictions");

    const result = await predictions.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Prediction not found" },
        { status: 404 }
      );
    }

    revalidatePath("/predictions");

    return NextResponse.json(
      { success: true, message: "Prediction deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`DELETE /api/predictions/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to delete prediction" },
      { status: 500 }
    );
  }
}