"use client";
import React, { useState, useEffect } from "react";

interface Alert {
  id: string;
  message: string;
  title?: string;
  type: "success" | "danger" | "warning" | "info" | "prediction" | "news";
  timestamp: Date;
  confidence?: number;
  category?: string;
}

interface FloatingAlertProps {
  enabled: boolean;
  onToggle: () => void;
}

let alertQueue: Alert[] = [];
let triggerCallback: ((alert: Alert) => void) | null = null;

export const triggerFloatingAlert = (
  message: string | { 
    type: string; 
    title?: string; 
    message: string; 
    duration?: number;
    confidence?: number;
    category?: string;
  },
  type: "success" | "danger" | "warning" | "info" | "prediction" | "news" = "info"
) => {
  const alert: Alert = {
    id: Math.random().toString(36).substr(2, 9),
    message: typeof message === "string" ? message : message.message,
    title: typeof message === "string" ? undefined : message.title,
    type: typeof message === "string" ? type : (message.type as any) || type,
    timestamp: new Date(),
    confidence: typeof message === "string" ? undefined : message.confidence,
    category: typeof message === "string" ? undefined : message.category,
  };

  if (triggerCallback) {
    triggerCallback(alert);
  } else {
    alertQueue.push(alert);
  }
};

export default function FloatingAlert({ enabled, onToggle }: FloatingAlertProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    triggerCallback = (alert: Alert) => {
      if (enabled) {
        setAlerts((prev) => [...prev, alert]);
        setTimeout(() => {
          setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
        }, 8000);
      }
    };

    // Process queued alerts
    alertQueue.forEach((alert) => {
      if (triggerCallback) triggerCallback(alert);
    });
    alertQueue = [];

    return () => {
      triggerCallback = null;
    };
  }, [enabled]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "prediction": return "🎯";
      case "news": return "📰";
      case "success": return "✅";
      case "danger": return "⚠️";
      case "warning": return "⚡";
      default: return "ℹ️";
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "prediction": return "linear-gradient(135deg, #3b82f6, #2563eb)";
      case "news": return "linear-gradient(135deg, #8b5cf6, #7c3aed)";
      case "success": return "linear-gradient(135deg, #10b981, #059669)";
      case "danger": return "linear-gradient(135deg, #ef4444, #dc2626)";
      case "warning": return "linear-gradient(135deg, #f59e0b, #d97706)";
      default: return "linear-gradient(135deg, #3b82f6, #2563eb)";
    }
  };

  if (!enabled || alerts.length === 0) return null;

  return (
    <>
      {/* Message Center Toggle */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1001,
          background: "linear-gradient(135deg, #3b82f6, #2563eb)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
          fontSize: "1.25rem",
        }}
      >
        {isMinimized ? "🔔" : "✕"}
        {alerts.length > 0 && (
          <span style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            background: "#ef4444",
            color: "white",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: "bold",
          }}>
            {alerts.length}
          </span>
        )}
      </button>

      {/* Message Center Panel */}
      {!isMinimized && (
        <div style={{
          position: "fixed",
          top: "80px",
          right: "20px",
          zIndex: 1000,
          width: "380px",
          maxHeight: "600px",
          overflowY: "auto",
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
        }}>
          {/* Header */}
          <div style={{
            padding: "16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <div style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
              }}>
                💬
              </div>
              <h3 style={{
                color: "white",
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: "600",
              }}>
                Message Center
              </h3>
            </div>
            <button
              onClick={() => setAlerts([])}
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Clear All
            </button>
          </div>

          {/* Messages */}
          <div style={{ padding: "12px" }}>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  background: getAlertColor(alert.type),
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "12px",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}>
                  <div style={{ fontSize: "1.5rem" }}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    {alert.title && (
                      <div style={{
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        marginBottom: "6px",
                      }}>
                        {alert.title}
                      </div>
                    )}
                    <div style={{
                      fontSize: "0.9rem",
                      lineHeight: "1.5",
                      opacity: 0.95,
                    }}>
                      {alert.message}
                    </div>

                    {/* Confidence Bar for Predictions */}
                    {alert.confidence !== undefined && (
                      <div style={{ marginTop: "10px" }}>
                        <div style={{
                          fontSize: "0.75rem",
                          marginBottom: "4px",
                          opacity: 0.9,
                        }}>
                          Confidence: {alert.confidence}%
                        </div>
                        <div style={{
                          width: "100%",
                          height: "4px",
                          background: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "2px",
                          overflow: "hidden",
                        }}>
                          <div style={{
                            width: `${alert.confidence}%`,
                            height: "100%",
                            background: "white",
                            borderRadius: "2px",
                          }} />
                        </div>
                      </div>
                    )}

                    {/* Category Badge */}
                    {alert.category && (
                      <div style={{
                        display: "inline-block",
                        marginTop: "8px",
                        padding: "4px 10px",
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                      }}>
                        {alert.category}
                      </div>
                    )}

                    <div style={{
                      fontSize: "0.7rem",
                      marginTop: "8px",
                      opacity: 0.8,
                    }}>
                      {alert.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    color: "white",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}