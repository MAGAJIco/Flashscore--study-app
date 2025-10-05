"use client";
import React from "react";
import ComprehensiveSportsHub from "@/components/ComprehensiveSportsHub";
import AuthorsSidebar from "@/components/AuthorsSidebar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <AuthorsSidebar />
      <div className="ml-80">
        <ComprehensiveSportsHub />
      </div>
    </div>
  );
}
