
"use client";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light");

  // Detect system theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "auto" | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("auto");
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "auto") {
        setEffectiveTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Update effective theme based on selection
  useEffect(() => {
    if (theme === "auto") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setEffectiveTheme(isDark ? "dark" : "light");
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme]);

  // Apply to <html> element + save preference
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(effectiveTheme);
    localStorage.setItem("theme", theme);
    
    // Set meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", effectiveTheme === "dark" ? "#1a1f3a" : "#ffffff");
    }
  }, [effectiveTheme, theme]);

  const cycleTheme = () => {
    if (theme === "auto") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("auto");
  };

  const getThemeIcon = () => {
    if (theme === "auto") return "🔄";
    if (theme === "light") return "☀️";
    return "🌙";
  };

  const getThemeLabel = () => {
    if (theme === "auto") return "Auto";
    if (theme === "light") return "Light";
    return "Dark";
  };

  return (
    <button
      onClick={cycleTheme}
      className="btn btn-primary fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        background: effectiveTheme === "dark" 
          ? "linear-gradient(135deg, #374151, #1f2937)" 
          : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        color: "white",
        border: "none",
        fontSize: "0.9rem",
        fontWeight: "600",
        minHeight: "44px",
        minWidth: "44px",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        boxShadow: effectiveTheme === "dark" 
          ? "0 4px 16px rgba(0, 0, 0, 0.5)" 
          : "0 4px 16px rgba(59, 130, 246, 0.3)"
      }}
      title={`Theme: ${getThemeLabel()} (tap to cycle)`}
    >
      <span style={{ fontSize: "1.2rem" }}>{getThemeIcon()}</span>
      <span className="hidden sm:inline">{getThemeLabel()}</span>
    </button>
  );
}
