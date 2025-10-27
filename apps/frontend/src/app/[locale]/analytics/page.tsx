"use client";

import React from "react";
import DIYF from "@/app/components/diyf"; // adjust import path if needed
import { AdvancedAnalytics } from "@/app/components/AdvancedAnalytics";
import { OptimizedDashboard } from "@/app/components/OptimizedDashboard";

export default function PersonalAnalyticsPage() {
  return (
    <DIYF>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                color: "#fff",
                fontSize: "2.5rem",
                marginBottom: "10px",
                background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              📊 Personal Performance Analytics
            </h1>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "1.1rem",
              }}
            >
              Track your prediction accuracy, earnings, and performance insights
            </p>
          </div>

          <AdvancedAnalytics />
          <OptimizedDashboard />
        </div>
      </div>
    </DIYF>
  );
}
