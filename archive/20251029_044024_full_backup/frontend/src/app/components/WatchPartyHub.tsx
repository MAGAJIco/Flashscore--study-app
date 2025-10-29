
"use client";

import React, { useState, useEffect } from 'react';
import { useMobile } from '@hooks/useMobile';

interface WatchParty {
  id: string;
  matchId: string;
  hostId: string;
  participants: string[];
  reactions: { userId: string; emoji: string; timestamp: number }[];
  isLive: boolean;
}

export default function WatchPartyHub() {
  const isMobile = useMobile();
  const [parties, setParties] = useState<WatchParty[]>([]);
  const [selectedParty, setSelectedParty] = useState<WatchParty | null>(null);

  const createParty = async (matchId: string) => {
    // Implementation for creating watch party
    const newParty: WatchParty = {
      id: `party-${Date.now()}`,
      matchId,
      hostId: 'current-user',
      participants: [],
      reactions: [],
      isLive: true
    };
    setParties([...parties, newParty]);
  };

  const sendReaction = (emoji: string) => {
    if (!selectedParty) return;
    
    const reaction = {
      userId: 'current-user',
      emoji,
      timestamp: Date.now()
    };
    
    // Add to party reactions
    setSelectedParty({
      ...selectedParty,
      reactions: [...selectedParty.reactions, reaction]
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '24px',
        backdropFilter: 'blur(20px)'
      }}>
        <h1 style={{
          fontSize: isMobile ? '24px' : '32px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #10b981, #22c55e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '24px'
        }}>
          🎉 Watch Parties
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {parties.map(party => (
            <div
              key={party.id}
              onClick={() => setSelectedParty(party)}
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#10b981' }}>
                  {party.isLive && '🔴'} {party.participants.length} watching
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedParty && (
          <div style={{
            marginTop: '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#fff', marginBottom: '16px' }}>Quick Reactions</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['⚽', '🔥', '👏', '😮', '💯', '🎯'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji)}
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    fontSize: '24px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4 style={{ color: '#aaa', fontSize: '12px', marginBottom: '12px' }}>
                Recent Reactions
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedParty.reactions.slice(-10).map((reaction, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '20px',
                      animation: 'bounce 0.5s ease-out'
                    }}
                  >
                    {reaction.emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
