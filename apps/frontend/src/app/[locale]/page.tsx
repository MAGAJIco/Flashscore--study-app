"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FlashScoreMatchTracker } from "@/app/components/FlashScoreMatchTracker";
import { UnifiedSportsHub } from "@/app/components/UnifiedSportsHub";
import { DIYF } from "@/app/components/DIYF";

export default function HomePage() {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  return (
    <DIYF>
      <div className="space-y-10">
        {/* Hero Section */}
        <section className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold">{t("welcome")}</h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)]">
            {t("tagline")}
          </p>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/predictions", emoji: "🎯", label: tc("predictions") },
            { href: "/matches", emoji: "⚽", label: tc("matches") },
            { href: "/news", emoji: "📰", label: tc("news") },
            { href: "/empire", emoji: "🏰", label: tc("empire") },
          ].map(({ href, emoji, label }) => (
            <a
              key={href}
              href={href}
              className="p-6 rounded-xl text-center transition-transform duration-200 hover:scale-105 bg-[var(--bg-secondary)] border border-[var(--border-color)]"
            >
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="font-semibold">{label}</div>
            </a>
          ))}
        </section>

        {/* Core Widgets */}
        <FlashScoreMatchTracker />
        <UnifiedSportsHub initialTab="overview" showPortalView />
      </div>
    </DIYF>
  );
}