"use client";

import React, { useState, useEffect } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "good" | "neutral";
  timestamp: Date;
}

export default function LiverpoolNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Simulate good news notifications for Liverpool
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        title: "⚽ Liverpool Match Starting Soon!",
        message: "Liverpool vs Man City kicks off in 30 minutes",
        type: "neutral",
        timestamp: new Date(),
      },
      {
        id: "2",
        title: "🎉 Great Betting Odds!",
        message: "Liverpool to win now at 2.5x - better odds than usual",
        type: "good",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
    ];

    // Filter for good news only
    const goodNews = sampleNotifications.filter((n) => n.type === "good");
    setNotifications(goodNews);

    // Show notification popup when there's good news
    if (goodNews.length > 0) {
      setShowNotifications(true);
      setTimeout(() => setShowNotifications(false), 8000);
    }
  }, []);

  if (notifications.length === 0) return null;

  return (
    <>
      {/* Notification Popup */}
      {showNotifications && (
        <div className="liverpool-notification-popup">
          {notifications.map((notif) => (
            <div key={notif.id} className="notification-card">
              <div className="notification-header">
                <div className="liverpool-badge">🔴 Liverpool</div>
                <button
                  className="close-btn"
                  onClick={() => setShowNotifications(false)}
                >
                  ✖
                </button>
              </div>
              <div className="notification-title">{notif.title}</div>
              <div className="notification-message">{notif.message}</div>
              <div className="notification-time">
                {Math.round((Date.now() - notif.timestamp.getTime()) / 60000)} min ago
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Notification Bell */}
      <div
        className="liverpool-bell"
        onClick={() => setShowNotifications(!showNotifications)}
        title="Liverpool good news only"
      >
        <span className="bell-icon">🔔</span>
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </div>

      <style jsx>{`
        .liverpool-notification-popup {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 2000;
          animation: slideInRight 0.5s ease;
        }

        .notification-card {
          background: linear-gradient(135deg, #c8102e 0%, #00a398 100%);
          color: white;
          border-radius: 12px;
          padding: 20px;
          width: 340px;
          box-shadow: 0 8px 24px rgba(200, 16, 46, 0.4);
          margin-bottom: 12px;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .liverpool-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }

        .close-btn:hover {
          opacity: 1;
        }

        .notification-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .notification-message {
          font-size: 0.95rem;
          line-height: 1.4;
          margin-bottom: 8px;
          opacity: 0.95;
        }

        .notification-time {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .liverpool-bell {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #c8102e 0%, #00a398 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(200, 16, 46, 0.4);
          transition: all 0.3s ease;
          z-index: 1500;
        }

        .liverpool-bell:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 24px rgba(200, 16, 46, 0.6);
        }

        .bell-icon {
          font-size: 1.8rem;
          animation: ring 2s infinite ease-in-out;
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff4444;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          border: 2px solid white;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes ring {
          0%, 100% {
            transform: rotate(0deg);
          }
          10%, 30% {
            transform: rotate(-10deg);
          }
          20%, 40% {
            transform: rotate(10deg);
          }
          50% {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </>
  );
}
