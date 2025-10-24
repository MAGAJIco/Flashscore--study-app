"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '../utils/clientStorage';

interface StreamSession {
  id: string;
  streamerId: string;
  streamerName: string;
  title: string;
  sport: string;
  viewers: number;
  isLive: boolean;
  startedAt: Date;
  predictions: StreamPrediction[];
  donations: number;
}

interface StreamPrediction {
  id: string;
  match: string;
  prediction: string;
  confidence: number;
  odds: number;
  reasoning: string;
  timestamp: Date;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isPrediction?: boolean;
}

const SocialPredictionStreams: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeStream, setActiveStream] = useState<StreamSession | null>(null);
  const [viewers, setViewers] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [tipAmount, setTipAmount] = useState(10);
  const [streamTitle, setStreamTitle] = useState('');
  const [selectedSport, setSelectedSport] = useState('soccer');

  useEffect(() => {
    // Simulate viewer count fluctuation
    if (isStreaming) {
      const interval = setInterval(() => {
        setViewers(prev => Math.max(1, prev + Math.floor(Math.random() * 5) - 2));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  const startStream = () => {
    const session: StreamSession = {
      id: Date.now().toString(),
      streamerId: 'user_' + Math.random().toString(36).substr(2, 9),
      streamerName: ClientStorage.getItem('username', 'PredictionPro'),
      title: streamTitle || 'Live Prediction Analysis',
      sport: selectedSport,
      viewers: Math.floor(Math.random() * 50) + 10,
      isLive: true,
      startedAt: new Date(),
      predictions: [],
      donations: 0
    };

    setActiveStream(session);
    setIsStreaming(true);
    setViewers(session.viewers);

    // Add welcome message
    addChatMessage({
      id: Date.now().toString(),
      username: 'System',
      message: '🎙️ Stream started! Welcome everyone!',
      timestamp: new Date()
    });

    ClientStorage.setItem('active_stream', session);
  };

  const endStream = () => {
    if (activeStream) {
      const streamData = {
        ...activeStream,
        isLive: false,
        endedAt: new Date()
      };

      // Save stream history
      const history = ClientStorage.getItem('stream_history', []);
      history.unshift(streamData);
      ClientStorage.setItem('stream_history', history.slice(0, 10));

      addChatMessage({
        id: Date.now().toString(),
        username: 'System',
        message: `📺 Stream ended. ${activeStream.predictions.length} predictions made, π${activeStream.donations} in tips received!`,
        timestamp: new Date()
      });
    }

    setIsStreaming(false);
    setTimeout(() => {
      setActiveStream(null);
      setChatMessages([]);
    }, 3000);
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message].slice(-50)); // Keep last 50 messages
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeStream) return;

    addChatMessage({
      id: Date.now().toString(),
      username: ClientStorage.getItem('username', 'Anonymous'),
      message: newMessage,
      timestamp: new Date()
    });

    setNewMessage('');
  };

  const makeLivePrediction = (match: string, prediction: string, confidence: number) => {
    if (!activeStream) return;

    const newPrediction: StreamPrediction = {
      id: Date.now().toString(),
      match,
      prediction,
      confidence,
      odds: (Math.random() * 2 + 1.5).toFixed(2) as any,
      reasoning: 'Live analysis based on current form and statistics',
      timestamp: new Date()
    };

    setActiveStream({
      ...activeStream,
      predictions: [...activeStream.predictions, newPrediction]
    });

    addChatMessage({
      id: Date.now().toString(),
      username: activeStream.streamerName,
      message: `🎯 NEW PREDICTION: ${match} - ${prediction} (${confidence}% confidence)`,
      timestamp: new Date(),
      isPrediction: true
    });
  };

  const sendTip = () => {
    if (!activeStream || tipAmount <= 0) return;

    setActiveStream({
      ...activeStream,
      donations: activeStream.donations + tipAmount
    });

    addChatMessage({
      id: Date.now().toString(),
      username: ClientStorage.getItem('username', 'Anonymous'),
      message: `💰 Sent π${tipAmount} tip!`,
      timestamp: new Date()
    });

    // Deduct from user balance
    const currentBalance = ClientStorage.getItem('pi_coins_balance', 1000);
    ClientStorage.setItem('pi_coins_balance', currentBalance - tipAmount);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(168, 85, 247, 0.1))',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      margin: '20px 0'
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '2rem',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #ef4444, #a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🎥 Social Prediction Streams
      </h2>

      {!isStreaming ? (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#ef4444', marginBottom: '16px' }}>
            Start Your Live Stream
          </h3>
          <input
            type="text"
            placeholder="Stream title (e.g., 'Champions League Analysis')"
            value={streamTitle}
            onChange={(e) => setStreamTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1rem'
            }}
          />
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1rem'
            }}
          >
            <option value="soccer">⚽ Soccer</option>
            <option value="basketball">🏀 Basketball</option>
            <option value="tennis">🎾 Tennis</option>
            <option value="baseball">⚾ Baseball</option>
          </select>
          <button
            onClick={startStream}
            disabled={!streamTitle}
            style={{
              background: streamTitle ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: streamTitle ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0 auto'
            }}
          >
            🔴 Go Live
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Main Stream Area */}
          <div>
            {/* Stream Header */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#ef4444',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                animation: 'pulse 2s infinite'
              }}>
                🔴 LIVE
              </div>
              <h3 style={{ color: '#fff', marginBottom: '8px' }}>{activeStream?.title}</h3>
              <div style={{ display: 'flex', gap: '16px', color: '#9ca3af', fontSize: '0.9rem' }}>
                <span>👥 {viewers} viewers</span>
                <span>🎯 {activeStream?.predictions.length} predictions</span>
                <span>💰 π{activeStream?.donations} earned</span>
              </div>
            </div>

            {/* Stream Video Placeholder */}
            <div style={{
              background: 'linear-gradient(135deg, #1f2937, #111827)',
              borderRadius: '16px',
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📹</div>
              <div style={{ color: '#9ca3af', fontSize: '1.2rem', marginBottom: '24px' }}>
                You are now streaming live!
              </div>

              {/* Quick Prediction Panel */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                padding: '16px',
                borderRadius: '12px',
                width: '90%'
              }}>
                <h4 style={{ color: '#ef4444', marginBottom: '12px' }}>Quick Prediction</h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <button
                    onClick={() => makeLivePrediction('Live Match', 'Home Win', 75)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    🏠 Home Win
                  </button>
                  <button
                    onClick={() => makeLivePrediction('Live Match', 'Draw', 60)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    🤝 Draw
                  </button>
                  <button
                    onClick={() => makeLivePrediction('Live Match', 'Away Win', 70)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    ✈️ Away Win
                  </button>
                </div>
              </div>
            </div>

            {/* Stream Controls */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={endStream}
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🛑 End Stream
              </button>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                📊 View Analytics
              </button>
            </div>
          </div>

          {/* Chat & Tips Sidebar */}
          <div>
            {/* Chat */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
              height: '400px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h4 style={{ color: '#fff', marginBottom: '12px' }}>💬 Live Chat</h4>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {chatMessages.map(msg => (
                  <div key={msg.id} style={{
                    background: msg.isPrediction ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    padding: '8px',
                    borderRadius: '8px',
                    border: msg.isPrediction ? '1px solid rgba(34, 197, 94, 0.3)' : 'none'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: '0.85rem' }}>
                      {msg.username}
                    </div>
                    <div style={{ color: '#d1d5db', fontSize: '0.85rem' }}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Send
                </button>
              </div>
            </div>

            {/* Tips */}
            <div style={{
              background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <h4 style={{ color: '#ffd700', marginBottom: '12px' }}>💰 Send Tip</h4>
              <input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(Number(e.target.value))}
                min="1"
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />
              <button
                onClick={sendTip}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ffd700, #f59e0b)',
                  color: '#000',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🎁 Send π{tipAmount} Tip
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export { SocialPredictionStreams };