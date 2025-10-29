import { useEffect, useState } from "react";

export function useBackendHealth() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    fetch("/api/backend/health")
      .then((res) => res.json())
      .then(() => setStatus("✅ Connected"))
      .catch(() => setStatus("❌ Disconnected"));
  }, []);

  return status;
}