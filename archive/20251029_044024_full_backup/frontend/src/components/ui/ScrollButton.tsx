"use client";

import React from "react";

interface ScrollButtonProps {
  direction: "left" | "right";
  onClick: () => void;
}

export function ScrollButton({ direction, onClick }: ScrollButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      aria-label={`Scroll ${direction}`}
    >
      {direction === "left" ? "←" : "→"}
    </button>
  );
}
