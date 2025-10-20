// FloatingAlert is a frontend component, not available in shared package
// This utility should be moved to frontend or refactored

export class AlertManager {
  static showInfo(message: string, persistent: boolean = false) {
    // triggerFloatingAlert(message, 'info', persistent);
  }

  static showSuccess(message: string, persistent: boolean = false) {
    // triggerFloatingAlert(message, 'success', persistent);
  }

  static showWarning(message: string, persistent: boolean = false) {
    // triggerFloatingAlert(message, 'warning', persistent);
  }

  static showError(message: string, persistent: boolean = true) {
    // triggerFloatingAlert(message, 'error', persistent);
  }

  // Sports-specific alerts
  static showMatchAlert(match: string, prediction: string) {
    this.showInfo(`New prediction for ${match}: ${prediction}`);
  }

  static showQuizResult(score: number, total: number) {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 80) {
      this.showSuccess(`Excellent! You scored ${score}/${total} (${percentage}%)`);
    } else if (percentage >= 60) {
      this.showInfo(`Good job! You scored ${score}/${total} (${percentage}%)`);
    } else {
      this.showWarning(`Keep practicing! You scored ${score}/${total} (${percentage}%)`);
    }
  }

  static showPiCoinEarned(amount: number, reason: string) {
    this.showSuccess(`Earned ${amount} Pi coins for ${reason}! 💰`);
  }

  static showOfflineMode() {
    this.showWarning('You are now offline. Some features may be limited.', true);
  }

  static showOnlineMode() {
    this.showSuccess('Back online! All features are available.');
  }

  static showAPIError(service: string) {
    this.showError(`${service} is currently unavailable. Using cached data.`);
  }

  static showNewsUpdate(count: number) {
    this.showInfo(`${count} new sports articles available!`);
  }
}

export default AlertManager;