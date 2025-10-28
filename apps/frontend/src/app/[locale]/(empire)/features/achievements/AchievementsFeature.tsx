
"use client";

import React from "react";
import { AchievementSystem } from "@/app/components/AchievementSystem";

interface AchievementsFeatureProps {
  currentUser: any;
  onAchievementUnlocked?: (achievement: any) => void;
}

export function AchievementsFeature({ currentUser, onAchievementUnlocked }: AchievementsFeatureProps) {
  return (
    <div className="space-y-6">
      <AchievementSystem 
        currentUser={currentUser}
        onAchievementUnlocked={onAchievementUnlocked}
      />
    </div>
  );
}

export default AchievementsFeature;
