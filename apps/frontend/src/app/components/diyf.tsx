
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { LoadingSkeleton } from "@/app/components";
import { SessionProvider, UserPreferencesProvider } from "@/app/providers";

const NavBar = dynamic(() => import("@/app/components").then(mod => ({ default: mod.NavBar })), {
  loading: () => <LoadingSkeleton />,
  ssr: false,
});

const BottomNavigation = dynamic(() => import("@/app/components").then(mod => ({ default: mod.BottomNavigation })), {
  loading: () => <LoadingSkeleton />,
  ssr: false,
});

const MobileOptimizationWrapper = dynamic(
  () => import("@/app/components").then(mod => ({ default: mod.MobileOptimizationWrapper })),
  {
    loading: () => <LoadingSkeleton />,
    ssr: false,
  },
);

interface DIYFProps {
  children: React.ReactNode;
}

export function DIYF({ children }: DIYFProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes("/auth/");

  if (isAuthPage) {
    return (
      <MobileOptimizationWrapper>
        <SessionProvider>
          <UserPreferencesProvider>{children}</UserPreferencesProvider>
        </SessionProvider>
      </MobileOptimizationWrapper>
    );
  }

  return (
    <MobileOptimizationWrapper>
      <SessionProvider>
        <UserPreferencesProvider>
          <NavBar />
          <div
            className="pt-16 pb-20 md:pb-0"
            style={{ minHeight: "calc(var(--vh, 1vh) * 100)" }}
          >
            {children}
          </div>
          <BottomNavigation />
        </UserPreferencesProvider>
      </SessionProvider>
    </MobileOptimizationWrapper>
  );
}
