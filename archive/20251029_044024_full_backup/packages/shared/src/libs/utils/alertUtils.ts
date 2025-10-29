// AlertManager for shared package - server-side compatible
export class AlertManager {
  private static alerts: Array<{message: string; type: string; timestamp: number}> = [];

  static showInfo(message: string, persistent: boolean = false) {
    this.logAlert(message, 'info', persistent);
  }

  static showSuccess(message: string, persistent: boolean = false) {
    this.logAlert(message, 'success', persistent);
  }

  static showWarning(message: string, persistent: boolean = false) {
    this.logAlert(message, 'warning', persistent);
  }

  static showError(message: string, persistent: boolean = true) {
    this.logAlert(message, 'error', persistent);
  }

  private static logAlert(message: string, type: string, persistent: boolean) {
    // The original code had 'persistent' as part of the alert object, but it wasn't used in the original logAlert.
    // The edited code removes 'persistent' from the alert object and adds logic for auto-clearing.
    // I am preserving the structure of the alert object to be consistent with the original, but will not include 'persistent' as it's not used in the edited logAlert.
    const alert = { message, type, timestamp: Date.now() };
    this.alerts.push(alert);

    // Log to console for server-side visibility
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Auto-clear non-persistent alerts after 5 seconds
    if (!persistent) {
      setTimeout(() => {
        const index = this.alerts.indexOf(alert);
        if (index > -1) {
          this.alerts.splice(index, 1);
        }
      }, 5000);
    }
  }

  static getAlerts() {
    // Return a copy to prevent external modification
    return [...this.alerts];
  }

  static clearAlerts() {
    this.alerts = [];
  }
}