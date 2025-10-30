"use client";

import React, { useState, useRef, useEffect } from "react";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface Game {
  id: string;
  name: string;
  sport: string;
  time: string;
  teams?: string;
}

export default function MagajicoCEO() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hello! I'm your Magajico CEO AI manager. I'll help you build your bet slip. How many games would you like to book today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gamesLibrary, setGamesLibrary] = useState<Game[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = [
        {
          role: "system" as const,
          content: `You are the Magajico CEO AI manager, a friendly betting assistant. Your job is to:
1. Help users build their bet slip by asking how many games they want to book
2. Collect game names one at a time or all at once as the user prefers
3. Keep track of accumulated games
4. Be concise, friendly, and supportive
5. Remind users to gamble responsibly
6. If they mention Liverpool, be extra encouraging if there's good news

Current games in library: ${gamesLibrary.map(g => g.name).join(", ") || "none yet"}

Keep responses short and conversational.`,
        },
        ...messages,
        userMessage,
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: conversationHistory,
        max_completion_tokens: 300,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.choices[0].message.content || "I'm here to help!",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Extract games from conversation (simple pattern matching)
      const gamePatterns = [
        /(?:Man United|Arsenal|Liverpool|Chelsea|City|Barcelona|Real Madrid|Bayern|PSG|Lakers|Warriors|Dolphins|Bills)/gi,
      ];
      
      gamePatterns.forEach((pattern) => {
        const matches = input.match(pattern);
        if (matches) {
          matches.forEach((gameName) => {
            if (!gamesLibrary.some((g) => g.name === gameName)) {
              setGamesLibrary((prev) => [
                ...prev,
                {
                  id: Date.now().toString() + Math.random(),
                  name: gameName,
                  sport: "Football",
                  time: "TBD",
                },
              ]);
            }
          });
        }
      });
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeFromLibrary = (id: string) => {
    setGamesLibrary((prev) => prev.filter((game) => game.id !== id));
  };

  return (
    <div className="magajico-ceo-container">
      {/* Chat Interface */}
      <div className="ceo-chat-panel">
        <div className="ceo-header">
          <div className="ceo-title">
            <span className="ceo-icon">🎯</span>
            <h2>Magajico CEO AI Manager</h2>
          </div>
          <div className="ceo-subtitle">
            Your personal betting assistant - Just you and your AI
          </div>
        </div>

        <div className="ceo-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`ceo-message ${msg.role === "user" ? "user" : "assistant"}`}
            >
              <div className="message-avatar">
                {msg.role === "user" ? "👤" : "🤖"}
              </div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="ceo-message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ceo-input-area">
          <div className="responsible-gaming-notice">
            ⚠️ Remember to gamble responsibly
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me which games you want to bet on..."
              disabled={isLoading}
              className="ceo-input"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="ceo-send-btn"
            >
              {isLoading ? "⏳" : "➤"}
            </button>
          </div>
        </div>
      </div>

      {/* Games Library */}
      <div className="ceo-library-panel">
        <div className="library-header">
          <h3>📚 Your Games Library</h3>
          <button
            className="toggle-library-btn"
            onClick={() => setShowLibrary(!showLibrary)}
          >
            {showLibrary ? "Hide" : "Show"} ({gamesLibrary.length})
          </button>
        </div>

        {showLibrary && (
          <div className="library-content">
            {gamesLibrary.length === 0 ? (
              <div className="empty-library">
                <div className="empty-icon">🎲</div>
                <p>No games in your library yet</p>
                <p className="empty-hint">
                  Chat with the AI to add games to your bet slip
                </p>
              </div>
            ) : (
              <div className="library-games">
                {gamesLibrary.map((game) => (
                  <div key={game.id} className="library-game-card">
                    <div className="game-info">
                      <div className="game-name">{game.name}</div>
                      <div className="game-meta">
                        {game.sport} • {game.time}
                      </div>
                    </div>
                    <div className="game-actions">
                      <button className="bet-now-btn" title="Place bet">
                        🎰 Bet Now
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromLibrary(game.id)}
                        title="Remove from library"
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .magajico-ceo-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          height: calc(100vh - 200px);
          margin: 20px 0;
        }

        .ceo-chat-panel {
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .ceo-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
        }

        .ceo-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .ceo-icon {
          font-size: 2rem;
        }

        .ceo-title h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .ceo-subtitle {
          font-size: 0.9rem;
          opacity: 0.95;
          margin-left: 44px;
        }

        .ceo-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f8f9fa;
        }

        .ceo-message {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          animation: slideIn 0.3s ease;
        }

        .ceo-message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        .ceo-message.user .message-avatar {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .message-content {
          background: white;
          padding: 12px 16px;
          border-radius: 12px;
          max-width: 70%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          line-height: 1.5;
        }

        .ceo-message.user .message-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 4px 0;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #667eea;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
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

        .ceo-input-area {
          padding: 20px;
          background: white;
          border-top: 1px solid #e8eaed;
        }

        .responsible-gaming-notice {
          background: #fff3cd;
          color: #856404;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 12px;
          text-align: center;
        }

        .input-wrapper {
          display: flex;
          gap: 10px;
        }

        .ceo-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e8eaed;
          border-radius: 25px;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .ceo-input:focus {
          border-color: #667eea;
        }

        .ceo-input:disabled {
          background: #f1f3f4;
          cursor: not-allowed;
        }

        .ceo-send-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ceo-send-btn:hover:not(:disabled) {
          transform: scale(1.1);
        }

        .ceo-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ceo-library-panel {
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .library-header {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          color: white;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .library-header h3 {
          margin: 0;
          font-size: 1.3rem;
        }

        .toggle-library-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.4);
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .toggle-library-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .library-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .empty-library {
          text-align: center;
          padding: 40px 20px;
          color: #999;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .empty-library p {
          margin: 8px 0;
        }

        .empty-hint {
          font-size: 0.9rem;
          color: #bbb;
        }

        .library-games {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .library-game-card {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .library-game-card:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .game-info {
          flex: 1;
        }

        .game-name {
          font-weight: 600;
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 4px;
        }

        .game-meta {
          font-size: 0.85rem;
          color: #666;
        }

        .game-actions {
          display: flex;
          gap: 8px;
        }

        .bet-now-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .bet-now-btn:hover {
          transform: scale(1.05);
        }

        .remove-btn {
          background: #ff4444;
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          background: #cc0000;
          transform: scale(1.1);
        }

        @media (max-width: 968px) {
          .magajico-ceo-container {
            grid-template-columns: 1fr;
            height: auto;
          }

          .ceo-chat-panel {
            min-height: 500px;
          }
        }
      `}</style>
    </div>
  );
}
