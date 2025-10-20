"use client";

import React, { useState, useEffect } from "react";

interface IOSInterfaceProps {
  children: React.ReactNode;
  showStatusBar?: boolean;
  enableHapticFeedback?: boolean;
}

export default function IOSInterface({
  children,
  showStatusBar = true,
  enableHapticFeedback = true,
}: IOSInterfaceProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [signalStrength, setSignalStrength] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleHapticFeedback = () => {
    if (enableHapticFeedback && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div
      data-show-status-bar={showStatusBar}
      data-enable-haptic-feedback={enableHapticFeedback}
    >
      {showStatusBar && (
        <div className="ios-status-bar">
          <div className="ios-status-left">
            <span className="ios-time">{formatTime(currentTime)}</span>
          </div>

          <div className="ios-status-center">
            <div className="ios-dynamic-island">
              <div className="ios-island-content">
                <div className="ios-island-dot active"></div>
                <div className="ios-island-dot"></div>
              </div>
            </div>
          </div>

          <div className="ios-status-right">
            <div className="ios-signal">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`ios-signal-bar ${i < signalStrength ? "active" : ""}`}
                  style={{ height: `${(i + 1) * 3}px` }}
                />
              ))}
            </div>

            <div className="ios-wifi">
              <svg
                width="15"
                height="11"
                viewBox="0 0 15 11"
                fill="currentColor"
              >
                <path d="M7.5 11L2.5 6C4.5 4 5.5 3.5 7.5 3.5S10.5 4 12.5 6L7.5 11Z" />
              </svg>
            </div>

            <div className="ios-battery">
              <div className="ios-battery-body">
                <div
                  className="ios-battery-level"
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>
              <div className="ios-battery-tip" />
            </div>

            <span className="ios-battery-percentage">{batteryLevel}%</span>
          </div>
        </div>
      )}

      <div className="ios-content" onClick={handleHapticFeedback}>
        {children}
      </div>

      <style jsx>{`
        :root {
          --ios-label: #fff;
          --ios-tertiary-label: rgba(235, 235, 245, 0.6);
          --ios-system-background: #000;
          --ios-green: #34c759;
          --ios-red: #ff3b30;
        }

        .ios-interface {
          min-height: 100vh;
          background: var(--ios-system-background);
          font-family:
            -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
          position: relative;
        }

        .ios-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 20px 6px 30px;
          height: 44px;
          background: transparent;
          color: var(--ios-label);
          font-size: 14px;
          font-weight: 600;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
        }

        .ios-status-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .ios-dynamic-island {
          width: 126px;
          height: 37px;
          background: #000000;
          border-radius: 19px;
          border: 1px solid #1c1c1e;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .ios-island-content {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ios-island-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #8e8e93;
        }

        .ios-island-dot.active {
          background: #34c759;
          box-shadow: 0 0 6px rgba(52, 199, 89, 0.6);
        }

        .ios-status-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ios-signal {
          display: flex;
          align-items: end;
          gap: 2px;
        }

        .ios-signal-bar {
          width: 3px;
          background: var(--ios-tertiary-label);
          border-radius: 1px;
        }

        .ios-signal-bar.active {
          background: var(--ios-label);
        }

        .ios-wifi {
          color: var(--ios-label);
        }

        .ios-battery {
          display: flex;
          align-items: center;
          gap: 1px;
        }

        .ios-battery-body {
          width: 24px;
          height: 12px;
          border: 1px solid var(--ios-label);
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }

        .ios-battery-level {
          height: 100%;
          background: ${batteryLevel > 20
            ? "var(--ios-green)"
            : "var(--ios-red)"};
          transition: width 0.3s ease;
        }

        .ios-battery-tip {
          width: 1px;
          height: 6px;
          background: var(--ios-label);
          border-radius: 0 1px 1px 0;
        }

        .ios-battery-percentage {
          font-size: 12px;
          margin-left: 4px;
        }

        .ios-content {
          padding-top: 44px;
          min-height: calc(100vh - 44px);
        }

        /* iOS 17 Safe Area Support */
        @supports (padding: max(0px)) {
          .ios-status-bar {
            padding-top: max(6px, env(safe-area-inset-top));
            height: max(44px, calc(44px + env(safe-area-inset-top)));
          }

          .ios-content {
            padding-top: max(44px, calc(44px + env(safe-area-inset-top)));
          }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          :root {
            --ios-label: #fff;
            --ios-tertiary-label: rgba(235, 235, 245, 0.6);
            --ios-system-background: #000;
            --ios-green: #34c759;
            --ios-red: #ff3b30;
          }

          .ios-dynamic-island {
            background: #1c1c1e;
            border-color: #2c2c2e;
          }
        }

        /* Responsive Design */
        @media (max-width: 380px) {
          .ios-dynamic-island {
            width: 100px;
            height: 32px;
          }

          .ios-status-bar {
            padding: 6px 15px 6px 20px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}

export { IOSInterface };
