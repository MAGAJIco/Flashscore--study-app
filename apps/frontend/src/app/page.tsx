"use client";
import React from "react";
import ComprehensiveSportsHub from "@/components/ComprehensiveSportsHub";
import SocialHub from "./components/SocialHub";
import PredictionLeague from "./components/PredictionLeague";
import SocialPredictionStreams from "./components/SocialPredictionStreams";
import MicroPredictions from "./components/MicroPredictions";
import CrossPlatformSync from "./components/CrossPlatformSync";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ComprehensiveSportsHub />
      <PredictionLeague />
      <SocialHub />
      <SocialPredictionStreams />
      <MicroPredictions />
      <CrossPlatformSync />
    </div>
  );
}