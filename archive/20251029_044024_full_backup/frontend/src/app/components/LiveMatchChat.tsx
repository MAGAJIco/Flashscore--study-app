"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ClientStorage } from '@utils/clientStorage';
import { UserManager } from '@magajico/shared/utils';
import { translationService } from '@services/translationService';
import { timeZoneService } from '@services/timeZoneService';

interface User {
  id: string;
  username: string;
  email?: string;
  createdAt?: Date;
  lastLogin?: Date;
  sessionToken?: string;
  loginAttempts?: number;
  lockedUntil?: Date;
  emailVerified?: boolean;
  role?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'system' | 'expert';
  reactions?: { [emoji: string]: string[] }; // emoji -> userIds
}

interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  time: string;
}

interface LiveMatchChatProps {
  match: LiveMatch;
  currentUser: User | null;
}

const LiveMatchChat: React.FC<LiveMatchChatProps> = ({ match, currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState('');
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [userLanguage, setUserLanguage] = useState('en');
  const [translatedMessages, setTranslatedMessages] = useState<{[key: string]: string}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['⚽', '🔥', '👏', '😱', '💪', '⭐', '🎯', '❤️'];
  const expertComments = [
    "Great defensive play there!",
    "That was a tactical masterclass",
    "The momentum is shifting",
    "Key substitution at the right time",
    "Clinical finishing on display",
    "Brilliant save by the keeper!"
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadChatHistory();
    simulateConnection();

    // Simulate expert commentary
    const expertInterval = setInterval(addExpertCommentary, 30000); // Every 30 seconds

    // Simulate user activity updates
    const activityInterval = setInterval(updateActiveUsers, 10000); // Every 10 seconds

    return () => {
      clearInterval(expertInterval);
      clearInterval(activityInterval);
    };
  }, [match.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = () => {
    const chatKey = `match_chat_${match.id}`;
    const savedMessages = ClientStorage.getItem(chatKey, []);
    setMessages(savedMessages);
  };

  const saveChatHistory = (updatedMessages: ChatMessage[]) => {
    const chatKey = `match_chat_${match.id}`;
    ClientStorage.setItem(chatKey, updatedMessages);
  };

  const simulateConnection = () => {
    setTimeout(() => {
      setIsConnected(true);
      addSystemMessage("Connected to live match chat");
      updateActiveUsers();
    }, 1000);
  };

  const updateActiveUsers = () => {
    // Simulate active user count
    const baseUsers = 50;
    const variation = Math.floor(Math.random() * 30);
    setActiveUsers(baseUsers + variation);
  };

  const addSystemMessage = (content: string) => {
    const systemMessage: ChatMessage = {
      id: `system_${Date.now()}`,
      userId: 'system',
      username: 'System',
      message: content,
      timestamp: new Date(),
      type: 'system'
    };

    setMessages(prev => {
      const updated = [...prev, systemMessage];
      saveChatHistory(updated);
      return updated;
    });
  };

  const addExpertCommentary = () => {
    if (!isConnected) return;

    const comment = expertComments[Math.floor(Math.random() * expertComments.length)];
    const expertMessage: ChatMessage = {
      id: `expert_${Date.now()}`,
      userId: 'expert_analyst',
      username: 'Sports Analyst',
      message: comment,
      timestamp: new Date(),
      type: 'expert'
    };

    setMessages(prev => {
      const updated = [...prev, expertMessage];
      saveChatHistory(updated);
      return updated;
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !currentUser || !isConnected) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      username: currentUser.username,
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'user',
      reactions: {}
    };

    setMessages(prev => {
      const updated = [...prev, userMessage];
      saveChatHistory(updated);
      return updated;
    });

    setNewMessage('');

    // Auto-scroll on send
    setTimeout(scrollToBottom, 100);
  };

  const addReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;

    setMessages(prev => {
      const updated = prev.map(message => {
        if (message.id === messageId) {
          const reactions = message.reactions ? { ...message.reactions } : {};
          if (!reactions[emoji]) reactions[emoji] = [];

          if (reactions[emoji].includes(currentUser.id)) {
            reactions[emoji] = reactions[emoji].filter(id => id !== currentUser.id);
          } else {
            reactions[emoji].push(currentUser.id);
          }

          return { ...message, reactions };
        }
        return message;
      });
      saveChatHistory(updated);
      return updated;
    });

    setShowEmojiPicker('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'system':
        return {
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#93c5fd'
        };
      case 'expert':
        return {
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#fbbf24'
        };
      default:
        return {
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff'
        };
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: isMobile ? '16px' : '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      height: isMobile ? '400px' : '500px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? '16px' : '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <h3 style={{
            color: '#fff',
            margin: 0,
            fontSize: isMobile ? '1rem' : '1.2rem',
            fontWeight: '600'
          }}>
            🔴 Live Chat
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: isConnected ? '#22c55e' : '#ef4444',
            fontSize: '0.8rem'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isConnected ? '#22c55e' : '#ef4444',
              animation: isConnected ? 'pulse 2s infinite' : 'none'
            }} />
            {isConnected ? 'Connected' : 'Connecting...'}
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            color: '#d1fae5'
          }}>
            {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
          </div>
          <button
            onClick={() => setAutoTranslate(!autoTranslate)}
            style={{
              background: autoTranslate ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.7rem',
              cursor: 'pointer'
            }}
          >
            🌐 {autoTranslate ? 'ON' : 'OFF'}
          </button>
        </div>

        <div style={{
          fontSize: '0.7rem',
          color: '#9ca3af',
          marginTop: '4px'
        }}>
          👥 {activeUsers} viewers • {match.time} • {match.status}
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '12px' : '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              ...getMessageStyle(message.type),
              padding: '12px',
              borderRadius: '12px',
              position: 'relative'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '4px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  fontWeight: '600',
                  fontSize: '0.8rem'
                }}>
                  {message.type === 'expert' ? '⭐ ' : ''}
                  {message.username}
                </span>
                {message.type === 'expert' && (
                  <span style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontSize: '0.6rem',
                    fontWeight: '600'
                  }}>
                    EXPERT
                  </span>
                )}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#9ca3af'
                }}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>

                {message.type === 'user' && currentUser && (
                  <button
                    onClick={() => setShowEmojiPicker(
                      showEmojiPicker === message.id ? '' : message.id
                    )}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    😊
                  </button>
                )}
              </div>
            </div>

            <div style={{
              fontSize: '0.9rem',
              lineHeight: '1.4',
              marginBottom: message.reactions ? '8px' : '0'
            }}>
              {message.message}
            </div>

            {/* Reactions */}
            {message.reactions && Object.keys(message.reactions).length > 0 && (
              <div style={{
                display: 'flex',
                gap: '4px',
                flexWrap: 'wrap'
              }}>
                {Object.entries(message.reactions)
                  .filter(([, userIds]) => userIds.length > 0)
                  .map(([emoji, userIds]) => (
                    <button
                      key={emoji}
                      onClick={() => addReaction(message.id, emoji)}
                      style={{
                        background: userIds.includes(currentUser?.id || '') 
                          ? 'rgba(34, 197, 94, 0.3)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '2px 6px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        color: '#fff'
                      }}
                    >
                      {emoji} {userIds.length}
                    </button>
                  ))}
              </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker === message.id && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                gap: '4px',
                zIndex: 100
              }}>
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(message.id, emoji)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: isMobile ? '12px' : '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        {currentUser ? (
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <input
              ref={chatInputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
              disabled={!isConnected}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '8px 16px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !isConnected}
              style={{
                background: isConnected && newMessage.trim() 
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                color: '#fff',
                cursor: isConnected && newMessage.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}
            >
              📤
            </button>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '0.9rem',
            padding: '8px'
          }}>
            Please log in to participate in chat
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export { LiveMatchChat };