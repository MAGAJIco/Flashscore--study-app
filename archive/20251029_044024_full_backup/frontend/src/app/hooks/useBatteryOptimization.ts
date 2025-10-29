'use client';

import { useState, useEffect, useCallback } from 'react';

interface BatteryManager extends EventTarget {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => unknown) | null;
  onchargingtimechange: ((this: BatteryManager, ev: Event) => unknown) | null;
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => unknown) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => unknown) | null;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

interface OptimizationSettings {
  readonly disableAnimations: boolean;
  readonly reducedQuality: boolean;
  readonly limitBackgroundTasks: boolean;
}

interface BatteryState {
  readonly level: number; // 0..1
  readonly charging: boolean;
}

interface BatteryOptimizationReturn {
  readonly batteryState: BatteryState;
  readonly batteryLevel: number; // 0..1 convenience
  readonly isCharging: boolean;
  readonly powerSaveMode: boolean;
  readonly optimizationSettings: OptimizationSettings;
}

const LOW_BATTERY_THRESHOLD = 0.2;
const CRITICAL_BATTERY_THRESHOLD = 0.1;

const getDefaultOptimizations = (batteryLevel: number): OptimizationSettings => ({
  disableAnimations: batteryLevel < LOW_BATTERY_THRESHOLD,
  reducedQuality: batteryLevel < CRITICAL_BATTERY_THRESHOLD,
  limitBackgroundTasks: batteryLevel < LOW_BATTERY_THRESHOLD,
});

export const useBatteryOptimization = (): BatteryOptimizationReturn => {
  const [batteryState, setBatteryState] = useState<BatteryState>({
    level: 1,
    charging: true,
  });

  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>(
    getDefaultOptimizations(1)
  );

  const updateOptimizations = useCallback((level: number, charging: boolean): void => {
    if (charging) {
      setOptimizationSettings({
        disableAnimations: false,
        reducedQuality: false,
        limitBackgroundTasks: false,
      });
    } else {
      setOptimizationSettings(getDefaultOptimizations(level));
    }
  }, []);

  const handleBatteryChange = useCallback((battery: BatteryManager): void => {
    const newState: BatteryState = {
      level: typeof battery.level === 'number' ? battery.level : 1,
      charging: !!battery.charging,
    };

    setBatteryState(newState);
    updateOptimizations(newState.level, newState.charging);
  }, [updateOptimizations]);

  useEffect((): (() => void) | void => {
    // guard for SSR / build
    if (typeof navigator === 'undefined') return;

    const nav = navigator as NavigatorWithBattery;

    if (!nav.getBattery) {
      // Battery API not available; keep defaults
      return;
    }

    let battery: BatteryManager | null = null;

    const setupBatteryMonitoring = async (): Promise<void> => {
      try {
        battery = await nav.getBattery!();
        if (battery) {
          handleBatteryChange(battery);

          const onLevelChange = (): void => battery && handleBatteryChange(battery!);
          const onChargingChange = (): void => battery && handleBatteryChange(battery!);

          battery.addEventListener('levelchange', onLevelChange);
          battery.addEventListener('chargingchange', onChargingChange);

          // Clean up listeners on unmount via returned cleanup below
        }
      } catch (error) {
        // API may be blocked or unsupported
        // keep defaults silently
        // eslint-disable-next-line no-console
        if (process.env.NODE_ENV !== 'production') console.warn('Battery API not available or failed:', error);
      }
    };

    setupBatteryMonitoring();

    return (): void => {
      if (battery) {
        try {
          battery.removeEventListener('levelchange', () => {});
          battery.removeEventListener('chargingchange', () => {});
        } catch {
          // ignore
        }
      }
    };
  }, [handleBatteryChange]);

  const batteryLevel = batteryState.level;
  const isCharging = batteryState.charging;
  // powerSaveMode heuristic: when not charging and level below low threshold OR optimizationSettings.reducedQuality
  const powerSaveMode = !isCharging && (batteryLevel < LOW_BATTERY_THRESHOLD || optimizationSettings.reducedQuality);

  return {
    batteryState,
    batteryLevel,
    isCharging,
    powerSaveMode,
    optimizationSettings,
  };
};

export type { BatteryManager, OptimizationSettings, BatteryState, BatteryOptimizationReturn };