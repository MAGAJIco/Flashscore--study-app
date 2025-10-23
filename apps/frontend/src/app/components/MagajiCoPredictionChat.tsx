
"use client";

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'prediction' | 'analysis' | 'insight' | 'text';
  metadata?: {
    confidence?: number;
    sport?: string;
    match?: string;
    prediction?: string;
  };
}

// Temporary chat AI function until real implementation
const chatAI = async (userInput: string) => {
  const lowerInput = userInput.toLowerCase();
  
  if (lowerInput.includes('predict') || lowerInput.includes('match')) {
    return {
      message: "I analyze sports predictions using advanced strategic intelligence. Share specific match details for personalized insights!",
      type: 'analysis' as const
    };
  }
  
  return {
    message: "I'm here to help with sports predictions and insights. What would you like to know?",
    type: 'text' as const
  };
};

export default function MagajiCoPredictionChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: "👋 Welcome to MagajiCo AI Prediction Engine! I'm powered by strategic intelligence to help you make winning predictions. Ask me about any match, team, or get insights!",
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const simulateStreaming = async (text: string) => {
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      setStreamingText(prev => prev + (i === 0 ? '' : ' ') + words[i]);
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setStreamingText('');

    try {
      const response = await chatAI(input);
      
      await simulateStreaming(response.message);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: streamingText || response.message,
        timestamp: new Date(),
        type: response.type || 'text',
        metadata: undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingText('');
    } catch (error) {
      console.error('Prediction error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble processing that. Please try rephrasing your question.",
        timestamp: new Date(),
        type: 'text'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="magajico-chat-container">
      <div className="chat-header">
        <div className="header-content">
          <div className="avatar-section">
            <div className="ai-avatar">
              🧠
            </div>
            <div>
              <h2 className="chat-title">MagajiCo AI Predictor</h2>
              <p className="chat-status">
                <span className="status-dot"></span>
                Online & Ready
              </p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">87%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">2.2K</span>
              <span className="stat-label">Predictions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message-wrapper ${message.role}`}>
            <div className="message-container">
              {message.role === 'assistant' && (
                <div className="message-avatar">🧠</div>
              )}
              <div className={`message-bubble ${message.type || 'text'}`}>
                <div className="message-content">
                  {message.content}
                </div>
                {message.metadata && (
                  <div className="message-metadata">
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill"
                        style={{ width: `${message.metadata.confidence}%` }}
                      />
                    </div>
                    <span className="confidence-text">
                      {message.metadata.confidence}% confidence
                    </span>
                  </div>
                )}
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="message-avatar user">👤</div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-wrapper assistant">
            <div className="message-container">
              <div className="message-avatar">🧠</div>
              <div className="message-bubble typing">
                <div className="message-content">
                  {streamingText || (
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="quick-actions">
          <button 
            className="quick-btn"
            onClick={() => setInput('Predict today\'s top matches')}
          >
            ⚡ Top Matches
          </button>
          <button 
            className="quick-btn"
            onClick={() => setInput('Show me high confidence predictions')}
          >
            🎯 Best Bets
          </button>
          <button 
            className="quick-btn"
            onClick={() => setInput('Analyze Premier League')}
          >
            ⚽ EPL Analysis
          </button>
        </div>
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about any match, team, or prediction..."
            className="chat-input"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="send-button"
          >
            {isTyping ? '⏳' : '🚀'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .magajico-chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          position: relative;
          overflow: hidden;
        }

        .magajico-chat-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .chat-header {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 20px;
          z-index: 10;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .avatar-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .ai-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
        }

        .chat-title {
          color: white;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .chat-status {
          color: #94a3b8;
          font-size: 14px;
          margin: 4px 0 0 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .header-stats {
          display: flex;
          gap: 24px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          color: white;
          font-size: 18px;
          font-weight: 700;
        }

        .stat-label {
          color: #64748b;
          font-size: 12px;
          margin-top: 2px;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-wrapper {
          display: flex;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-wrapper.user {
          justify-content: flex-end;
        }

        .message-container {
          display: flex;
          gap: 12px;
          max-width: 80%;
          align-items: flex-end;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .message-avatar.user {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .message-bubble {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 12px 16px;
          position: relative;
        }

        .message-wrapper.user .message-bubble {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .message-bubble.prediction {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .message-content {
          color: white;
          font-size: 15px;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .message-metadata {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .confidence-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #22c55e);
          transition: width 0.3s ease;
        }

        .confidence-text {
          color: #10b981;
          font-size: 12px;
          font-weight: 600;
        }

        .message-time {
          color: #64748b;
          font-size: 11px;
          margin-top: 6px;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 4px 0;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #60a5fa;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .chat-input-container {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px 20px;
        }

        .quick-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .quick-actions::-webkit-scrollbar {
          display: none;
        }

        .quick-btn {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .quick-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          transform: translateY(-2px);
        }

        .input-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .chat-input {
          flex: 1;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 14px 20px;
          color: white;
          font-size: 15px;
          outline: none;
          transition: all 0.3s ease;
        }

        .chat-input:focus {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .chat-input::placeholder {
          color: #64748b;
        }

        .send-button {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: none;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-button:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .header-stats {
            display: none;
          }

          .message-container {
            max-width: 90%;
          }

          .quick-actions {
            gap: 6px;
          }

          .quick-btn {
            padding: 6px 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
