
```typescript
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
  readonly level: number;
  readonly charging: boolean;
}

const LOW_BATTERY_THRESHOLD = 0.2 as const;
const CRITICAL_BATTERY_THRESHOLD = 0.1 as const;

const getDefaultOptimizations = (batteryLevel: number): OptimizationSettings => ({
  disableAnimations: batteryLevel < LOW_BATTERY_THRESHOLD,
  reducedQuality: batteryLevel < CRITICAL_BATTERY_THRESHOLD,
  limitBackgroundTasks: batteryLevel < LOW_BATTERY_THRESHOLD,
});

export const useBatteryOptimization = () => {
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
      level: battery.level,
      charging: battery.charging,
    };
    
    setBatteryState(newState);
    updateOptimizations(newState.level, newState.charging);
  }, [updateOptimizations]);

  useEffect((): (() => void) | void => {
    const nav = navigator as NavigatorWithBattery;
    
    if (!nav.getBattery) {
      return;
    }

    let battery: BatteryManager | null = null;

    const setupBatteryMonitoring = async (): Promise<void> => {
      try {
        battery = await nav.getBattery!();
        handleBatteryChange(battery);

        const onLevelChange = (): void => battery && handleBatteryChange(battery);
        const onChargingChange = (): void => battery && handleBatteryChange(battery);

        battery.addEventListener('levelchange', onLevelChange);
        battery.addEventListener('chargingchange', onChargingChange);
      } catch (error) {
        console.warn('Battery API not supported:', error);
      }
    };

    setupBatteryMonitoring();

    return (): void => {
      if (battery) {
        battery.removeEventListener('levelchange', () => {});
        battery.removeEventListener('chargingchange', () => {});
      }
    };
  }, [handleBatteryChange]);

  return {
    batteryState,
    optimizationSettings,
  } as const;
};

export type { BatteryManager, OptimizationSettings, BatteryState };
```
