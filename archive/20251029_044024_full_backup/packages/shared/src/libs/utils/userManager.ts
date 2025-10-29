import { SecurityUtils } from '@shared/utils/securityUtils';
// Assume ClientStorage is available for client-side storage operations, similar to localStorage
// If ClientStorage is not defined, you might need to import or define it.
// For demonstration, let's assume it's a global object or imported from a utility file.
// import ClientStorage from '@shared/utils/clientStorage'; // Example import

// Mock ClientStorage if it's not globally available or imported elsewhere
const ClientStorage = typeof window !== 'undefined' ? window.localStorage : {
  getItem: (key: string) => null,
  setItem: (key: string, value: string) => {},
  removeItem: (key: string) => {},
};


interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: Date;
  lastLogin: Date;
  sessionToken?: string;
  loginAttempts: number;
  lockedUntil?: Date;
  emailVerified: boolean;
  role?: string; // Added role for getUsersByRole
}

// Mock db and generateId for the sake of the example, assuming they are defined elsewhere
// In a real scenario, these would be imported from a database utility.
const db = {
  collection: (name: string) => ({
    findOne: async (query: any) => { /* mock implementation */ return null; },
    find: async (query: any) => ({ toArray: async () => [] }),
    insertOne: async (doc: any) => {},
    updateOne: async (filter: any, update: any) => {},
    deleteOne: async (query: any) => ({ deletedCount: 0 }),
  }),
};

const generateId = () => `id_${Math.random().toString(36).substring(7)}`;


class UserManager {
  private static readonly STORAGE_KEY = 'sports_users';
  private static readonly CURRENT_USER_KEY = 'current_user_id';

  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Load the current user from storage
   */
  static loadCurrentUser(): User | null {
    try {
      const currentUserId = ClientStorage.getItem(this.CURRENT_USER_KEY);
      if (!currentUserId) return null;

      const users = this.getAllUsers();
      return users.find(user => user.id === currentUserId) || null;
    } catch (error) {
      console.error('Error loading current user:', error);
      return null;
    }
  }

  static createUser(username: string, email?: string): User {
    const users = this.getAllUsers();

    // Validate and sanitize input
    const sanitizedUsername = SecurityUtils.sanitizeInput(username);
    const sanitizedEmail = email ? SecurityUtils.sanitizeInput(email) : undefined;

    // Security checks
    const userIP = 'current_user'; // In production, get real IP
    if (SecurityUtils.detectSuspiciousActivity(userIP, 'user_creation')) {
      SecurityUtils.logSecurityEvent('blocked_suspicious_user_creation', {
        username: sanitizedUsername,
        email: sanitizedEmail
      });
      throw new Error('Too many account creation attempts. Please try again later.');
    }

    // Check if username already exists
    if (users.find(u => u.username === sanitizedUsername)) {
      throw new Error('Username already exists');
    }

    // Generate a secure session token
    const sessionToken = SecurityUtils.generateSecureToken();

    const newUser: User = {
      id: this.generateUserId(),
      username: sanitizedUsername,
      email: sanitizedEmail,
      createdAt: new Date(),
      lastLogin: new Date(),
      sessionToken: sessionToken,
      loginAttempts: 0,
      emailVerified: false, // Email not verified by default
    };

    // Store token data for validation
    SecurityUtils.storeTokenData(sessionToken, {
      created: Date.now(),
      userId: newUser.id
    });

    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

    // Set as current user
    this.setCurrentUser(newUser);

    // Create wallet for new user
    this.initializeUserWallet(newUser.id);

    // Log security event
    SecurityUtils.logSecurityEvent('user_created', {
      userId: newUser.id,
      username: sanitizedUsername
    });

    // TODO: Implement email verification process here

    return newUser;
  }

  static setCurrentUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  static loginUser(username: string): User | null {
    const users = this.getAllUsers();
    const sanitizedUsername = SecurityUtils.sanitizeInput(username);
    let user = users.find(u => u.username === sanitizedUsername);

    if (!user) {
      return null; // User not found
    }

    // Check if user account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new Error('Account locked. Please try again later.');
    }

