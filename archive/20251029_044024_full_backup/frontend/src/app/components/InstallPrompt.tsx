"use client";
import React, { useEffect, useState } from "react";
import styles from "./InstallPrompt.module.css";

const isIos = () => {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
};

const isInStandaloneMode = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
};

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const beforeInstallHandler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallHandler);

    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setVisible(false);
      setDeferredPrompt(null);
      console.log("PWA installed");
    });

    // If already in standalone mode (iOS added), hide prompt
    if (isInStandaloneMode()) setInstalled(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice && choice.outcome === "accepted") {
        setInstalled(true);
        setVisible(false);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.warn("Install prompt failed:", err);
    }
  };

  if (installed) return null;

  // iOS manual instructions if no beforeinstallprompt event
  if (!visible && isIos() && !isInStandaloneMode()) {
    return (
      <div className={styles.container} role="dialog" aria-live="polite">
        <div className={styles.inner}>
          <strong>Add to Home Screen</strong>
          <p className={styles.hint}>Tap Share → Add to Home Screen to install this app.</p>
        </div>
      </div>
    );
  }

  if (!visible) return null;

  return (
    <div className={styles.container} role="dialog" aria-live="polite">
      <div className={styles.inner}>
        <div>
          <strong>Install Sports Central</strong>
          <p className={styles.hint}>Install this app for quick access and offline support.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.installBtn} onClick={handleInstallClick}>Install</button>
          <button className={styles.dismissBtn} onClick={() => setVisible(false)}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}