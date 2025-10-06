
"use client";

import { useEffect, useState, useCallback } from 'react';

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

interface Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export function useBatteryOptimization() {
  const [batteryLevel, setBatteryLevel] = useState<number>(1);
  const [isCharging, setIsCharging] = useState<boolean>(true);
  const [powerSaveMode, setPowerSaveMode] = useState<boolean>(false);

  useEffect(() => {
    const nav = navigator as Navigator;
    
    if (nav.getBattery) {
      nav.getBattery().then((battery) => {
        const updateBatteryStatus = () => {
          setBatteryLevel(battery.level);
          setIsCharging(battery.charging);
          
          // Enable power save mode when battery is low and not charging
          if (battery.level < 0.2 && !battery.charging) {
            setPowerSaveMode(true);
          } else if (battery.level > 0.3 || battery.charging) {
            setPowerSaveMode(false);
          }
        };

        updateBatteryStatus();
        
        battery.addEventListener('chargingchange', updateBatteryStatus);
        battery.addEventListener('levelchange', updateBatteryStatus);
        
        return () => {
          battery.removeEventListener('chargingchange', updateBatteryStatus);
          battery.removeEventListener('levelchange', updateBatteryStatus);
        };
      });
    }
  }, []);

  const getOptimizationSettings = useCallback(() => {
    if (powerSaveMode) {
      return {
        disableAnimations: true,
        reducePolling: true,
        pollingInterval: 30000, // 30 seconds
        disableBackgroundSync: true,
        reducedQuality: true,
        disableAutoRefresh: true,
        throttleUpdates: true
      };
    }
    
    if (batteryLevel < 0.5 && !isCharging) {
      return {
        disableAnimations: false,
        reducePolling: true,
        pollingInterval: 15000, // 15 seconds
        disableBackgroundSync: false,
        reducedQuality: false,
        disableAutoRefresh: false,
        throttleUpdates: true
      };
    }
    
    return {
      disableAnimations: false,
      reducePolling: false,
      pollingInterval: 5000, // 5 seconds
      disableBackgroundSync: false,
      reducedQuality: false,
      disableAutoRefresh: false,
      throttleUpdates: false
    };
  }, [powerSaveMode, batteryLevel, isCharging]);

  return {
    batteryLevel,
    isCharging,
    powerSaveMode,
    optimizationSettings: getOptimizationSettings()
  };
}
