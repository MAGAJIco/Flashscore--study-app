import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://flashstudy-ri0g.onrender.com";

    const response = await fetch(`${backendUrl}/api/authors/${id}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward auth token if present
        ...(req.headers.get("authorization") && {
          Authorization: req.headers.get("authorization")!,
        }),
      },
      // If your backend expects extra fields, add them here
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      let error;
      try {
        error = await response.json();
      } catch {
        error = { message: "Unknown error from backend" };
      }
      return NextResponse.json(error, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error following author:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to follow author" },
      { status: 500 }
    );
  }
}