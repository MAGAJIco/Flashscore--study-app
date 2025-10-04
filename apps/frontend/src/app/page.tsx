// apps/frontend/src/app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import HorizontalCarousel from "./components/HorizontalCarousel";
import PWAInstaller from "./components/PWAInstaller";
import Link from "next/link";
import Navbar from "./components/NavBar";
import IOSInterface from "./components/iOSInterface";
import AppDrawer from "./components/AppDrawer";

// Mock data (replace with MongoDB later)
const latestNews = [
  { id: 1, title: "Fresh Match Update", date: "2025-10-01" },
  { id: 2, title: "Team A beats Team B", date: "2025-10-02" },
];

const archivedNews = [
  { id: 3, title: "Old Transfer Rumors", date: "2025-09-25" },
];

const predictions = [
  { id: 1, match: "Team X vs Team Y", prediction: "Team X wins", confidence: "78%" },
  { id: 2, match: "Team Z vs Team W", prediction: "Draw", confidence: "65%" },
];

export default function HomePage() {
  return (
    <IOSInterface showStatusBar={true} enableHapticFeedback={true}>
      <div className="min-h-screen bg-gray-100">
        {/* App Drawer */}
        <AppDrawer />

        {/* NavBar Component */}
        <Navbar />

        {/* Add top padding to account for fixed navbar */}
        <div className="pt-16">
        {/* Welcome Banner */}
        <div className="p-6 text-center bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg mx-4 mt-4">
          <h2 className="text-3xl font-semibold">Welcome to Sports Central</h2>
          <p className="text-gray-600">Get the latest sports news and predictions in one place.</p>
          <p className="text-sm text-gray-500 mt-2">Click the apps menu (⋮⋮⋮) in the top right to explore all features</p>
        </div>

        {/* Horizontal Carousel for Featured Content */}
        <section className="p-4">
          <HorizontalCarousel />
        </section>

        {/* Latest News */}
        <section className="p-6">
          <h3 className="text-xl font-bold mb-3">📰 Latest News</h3>
          {latestNews.map((news) => (
            <div key={news.id} className="p-3 bg-white shadow mb-2 rounded-lg">
              <h4>{news.title}</h4>
              <p className="text-sm text-gray-500">{news.date}</p>
            </div>
          ))}
        </section>

        {/* Predictions */}
        <section className="p-6">
          <h3 className="text-xl font-bold mb-3">📊 Predictions</h3>
          {predictions.map((p) => (
            <div key={p.id} className="p-3 bg-blue-50 shadow mb-2 rounded-lg">
              <h4>{p.match}</h4>
              <p>{p.prediction} ({p.confidence})</p>
            </div>
          ))}
        </section>

        {/* Archive */}
        <section className="p-6">
          <h3 className="text-xl font-bold mb-3">📂 Archive</h3>
          {archivedNews.map((news) => (
            <div key={news.id} className="p-3 bg-gray-200 shadow mb-2 rounded-lg">
              <h4>{news.title}</h4>
              <p className="text-sm text-gray-500">{news.date}</p>
            </div>
          ))}
        </section>

        {/* PWA Installer Component */}
        <PWAInstaller />
      </div>
    </div>
    </IOSInterface>
  );
}