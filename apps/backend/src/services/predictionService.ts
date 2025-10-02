// apps/backend/src/services/predictionService.ts
import { spawn } from "child_process";
import fetch from "node-fetch";

interface PredictionResult {
  predictedWinner: string;
  confidence: number;
}

/**
 * Try ML microservice first (FastAPI on :8000).
 * If it fails, fallback to local Python script.
 */
export async function predictMatch(
  homeTeam: string,
  awayTeam: string,
): Promise<PredictionResult> {
  // Try FastAPI first
  try {
    const response = await fetch("http://0.0.0.0:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ homeTeam, awayTeam }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.warn(
        "FastAPI ML returned error, falling back to local Python...",
      );
    }
  } catch (err) {
    console.warn(
      "FastAPI ML unavailable, falling back to local Python...",
      err,
    );
  }

  // Fallback: local Python
  return new Promise((resolve, reject) => {
    const py = spawn("python3", ["./ml/predict.py", homeTeam, awayTeam]);

    let data = "";
    let error = "";

    py.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python process failed: ${error}`));
      } else {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (err) {
          reject(new Error("Failed to parse AI response"));
        }
      }
    });
  });
}
