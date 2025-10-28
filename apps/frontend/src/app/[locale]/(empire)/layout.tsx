
"use client";

import React from "react";

export default function EmpireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="empire-layout min-h-screen">
      {children}
    </div>
  );
}
