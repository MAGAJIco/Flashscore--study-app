// apps/backend/src/routes/predictions.ts
import { FastifyInstance } from "fastify";
import { MongoClient } from "mongodb";
import fetch from "node-fetch";
import { predictMatch } from "../services/predictionService"; // can still wrap ML calls

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
await client.connect();
const db = client.db("magajico");
const predictions = db.collection("predictions");

export async function predictionRoutes(server: FastifyInstance) {
  // GET: Manual Prediction via Query Params
  server.get("/predictions", async (request, reply) => {
    try {
      const { homeTeam, awayTeam } = request.query as {
        homeTeam: string;
        awayTeam: string;
      };

      if (!homeTeam || !awayTeam) {
        return reply.status(400).send({ error: "Missing team names" });
      }

      // Call prediction service (could be ML API or local logic)
      const result = await predictMatch(homeTeam, awayTeam);

      // Save to DB
      const record = {
        homeTeam,
        awayTeam,
        predictedWinner: result.predictedWinner,
        confidence: result.confidence,
        createdAt: new Date(),
        source: "manual",
      };

      await predictions.insertOne(record);

      return { success: true, data: record };
    } catch (err: any) {
      return reply.status(500).send({
        success: false,
        error: err.message || "Prediction error",
      });
    }
  });

  // POST: Auto Prediction via Scraping + ML
  server.post("/predictions", async (request, reply) => {
    try {
      const { mode } = request.body as { mode: "scraping" | "ml" | "hybrid" };

      // Step 1: Scrape fixtures (replace with cheerio service)
      const scrapedMatches = await fetch("http://localhost:3000/scrape/matches").then(r => r.json());

      const results: any[] = [];

      for (const match of scrapedMatches) {
        let mlResult: any = {};

        if (mode !== "scraping") {
          // Step 2: Call ML microservice
          mlResult = await fetch("http://0.0.0.0:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(match),
          }).then(r => r.json());
        }

        const prediction = {
          matchId: match.id,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          predictedWinner: mlResult.predictedWinner || match.homeTeam,
          confidence: mlResult.confidence || 50,
          odds: match.odds,
          status: "upcoming",
          matchDate: match.date,
          source: mode,
          createdAt: new Date(),
        };

        await predictions.insertOne(prediction);
        results.push(prediction);
      }

      return reply.status(201).send({ success: true, predictions: results });
    } catch (err: any) {
      return reply.status(500).send({
        success: false,
        error: err.message || "Auto prediction error",
      });
    }
  });
}