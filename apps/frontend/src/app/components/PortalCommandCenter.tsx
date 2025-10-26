
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Zap, TrendingUp, Newspaper, Trophy, Users, Settings } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: string;
  action: () => void;
  shortcut?: string;
}

export function PortalCommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [recentActions, setRecentActions] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands: Command[] = [
    {
      id: 'new-prediction',
      label: 'Make a New Prediction',
      icon: <Zap className="w-4 h-4" />,
      category: 'Actions',
      action: () => console.log('Navigate to predictions'),
      shortcut: 'Ctrl+P'
    },
    {
      id: 'view-live',
      label: 'View Live Matches',
      icon: <TrendingUp className="w-4 h-4" />,
      category: 'Navigation',
      action: () => console.log('Navigate to live'),
      shortcut: 'Ctrl+L'
    },
    {
      id: 'read-news',
      label: 'Latest News',
      icon: <Newspaper className="w-4 h-4" />,
      category: 'Navigation',
      action: () => console.log('Navigate to news')
    },
    {
      id: 'achievements',
      label: 'View Achievements',
      icon: <Trophy className="w-4 h-4" />,
      category: 'Profile',
      action: () => console.log('Navigate to achievements')
    },
    {
      id: 'social-feed',
      label: 'Social Feed',
      icon: <Users className="w-4 h-4" />,
      category: 'Navigation',
      action: () => console.log('Navigate to social')
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      category: 'System',
      action: () => console.log('Navigate to settings')
    }
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const executeCommand = (command: Command) => {
    command.action();
    setRecentActions(prev => [command.id, ...prev.slice(0, 4)]);
    setIsOpen(false);
    setSearch('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Command Center (Ctrl+K)"
      >
        ⚡
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '100px 20px'
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '600px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
      >
        {/* Search Input */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Search className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
          <input
            type="text"
            placeholder="Search commands... (try 'prediction', 'news', 'live')"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'white',
              fontSize: '1.1rem'
            }}
          />
          <kbd style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {search === '' && recentActions.length > 0 && (
            <div style={{ padding: '12px 20px' }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                Recent
              </div>
            </div>
          )}

          {Object.entries(
            filteredCommands.reduce((acc, cmd) => {
              if (!acc[cmd.category]) acc[cmd.category] = [];
              acc[cmd.category].push(cmd);
              return acc;
            }, {} as Record<string, Command[]>)
          ).map(([category, cmds]) => (
            <div key={category}>
              <div style={{
                padding: '12px 20px',
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase'
              }}>
                {category}
              </div>
              {cmds.map(cmd => (
                <button
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6366f1'
                  }}>
                    {cmd.icon}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    {cmd.label}
                  </div>
                  {cmd.shortcut && (
                    <kbd style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.5)'
            }}>
              No commands found for "{search}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          <div>⚡ Quick Actions</div>
          <div>Navigate with ↑↓ • Select with ⏎</div>
        </div>
      </div>
    </div>
  );
}
