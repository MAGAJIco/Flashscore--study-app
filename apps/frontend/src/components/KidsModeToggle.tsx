import React from "react";
import { useKidsModeContext } from "../context/KidsModeContext";

export const KidsModeToggle: React.FC = () => {
  const { kidsMode, setKidsMode } = useKidsModeContext();

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setKidsMode(newValue);

    // Persist to backend if user authenticated (optional)
    try {
      await fetch("/api/user/settings/kids-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kidsMode: newValue }),
      });
    } catch (err) {
      // swallow; local state still applied
      console.error("Failed to persist kidsMode", err);
    }
  };

  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <input type="checkbox" checked={kidsMode} onChange={handle} />
      <span>Kids Mode</span>
    </label>
  );
};
