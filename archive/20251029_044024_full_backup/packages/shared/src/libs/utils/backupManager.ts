
interface BackupData {
  users: any[];
  challenges: any[];
  forumPosts: any[];
  piCoinData: any;
  timestamp: Date;
  version: string;
}

class BackupManager {
  private static readonly BACKUP_KEY = 'sports_central_backup';
  private static readonly VERSION = '1.0.0';

  // Create a complete backup of all user data
  static createBackup(): BackupData {
    const backup: BackupData = {
      users: this.getStorageItem('sports_central_users', []),
      challenges: this.getStorageItem('sports_central_challenges', []),
      forumPosts: this.getStorageItem('sports_central_forum_posts', []),
      piCoinData: {
        balances: this.getStorageItem('pi_coin_data', {}),
        transactions: this.getStorageItem('pi_coin_transactions', [])
      },
      timestamp: new Date(),
      version: this.VERSION
    };

    // Store backup locally as well
    localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
    
    return backup;
  }

  // Restore data from backup
  static restoreBackup(backupData: BackupData): boolean {
    try {
      if (backupData.users) {
        localStorage.setItem('sports_central_users', JSON.stringify(backupData.users));
      }
      
      if (backupData.challenges) {
        localStorage.setItem('sports_central_challenges', JSON.stringify(backupData.challenges));
      }
      
      if (backupData.forumPosts) {
        localStorage.setItem('sports_central_forum_posts', JSON.stringify(backupData.forumPosts));
      }
      
      if (backupData.piCoinData) {
        localStorage.setItem('pi_coin_data', JSON.stringify(backupData.piCoinData.balances));
        localStorage.setItem('pi_coin_transactions', JSON.stringify(backupData.piCoinData.transactions));
      }

      return true;
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return false;
    }
  }

  // Get the latest local backup
  static getLocalBackup(): BackupData | null {
    try {
      const backup = localStorage.getItem(this.BACKUP_KEY);
      return backup ? JSON.parse(backup) : null;
    } catch (error) {
      console.error('Failed to get local backup:', error);
      return null;
    }
  }

  // Export backup as downloadable file
  static exportBackup(): void {
    const backup = this.createBackup();
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `sports_central_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  }

  // Import backup from file
  static importBackup(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const backupData = JSON.parse(event.target?.result as string);
          const success = this.restoreBackup(backupData);
          resolve(success);
        } catch (error) {
          console.error('Failed to import backup:', error);
          reject(false);
        }
      };
      
      reader.onerror = () => reject(false);
      reader.readAsText(file);
    });
  }

  // Sync with Google Cloud Storage (requires setup)
  static async syncToCloud(apiKey?: string): Promise<boolean> {
    try {
      const backup = this.createBackup();
      
      // This is a placeholder for Google Cloud Storage integration
      // In a real implementation, you would:
      // 1. Set up Google Cloud Storage bucket
      // 2. Use the Google Cloud Storage client library
      // 3. Authenticate with service account or API key
      // 4. Upload the backup data
      
      console.log('Cloud sync would upload:', backup);
      
      // For now, we'll simulate a successful sync
      // You would replace this with actual Google Cloud Storage API calls
      
      return new Promise((resolve) => {
        setTimeout(() => {
          localStorage.setItem('last_cloud_sync', new Date().toISOString());
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error('Failed to sync to cloud:', error);
      return false;
    }
  }

  // Check when last sync happened
  static getLastSyncTime(): Date | null {
    const lastSync = localStorage.getItem('last_cloud_sync');
    return lastSync ? new Date(lastSync) : null;
  }

  // Schedule automatic backups
  static scheduleAutoBackup(intervalMinutes: number = 30): void {
    setInterval(() => {
      this.createBackup();
      console.log('Auto backup created at:', new Date().toISOString());
    }, intervalMinutes * 60 * 1000);
  }

  private static getStorageItem(key: string, defaultValue: any): any {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to get ${key} from storage:`, error);
      return defaultValue;
    }
  }
}

export { BackupManager };
export type { BackupData };
