
interface TimeZonePreference {
  userId: string;
  timezone: string;
  autoDetect: boolean;
}

interface LocalizedTime {
  original: Date;
  localized: Date;
  timezone: string;
  formatted: string;
  relativeTime: string;
}

export class TimeZoneService {
  private static instance: TimeZoneService;
  private userTimezone: string;
  private preferences: Map<string, TimeZonePreference> = new Map();

  private constructor() {
    this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  static getInstance(): TimeZoneService {
    if (!TimeZoneService.instance) {
      TimeZoneService.instance = new TimeZoneService();
    }
    return TimeZoneService.instance;
  }

  detectUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  setUserTimezone(timezone: string): void {
    this.userTimezone = timezone;
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_timezone', timezone);
    }
  }

  getUserTimezone(): string {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_timezone');
      if (stored) return stored;
    }
    return this.userTimezone;
  }

  convertToUserTimezone(date: Date | string): LocalizedTime {
    const originalDate = typeof date === 'string' ? new Date(date) : date;
    const timezone = this.getUserTimezone();

    const localized = new Date(originalDate.toLocaleString('en-US', { timeZone: timezone }));
    
    return {
      original: originalDate,
      localized,
      timezone,
      formatted: this.formatDateTime(localized, timezone),
      relativeTime: this.getRelativeTime(localized)
    };
  }

  formatDateTime(date: Date, timezone?: string): string {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone || this.userTimezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 0) {
      if (Math.abs(diffMins) < 60) return `${Math.abs(diffMins)} mins ago`;
      if (Math.abs(diffHours) < 24) return `${Math.abs(diffHours)} hours ago`;
      return `${Math.abs(diffDays)} days ago`;
    }

    if (diffMins < 60) return `in ${diffMins} mins`;
    if (diffHours < 24) return `in ${diffHours} hours`;
    return `in ${diffDays} days`;
  }

  getMatchCountdown(matchTime: Date | string): string {
    const localTime = this.convertToUserTimezone(matchTime);
    const now = new Date();
    const diff = localTime.localized.getTime() - now.getTime();

    if (diff < 0) return 'Match started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  shouldNotifyUser(matchTime: Date | string, notifyMinutesBefore: number = 30): boolean {
    const localTime = this.convertToUserTimezone(matchTime);
    const now = new Date();
    const diffMins = Math.floor((localTime.localized.getTime() - now.getTime()) / 60000);

    return diffMins <= notifyMinutesBefore && diffMins > 0;
  }

  getTimezoneOffset(timezone?: string): number {
    const tz = timezone || this.userTimezone;
    const date = new Date();
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
    return (tzDate.getTime() - utcDate.getTime()) / 3600000;
  }
}

export const timeZoneService = TimeZoneService.getInstance();
