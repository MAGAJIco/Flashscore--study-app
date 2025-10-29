import React, { useEffect, useState } from "react";
import { SecurityUtils } from '@magajico/shared/utils';

interface SecurityLog {
  id: string;
  message: string;
  timestamp: string;
}

interface SecurityStat {
  label: string;
  value: number;
}

export function SecurityDashboard() {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [stats, setStats] = useState<SecurityStat[]>([]);
  const [secureKey, setSecureKey] = useState<string>("");

  useEffect(() => {
    // Generate a secure key on mount
    setSecureKey(SecurityUtils.generateRandomKey());

    // Simulated data
    setLogs([
      { id: "1", message: "User login successful", timestamp: new Date().toISOString() },
      { id: "2", message: "Password change detected", timestamp: new Date().toISOString() },
      { id: "3", message: "New device authenticated", timestamp: new Date().toISOString() },
    ]);

    setStats([
      { label: "Active Sessions", value: 4 },
      { label: "Failed Attempts", value: 2 },
      { label: "Encrypted Keys", value: 12 },
    ]);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Security Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-700">Generated Secure Key</h2>
        <p className="bg-white border rounded-lg p-3 mt-1 font-mono text-blue-600">{secureKey}</p>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Security Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center"
            >
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium text-gray-700 mb-2">Recent Logs</h2>
        <ul className="bg-white border rounded-lg divide-y divide-gray-200">
          {logs.map((log) => (
            <li key={log.id} className="p-3">
              <p className="text-gray-800">{log.message}</p>
              <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}