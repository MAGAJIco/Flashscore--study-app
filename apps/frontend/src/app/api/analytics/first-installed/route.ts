import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    const apiKey = process.env.NEXT_PUBLIC_ANALYTICS_API_KEY;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey) headers["x-analytics-key"] = apiKey;

    const res = await fetch(`${backend}/api/analytics/first-installed`, { method: "GET", headers });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy error getting first-installed:", err);
    return NextResponse.json({ success: false, error: "Backend unreachable" }, { status: 503 });
  }
}