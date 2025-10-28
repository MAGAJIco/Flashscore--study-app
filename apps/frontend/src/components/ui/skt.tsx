"use client";

import React from "react";

interface StatusBadgeProps {
  status: "complete" | "progress" | "pending";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    complete: {
      className: "bg-green-500 text-white",
      label: "✅ Complete",
    },
    progress: {
      className: "bg-orange-500 text-white",
      label: "🔄 In Progress",
    },
    pending: {
      className: "bg-gray-500 text-white",
      label: "⏳ Pending",
    },
  };

  const { className, label } = config[status];

  return (
    <span
      className={`${className} px-4 py-1 rounded-full text-sm font-semibold ml-3 inline-block`}
    >
      {label}
    </span>
  );
}
