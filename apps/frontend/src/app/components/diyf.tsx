"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { UserPreferencesProvider } from "@/app/components/UserPreferencesProvider";
import { NavBar } from "@/app/components/NavBar";
import { BottomNavigation } from "@/app/components/BottomNavigation";

export function DIYF({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserPreferencesProvider>
        <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <NavBar />
          <main className="flex-grow container mx-auto px-4 py-6">
            {children}
          </main>
          <BottomNavigation />
        </div>
      </UserPreferencesProvider>
    </SessionProvider>
  );
}
