"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { DIYF } from '@/app/components/DIYF';


export default function HomePage() {
  const = t useTranslations("home");


  return (
    <DIYF>
      <div className="space-y-10">
        {/* Hero Section */}
        <section className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold">{t("welcome")}</h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)]">
            {t("tagline")}
          </p>
      </div>
    </DIYF>
  );
}