
"use client";
import React from 'react';

export default function DebugPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1a1a",
      color: "#ffffff",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>🔍 MagajiCo Frontend Debug</h1>
      <div style={{ marginTop: "20px" }}>
        <h2>✅ React is working</h2>
        <p>Current time: {new Date().toLocaleString()}</p>
        <p>Node Environment: {process.env.NODE_ENV}</p>
        <p>User Agent: {typeof window !== 'undefined' ? navigator.userAgent : 'Server-side'}</p>
      </div>
      
      <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#333", borderRadius: "8px" }}>
        <h3>🚀 Status Check</h3>
        <p>✅ Frontend is loading</p>
        <p>✅ CSS is applied</p>
        <p>✅ JavaScript is executing</p>
      </div>
      
      <button 
        onClick={() => alert('Frontend is fully functional!')}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007acc",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Test Interaction
      </button>
    </div>
  );
}
