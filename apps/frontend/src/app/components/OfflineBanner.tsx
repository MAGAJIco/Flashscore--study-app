"use client";
import React from "react";

interface OfflineBannerProps {
  lastOnlineTime: Date | null;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ lastOnlineTime }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      ⚠️ You are offline. Last online:{" "}
      {lastOnlineTime ? lastOnlineTime.toLocaleTimeString() : "just now"}
    </div>
  );
};

export { OfflineBanner };