    // Dummy password check (in a real app, use hashed passwords)
    // For now, we assume a successful login if username matches and email is verified
    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in.');
    }

    user.lastLogin = new Date();
    user.loginAttempts = 0; // Reset login attempts on successful login
    user.sessionToken = SecurityUtils.generateSecureToken(); // Generate new token on login

    this.updateUser(user);
    this.setCurrentUser(user);
    return user;
  }

  // Account Recovery System
  static initiateAccountRecovery(username: string, email?: string): { success: boolean; message: string; recoveryCode?: string } {
    const users = this.getAllUsers();
    const sanitizedUsername = SecurityUtils.sanitizeInput(username);
    const user = users.find(u => u.username === sanitizedUsername);

    if (!user) {
      return { success: false, message: 'User not found. Please check your username.' };
    }

    if (email && user.email !== email) {
      return { success: false, message: 'Email does not match our records.' };
    }

    // Generate recovery code
    const recoveryCode = SecurityUtils.generateSecureToken().substring(0, 8).toUpperCase();

    // Store recovery data
    const recoveryData = {
      userId: user.id,
      code: recoveryCode,
      expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      used: false
    };

    const recoveryStorage = localStorage.getItem('account_recovery') || '[]';
    const recoveries = JSON.parse(recoveryStorage);
    recoveries.push(recoveryData);
    localStorage.setItem('account_recovery', JSON.stringify(recoveries));

    SecurityUtils.logSecurityEvent('account_recovery_initiated', {
      userId: user.id,
      username: sanitizedUsername
    });

    return {
      success: true,
      message: `Recovery code generated: ${recoveryCode}. This code expires in 24 hours.`,
      recoveryCode
    };
  }

  static recoverAccount(username: string, recoveryCode: string): { success: boolean; message: string; user?: User } {
    const recoveryStorage = localStorage.getItem('account_recovery') || '[]';
    const recoveries = JSON.parse(recoveryStorage);

    const recovery = recoveries.find((r: any) =>
      r.code === recoveryCode.toUpperCase() &&
      !r.used &&
      r.expires > Date.now()
    );

    if (!recovery) {
      return { success: false, message: 'Invalid or expired recovery code.' };
    }

    const users = this.getAllUsers();
    const user = users.find(u => u.id === recovery.userId && u.username === SecurityUtils.sanitizeInput(username));

    if (!user) {
      return { success: false, message: 'User not found or recovery code mismatch.' };
    }

    // Mark recovery as used
    recovery.used = true;
    localStorage.setItem('account_recovery', JSON.stringify(recoveries));

    // Reset user account
    user.loginAttempts = 0;
    user.lockedUntil = undefined;
    user.sessionToken = SecurityUtils.generateSecureToken();
    user.lastLogin = new Date();

    this.updateUser(user);
    this.setCurrentUser(user);

    SecurityUtils.logSecurityEvent('account_recovered', {
      userId: user.id,
      username: user.username
    });

    return { success: true, message: 'Account successfully recovered!', user };
  }

  // Backup user's Pi coin data
  /**
   * Cleanup old session data
   */
  static cleanup(): void {
    if (typeof window === 'undefined') return;
    
    const users = this.getAllUsers();
    const now = new Date();

    const activeUsers = users.filter(user => {
      if (!user.lastLogin) return false;
      const lastLoginDate = new Date(user.lastLogin);
      return now.getTime() - lastLoginDate.getTime() < (365 * 24 * 60 * 60 * 1000);
    });

    if (activeUsers.length < users.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(activeUsers));
      console.log(`Cleaned up ${users.length - activeUsers.length} inactive users.`);
    }
  }

  /**
   * Get current user ID
   */
  static getCurrentUserId(): string | null {
    try {
      return ClientStorage.getItem(this.CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return null;
    }
  }

  /**
   * Get current user
   */
  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    try {
      const userData = localStorage.getItem(this.CURRENT_USER_KEY);
      if (!userData) {
        return null;
      }
      const user: User = JSON.parse(userData);

      if (user.sessionToken && !SecurityUtils.isTokenValid(user.sessionToken)) {
        this.logoutUser();
        return null;
      }

      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  static backupUserData(userId: string): { success: boolean; backup?: any; message: string } {
    try {
      const user = this.getAllUsers().find(u => u.id === userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Get Pi coin data
      const coinData = localStorage.getItem('pi_coin_data') || '{}';
      const transactionData = localStorage.getItem('pi_coin_transactions') || '[]';

      let userBalance = {};
      let userTransactions = [];

      try {
        const balances = JSON.parse(coinData);
        userBalance = balances[userId] || {};
      } catch (e) {
        console.warn('Could not parse balance data');
      }

      try {
        const transactions = JSON.parse(transactionData);
        userTransactions = transactions.filter((t: any) => t.userId === userId);
      } catch (e) {
        console.warn('Could not parse transaction data');
      }

      const backup = {
        user: user,
        piCoins: userBalance,
        transactions: userTransactions,
        timestamp: new Date(),
        backupId: `backup_${userId}_${Date.now()}`
      };

      // Store backup
      const backupsStorage = localStorage.getItem('user_backups') || '[]';
      const backups = JSON.parse(backupsStorage);
      backups.push(backup);
      // Keep only last 5 backups per user
      const userBackups = backups.filter((b: any) => b.user.id === userId).slice(-5);
      const otherBackups = backups.filter((b: any) => b.user.id !== userId);
      localStorage.setItem('user_backups', JSON.stringify([...otherBackups, ...userBackups]));

      return { success: true, backup, message: 'User data backed up successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to backup user data' };
    }
  }

  // Restore user data from backup
  static restoreUserData(userId: string, backupId?: string): { success: boolean; message: string } {
    try {
      const backupsStorage = localStorage.getItem('user_backups') || '[]';
      const backups = JSON.parse(backupsStorage);

      let backup;
      if (backupId) {
        backup = backups.find((b: any) => b.backupId === backupId);
      } else {
        // Get latest backup for user
        const userBackups = backups.filter((b: any) => b.user.id === userId);
        backup = userBackups[userBackups.length - 1];
      }

      if (!backup) {
        return { success: false, message: 'No backup found for this user' };
      }

      // Restore user
      this.updateUser(backup.user);

      // Restore Pi coin data
      if (backup.piCoins && Object.keys(backup.piCoins).length > 0) {
        const coinData = localStorage.getItem('pi_coin_data') || '{}';
        const balances = JSON.parse(coinData);
        balances[userId] = backup.piCoins;
        localStorage.setItem('pi_coin_data', JSON.stringify(balances));
      }

      // Restore transactions
      if (backup.transactions && backup.transactions.length > 0) {
        const transactionData = localStorage.getItem('pi_coin_transactions') || '[]';
        let transactions = JSON.parse(transactionData);
        // Remove existing user transactions
        transactions = transactions.filter((t: any) => t.userId !== userId);
        // Add backup transactions
        transactions.push(...backup.transactions);
        localStorage.setItem('pi_coin_transactions', JSON.stringify(transactions));
      }

      SecurityUtils.logSecurityEvent('user_data_restored', {
        userId: userId,
        backupId: backup.backupId
      });

      return { success: true, message: 'User data restored successfully!' };
    } catch (error) {
      return { success: false, message: 'Failed to restore user data' };
    }
  }

  static logoutUser(): void {
    if (typeof window === 'undefined') return;

    const currentUser = this.getCurrentUser();
    if (currentUser) {
      // Invalidate session token on logout
      currentUser.sessionToken = undefined;
      this.updateUser(currentUser);
    }
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  static getAllUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static updateUser(user: User): void {
    if (typeof window === 'undefined') return;

    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);

    if (index !== -1) {
      users[index] = user;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    }
  }

  static deleteUser(userId: string): void {
    if (typeof window === 'undefined') return;

    const users = this.getAllUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredUsers));

    // Clear user's wallet data
    this.clearUserWallet(userId);
  }

  private static generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static initializeUserWallet(userId: string): void {
    // Import PiCoinManager dynamically to avoid circular dependency
    import('@shared/utils/piCoinManager').then(({ PiCoinManager }) => {
      // Give welcome bonus
      // PiCoinManager.addTransaction is not available - implement transaction logic directly
      // await PiCoinManager.addTransaction({
      //   userId: userId,
      //   amount: 50,
      //   type: 'bonus',
      //   description: 'Welcome bonus for new user!'
      // });
      // Mock implementation as PiCoinManager is not available in this context
      console.log(`Simulating welcome bonus for user ${userId}`);
    }).catch(error => {
      console.error('Failed to load PiCoinManager:', error);
    });
  }

  private static clearUserWallet(userId: string): void {
    // Clear user's Pi coin data
    const coinData = localStorage.getItem('pi_coin_data');
    const transactionData = localStorage.getItem('pi_coin_transactions');

    if (coinData) {
      const balances = JSON.parse(coinData);
      delete balances[userId];
      localStorage.setItem('pi_coin_data', JSON.stringify(balances));
    }

    if (transactionData) {
      const transactions = JSON.parse(transactionData);
      const filteredTransactions = transactions.filter((t: any) => t.userId !== userId);
      localStorage.setItem('pi_coin_transactions', JSON.stringify(filteredTransactions));
    }
  }
}

// Export class and instance
export { UserManager };
export const userManager = new UserManager();