"use client";
import React from "react";
import ComprehensiveSportsHub from "@/components/ComprehensiveSportsHub";
import AppDrawer from "@/components/AppDrawer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <AppDrawer />
      <div className="md:ml-80">
        <ComprehensiveSportsHub />
      </div>
    </div>
  );
}
