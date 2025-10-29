
"use client";

import React, { useState, useEffect } from 'react';

interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
}

export function LiveMatchTracker() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const res = await fetch('/api/matches/live');
        const data = await res.json();
        setMatches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch matches:', err);
      }
    };

    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-match-tracker">
      <h2 className="text-2xl font-bold mb-4">🔴 Live Matches</h2>
      <div className="space-y-4">
        {matches.map(match => (
          <div key={match.id} className="p-4 bg-white/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span>{match.homeTeam}</span>
              <span className="text-2xl font-bold">{match.homeScore} - {match.awayScore}</span>
              <span>{match.awayTeam}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
