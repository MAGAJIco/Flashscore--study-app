
export function formatMatchTime(date: Date | string): string {
  const matchDate = new Date(date);
  const now = new Date();
  const diffMs = matchDate.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 0) {
    return 'Live or Finished';
  } else if (diffMins < 60) {
    return `${diffMins}m`;
  } else if (diffMins < 1440) {
    return `${Math.floor(diffMins / 60)}h`;
  } else {
    return matchDate.toLocaleDateString();
  }
}

export function isMatchLive(match: { status: string; startTime: Date | string }): boolean {
  return match.status === 'live';
}

export function getMatchStatus(match: { status: string; liveMinute?: number }): string {
  if (match.status === 'live' && match.liveMinute) {
    return `${match.liveMinute}'`;
  }
  return match.status.charAt(0).toUpperCase() + match.status.slice(1);
}
