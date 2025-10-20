
interface TimeZonePreference {
  timezone: string;
  format24h: boolean;
  showLocalTime: boolean;
}

interface MatchTimeData {
  utcTime: Date;
  localTime: Date;
  timezone: string;
  formattedTime: string;
  isToday: boolean;
  isTomorrow: boolean;
  relativeTime: string;
}

class TimeZoneService {
  private userTimezone: string;
  private preferences: TimeZonePreference;

  constructor() {
    this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): TimeZonePreference {
    if (typeof window === 'undefined') {
      return {
        timezone: this.userTimezone,
        format24h: true,
        showLocalTime: true
      };
    }

    const saved = localStorage.getItem('timezone_preferences');
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      timezone: this.userTimezone,
      format24h: true,
      showLocalTime: true
    };
  }

  savePreferences(preferences: Partial<TimeZonePreference>): void {
    this.preferences = { ...this.preferences, ...preferences };
    localStorage.setItem('timezone_preferences', JSON.stringify(this.preferences));
  }

  convertToUserTime(utcTime: Date | string): MatchTimeData {
    const utcDate = typeof utcTime === 'string' ? new Date(utcTime) : utcTime;
    const localDate = new Date(utcDate.toLocaleString('en-US', { timeZone: this.preferences.timezone }));

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = this.isSameDay(localDate, now);
    const isTomorrow = this.isSameDay(localDate, tomorrow);

    return {
      utcTime: utcDate,
      localTime: localDate,
      timezone: this.preferences.timezone,
      formattedTime: this.formatTime(localDate),
      isToday,
      isTomorrow,
      relativeTime: this.getRelativeTime(localDate)
    };
  }

  private formatTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: !this.preferences.format24h,
      timeZone: this.preferences.timezone
    };

    return date.toLocaleString('en-US', options);
  }

  formatMatchTime(utcTime: Date | string): string {
    const timeData = this.convertToUserTime(utcTime);

    if (timeData.isToday) {
      return `Today at ${timeData.formattedTime}`;
    } else if (timeData.isTomorrow) {
      return `Tomorrow at ${timeData.formattedTime}`;
    } else {
      const dateStr = timeData.localTime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: this.preferences.timezone
      });
      return `${dateStr} at ${timeData.formattedTime}`;
    }
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 0) {
      return 'Started';
    } else if (diffMins < 60) {
      return `In ${diffMins} min`;
    } else if (diffHours < 24) {
      return `In ${diffHours}h`;
    } else {
      return `In ${diffDays}d`;
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  getUserTimezone(): string {
    return this.preferences.timezone;
  }

  getAllTimezones(): string[] {
    return [
      'America/New_York',
      'America/Los_Angeles',
      'America/Chicago',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Dubai',
      'Australia/Sydney',
      'Africa/Lagos',
      'America/Sao_Paulo'
    ];
  }

  scheduleNotification(matchTime: Date, minutesBefore: number = 15): void {
    const notificationTime = new Date(matchTime.getTime() - minutesBefore * 60000);
    const now = new Date();

    if (notificationTime > now) {
      const delay = notificationTime.getTime() - now.getTime();
      setTimeout(() => {
        this.sendNotification(matchTime);
      }, delay);
    }
  }

  private sendNotification(matchTime: Date): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const timeData = this.convertToUserTime(matchTime);
      new Notification('Match Starting Soon!', {
        body: `Match starts at ${timeData.formattedTime} (${timeData.relativeTime})`,
        icon: '/icons/icon-192x192.png',
        tag: 'match-notification'
      });
    }
  }
}

export const timeZoneService = new TimeZoneService();
export default timeZoneService;
