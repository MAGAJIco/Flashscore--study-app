"use client";
import React, { Suspense } from "react";
import ComprehensiveSportsHub from "@/components/ComprehensiveSportsHub";
import SocialHub from "./components/SocialHub";
import PredictionLeague from "./components/PredictionLeague";
import SocialPredictionStreams from "./components/SocialPredictionStreams";
import MicroPredictions from "./components/MicroPredictions";
import CrossPlatformSync from "./components/CrossPlatformSync";
import SmartLoadingState from "./components/SmartLoadingState";
import SmartErrorRecovery from "./components/SmartErrorRecovery";
import OfflineQueueManager from "./components/OfflineQueueManager";


export default function HomePage() {
  return (
    <SmartErrorRecovery>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<SmartLoadingState type="dashboard" />}>
          <ComprehensiveSportsHub />
        </Suspense>
        
        <Suspense fallback={<SmartLoadingState type="card" count={3} />}>
          <PredictionLeague />
        </Suspense>
        
        <Suspense fallback={<SmartLoadingState type="list" count={5} />}>
          <SocialHub />
        </Suspense>
        
        <Suspense fallback={<SmartLoadingState type="chart" />}>
          <SocialPredictionStreams />
        </Suspense>
        
        <Suspense fallback={<SmartLoadingState type="card" count={4} />}>
          <MicroPredictions />
        </Suspense>
        
        <Suspense fallback={<SmartLoadingState type="card" />}>
          <CrossPlatformSync />
        </Suspense>
        
        <OfflineQueueManager />
      </div>
    </SmartErrorRecovery>
  );
}