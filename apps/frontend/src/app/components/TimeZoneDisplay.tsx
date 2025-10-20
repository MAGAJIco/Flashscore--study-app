
"use client";
import React, { useState, useEffect } from 'react';
import { timeZoneService } from '@/../../packages/shared/src/libs/services/timeZoneService';

interface TimeZoneDisplayProps {
  matchTime: Date | string;
  showCountdown?: boolean;
  showRelative?: boolean;
}

export default function TimeZoneDisplay({ 
  matchTime, 
  showCountdown = true,
  showRelative = true 
}: TimeZoneDisplayProps) {
  const [localTime, setLocalTime] = useState(timeZoneService.convertToUserTimezone(matchTime));
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime(timeZoneService.convertToUserTimezone(matchTime));
      if (showCountdown) {
        setCountdown(timeZoneService.getMatchCountdown(matchTime));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [matchTime, showCountdown]);

  return (
    <div className="flex flex-col gap-1 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-slate-400">🕐</span>
        <span className="font-medium text-white">{localTime.formatted}</span>
      </div>
      
      {showRelative && (
        <div className="text-xs text-slate-400">
          {localTime.relativeTime}
        </div>
      )}
      
      {showCountdown && countdown && (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-green-400">⏱</span>
          <span className="text-green-400 font-semibold">{countdown}</span>
        </div>
      )}
    </div>
  );
}
