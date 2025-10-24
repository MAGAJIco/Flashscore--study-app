
"use client";

import { useEffect } from 'react';

export function MobileMetaOptimizer() {
  useEffect(() => {
    // Optimize viewport for mobile
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, user-scalable=yes, viewport-fit=cover, interactive-widget=resizes-content'
      );

    // Add mobile-web-app-capable
    let mobileWebApp = document.querySelector('meta[name="mobile-web-app-capable"]');
    if (!mobileWebApp) {
      mobileWebApp = document.createElement('meta');
      mobileWebApp.setAttribute('name', 'mobile-web-app-capable');
      mobileWebApp.setAttribute('content', 'yes');
      document.head.appendChild(mobileWebApp);
    }

    // Add format detection
    let formatDetection = document.querySelector('meta[name="format-detection"]');
    if (!formatDetection) {
      formatDetection = document.createElement('meta');
      formatDetection.setAttribute('name', 'format-detection');
      formatDetection.setAttribute('content', 'telephone=no');
      document.head.appendChild(formatDetection);
    }
    }

    // Add theme-color for mobile browsers
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', '#C8102E');

    // Add apple-mobile-web-app-capable
    let appleCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleCapable) {
      appleCapable = document.createElement('meta');
      appleCapable.setAttribute('name', 'apple-mobile-web-app-capable');
      appleCapable.setAttribute('content', 'yes');
      document.head.appendChild(appleCapable);
    }

    // Add apple-mobile-web-app-status-bar-style
    let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleStatusBar) {
      appleStatusBar = document.createElement('meta');
      appleStatusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      appleStatusBar.setAttribute('content', 'black-translucent');
      document.head.appendChild(appleStatusBar);
    }

    // Prevent text size adjustment on mobile
    document.documentElement.style.webkitTextSizeAdjust = '100%';
    (document.documentElement.style as any).textSizeAdjust = '100%';

    // Add touch-action optimization
    document.body.style.touchAction = 'manipulation';
  }, []);

  return null;
}
