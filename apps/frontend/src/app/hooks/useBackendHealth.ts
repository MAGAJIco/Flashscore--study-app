import { useEffect, useState } from "react";

export function useBackendHealth() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    // Try backend health endpoint with proper error handling
    fetch("/api/backend/health")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`HTTP ${res.status}`);
      })
      .then(() => setStatus("✅ Connected"))
      .catch((error) => {
        console.warn("Backend health check failed:", error);
        setStatus("❌ Disconnected");
      });
  }, []);

  return status;
}