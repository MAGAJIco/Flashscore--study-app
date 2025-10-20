
// Echo System Helper Utilities
export const echoNotify = {
  success: (title: string, message: string, action?: { label: string; callback: () => void }) => {
    if (typeof window !== 'undefined' && (window as any).echoSystem) {
      (window as any).echoSystem.notify({ type: 'success', title, message, action });
    }
  },

  info: (title: string, message: string, action?: { label: string; callback: () => void }) => {
    if (typeof window !== 'undefined' && (window as any).echoSystem) {
      (window as any).echoSystem.notify({ type: 'info', title, message, action });
    }
  },

  warning: (title: string, message: string, action?: { label: string; callback: () => void }) => {
    if (typeof window !== 'undefined' && (window as any).echoSystem) {
      (window as any).echoSystem.notify({ type: 'warning', title, message, action });
    }
  },

  error: (title: string, message: string, action?: { label: string; callback: () => void }) => {
    if (typeof window !== 'undefined' && (window as any).echoSystem) {
      (window as any).echoSystem.notify({ type: 'error', title, message, action });
    }
  },

  // Preset notifications for common scenarios
  predictionSuccess: () => {
    echoNotify.success(
      'Prediction Submitted',
      'Your prediction has been recorded successfully!',
      { label: 'View Details', callback: () => window.location.href = '/predictions' }
    );
  },

  matchStarting: (matchName: string) => {
    echoNotify.info(
      'Match Starting Soon',
      `${matchName} begins in 5 minutes`,
      { label: 'Watch Live', callback: () => window.location.href = '/live' }
    );
  },

  piCoinsEarned: (amount: number) => {
    echoNotify.success(
      'Pi Coins Earned!',
      `You've earned ${amount} π from your correct prediction`,
      { label: 'View Wallet', callback: () => window.location.href = '/wallet' }
    );
  },

  systemMaintenance: () => {
    echoNotify.warning(
      'System Maintenance',
      'Scheduled maintenance in 10 minutes. Please save your work.'
    );
  },

  connectionError: () => {
    echoNotify.error(
      'Connection Lost',
      'Unable to reach server. Please check your internet connection.'
    );
  }
};

// Export types
export interface EchoNotification {
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    callback: () => void;
  };
}
