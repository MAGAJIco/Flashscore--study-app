"use client";
import React, { useEffect, useState } from "react";

export default function FirstInstalled() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFirst() {
      setLoading(true);
      try {
        const res = await fetch("/api/analytics/first-installed");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "No data");
        setData(json.firstInstalled);
      } catch (err: any) {
        console.error("Failed to load first-installed:", err);
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchFirst();
  }, []);

  if (loading) return <div>Loading first-installed…</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No installs found</div>;

  return (
    <div>
      <h3>First PWA Install</h3>
      <div>Installed at: {data.installedAt}</div>
      <div>Recorded at: {data.createdAt}</div>
      <div>User agent: {data.userAgent ?? "unknown"}</div>
      <div>Platform: {data.platform ?? "unknown"}</div>
      <div>ClientId: {data.clientId ?? "—"}</div>
      <pre>{JSON.stringify(data.extra || {}, null, 2)}</pre>
    </div>
  );
}