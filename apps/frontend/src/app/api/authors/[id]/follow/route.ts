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
        ...(req.headers.get("authorization") && {
          Authorization: req.headers.get("authorization")!,
        }),
      },
      body: JSON.stringify({}), // add request body if needed
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to follow author" },
      { status: 500 }
    );
  }
}