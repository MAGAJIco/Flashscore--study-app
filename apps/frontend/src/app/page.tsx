"use client";
import React from "react";
import ComprehensiveSportsHub from "@/app/components/ComprehensiveSportsHub";
import AuthorsSidebar from "@/app/components/AuthorsSidebar";

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
