"use client";
import React, { useEffect, useState, useRef } from "react";
import FloatingAlert, { triggerFloatingAlert } from "@components/FloatingAlert";
import {
  magajicoCEO,
  Prediction,
  CEOAction,
  getStrategicInsights,
} from "./ai/magajicoCEO";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: "text" | "prediction" | "action";
  originalText?: string;
  originalLang?: string;
  translated?: boolean;
}

interface MagajiCoManagerProps {
  isOpen?: boolean;
  onToggle?: () => void;
  embedded?: boolean; // New prop for embedded mode
}

export default function MagajiCoManager({
  isOpen = false,
  onToggle,
  embedded = false,
}: MagajiCoManagerProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isMinimized, setIsMinimized] = useState(!isOpen);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "🧠 MagajiCo AI CEO activated. Ready to provide strategic insights and predictions.",
      isUser: false,
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [mlServiceReady, setMlServiceReady] = useState(false);
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const [userLanguage, setUserLanguage] = useState("en");

  useEffect(() => {
    // Fix hydration issue by setting time on client only
    const updateTime = () => {
      if (typeof window !== 'undefined') {
        setCurrentTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check ML service status
    checkMLService();
  }, []);

  const checkMLService = async () => {
    try {
      const response = await fetch('/api/ml/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setMlServiceReady(true);
      }
    } catch (error) {
      console.log('ML service not available');
    }
  };

  // Fetch predictions from backend
  const fetchPredictions = async () => {
    try {
      const res = await fetch("/api/backend/predictions");
      const data = await res.json();
      setPredictions(data.data || []);
    } catch (err) {
      triggerFloatingAlert("❌ Failed to fetch predictions", "danger");
    }
  };

  // Autonomous CEO thinking
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPredictions();
    }, 10000); // every 10s
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // CEO reviews predictions whenever they update with strategic intelligence
  useEffect(() => {
    if (predictions.length > 0) {
      const decisions: CEOAction[] = magajicoCEO(predictions);
      const insights = getStrategicInsights(predictions);

      // Add prediction insights to chat
      const insightMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `📊 New Analysis Complete: Found ${insights.totalOpportunities} market opportunities with ${insights.innovationIndex}% innovation potential.`,
        isUser: false,
        timestamp: new Date(),
        type: "prediction",
      };
      setChatMessages((prev) => [...prev, insightMessage]);

      decisions.forEach((action) => {
        if (action.type === "ALERT") {
          triggerFloatingAlert(action.message, action.level);
        }
        if (action.type === "HIGHLIGHT") {
          window.dispatchEvent(
            new CustomEvent("highlightMatch", { detail: action.match }),
          );
        }
        if (action.type === "STRATEGIC_MOVE") {
          const actionMessage: ChatMessage = {
            id: Date.now().toString() + "_action",
            text: `🧠 Strategic Decision: ${action.action} - ${action.reasoning}`,
            isUser: false,
            timestamp: new Date(),
            type: "action",
          };
          setChatMessages((prev) => [...prev, actionMessage]);
        }
        if (action.type === "MARKET_OPPORTUNITY") {
          const opportunityMessage: ChatMessage = {
            id: Date.now().toString() + "_opportunity",
            text: `💎 Market Opportunity: ${action.prediction.match} - ${action.potential}% potential`,
            isUser: false,
            timestamp: new Date(),
            type: "action",
          };
          setChatMessages((prev) => [...prev, opportunityMessage]);
        }
      });
    }
  }, [predictions]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("prediction") ||
      lowerMessage.includes("forecast")
    ) {
      return `🔮 Based on my analysis of ${predictions.length} current predictions, I recommend focusing on high-confidence matches with strategic value. Would you like me to run a detailed prediction analysis?`;
    }

    if (lowerMessage.includes("strategy") || lowerMessage.includes("plan")) {
      return `📈 My strategic recommendation: Apply the MagajiCo 5(1) Filter for optimal decision making. Focus on opportunities with 80%+ confidence and strong market alignment.`;
    }

    if (lowerMessage.includes("risk") || lowerMessage.includes("danger")) {
      return `⚠️ Risk assessment active. I monitor all predictions through multiple filters including confidence checks, market value, and execution feasibility. Current risk level: Moderate.`;
    }

    if (
      lowerMessage.includes("market") ||
      lowerMessage.includes("opportunity")
    ) {
      const insights =
        predictions.length > 0 ? getStrategicInsights(predictions) : null;
      return `💼 Market Analysis: ${insights?.totalOpportunities || 0} opportunities detected. Meta Intelligence at ${insights?.metaIntelligence || 0}%. Ready to execute strategic moves.`;
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("what")) {
      return `🤖 I'm your AI CEO assistant. I can help with:\n• Strategic predictions analysis\n• Market opportunity identification\n• Risk assessment\n• Business intelligence\n• Real-time sports predictions\n\nWhat would you like to explore?`;
    }

    return `🧠 I understand your query about "${userMessage}". As your AI CEO, I'm analyzing this through strategic business intelligence. Could you rephrase or provide more context about what you'd like me to analyze?`;
  };

  const makeMLPrediction = async (features: number[]) => {
    try {
      const response = await fetch('/api/ml/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('ML prediction error:', error);
    }
    return null;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
      type: "text"
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Check if user is requesting a prediction
      const isPredictionRequest = inputMessage.toLowerCase().includes('predict') ||
                                 inputMessage.toLowerCase().includes('match') ||
                                 inputMessage.toLowerCase().includes('game');

      let response;

      if (isPredictionRequest && mlServiceReady) {
        // Use ML service for predictions
        const mockFeatures = [0.75, 0.65, 0.6, 0.8, 0.7, 0.55, 0.9]; // Example features
        const mlResult = await makeMLPrediction(mockFeatures);

        if (mlResult) {
          response = {
            message: `🤖 ML Prediction: ${mlResult.prediction.toUpperCase()} win (${(mlResult.confidence * 100).toFixed(1)}% confidence)\n\nProbabilities:\n• Home: ${(mlResult.probabilities.home * 100).toFixed(1)}%\n• Draw: ${(mlResult.probabilities.draw * 100).toFixed(1)}%\n• Away: ${(mlResult.probabilities.away * 100).toFixed(1)}%`,
            type: 'prediction',
            prediction: {
              match: 'Example Match',
              confidence: (mlResult.confidence * 100).toFixed(1)
            }
          };
        } else {
          response = {
            message: generateAIResponse(inputMessage),
            type: 'text'
          };
        }
      } else {
        // Use regular CEO response
        response = {
          message: generateAIResponse(inputMessage),
          type: 'text'
        };
      }

      if (response) {
        const ceoMessage: ChatMessage = {
          id: Math.random().toString(36).substr(2, 9),
          text: response.message,
          isUser: false,
          timestamp: new Date(),
          type: response.type === 'prediction' ? 'prediction' : 'text'
        };

        setChatMessages((prev) => [...prev, ceoMessage]);

        // Show floating alert for important predictions
        if (response.type === 'prediction') {
          triggerFloatingAlert({
            type: 'prediction',
            title: 'New Prediction Available',
            message: `${response.prediction?.match}`,
            confidence: parseFloat(response.prediction?.confidence || '0'),
            category: 'AI Analysis',
            duration: 5000
          });
        }
      }
    } catch (err: any) {
      console.error('Error getting CEO response:', err);
      const errorMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        text: "🤖 I'm experiencing technical difficulties. Please try again.",
        isUser: false,
        timestamp: new Date(),
        type: "text"
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const strategicInsights =
    predictions.length > 0 ? getStrategicInsights(predictions) : null;

  // Embedded mode - simplified layout
  if (embedded) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-xl border border-slate-700 flex flex-col max-h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              🧠
            </div>
            <div>
              <h2 className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI CEO Assistant
              </h2>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/20 max-h-[400px]">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  message.isUser
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : message.type === "prediction"
                      ? "bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30"
                      : message.type === "action"
                        ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30"
                        : "bg-slate-700 text-slate-100"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.text}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-700 p-3 rounded-2xl">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask AI CEO..."
              className="flex-1 bg-slate-700 text-white placeholder-slate-400 px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standalone mode - full layout
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isMinimized ? "🧠" : "✕"}
      </button>

      {/* Chat Interface Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl border-l border-slate-700 transform transition-transform duration-300 z-40 flex flex-col ${
          isMinimized ? "translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              🧠
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MagajiCo AI CEO
              </h2>
              <p className="text-xs text-slate-400">Strategic Intelligence</p>
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Strategic Stats Bar */}
        {strategicInsights && (
          <div className="p-3 bg-slate-800/30 border-b border-slate-700">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-bold text-blue-400">
                  {strategicInsights.totalOpportunities}
                </div>
                <div className="text-slate-400">Opportunities</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-400">
                  {strategicInsights.metaIntelligence}%
                </div>
                <div className="text-slate-400">Meta Intel</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-400">
                  {predictions.length}
                </div>
                <div className="text-slate-400">Predictions</div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/20">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isUser
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : message.type === "prediction"
                      ? "bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30"
                      : message.type === "action"
                        ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30"
                        : "bg-slate-700 text-slate-100"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {message.text}
                </div>
                <div
                  className={`text-xs mt-1 ${message.isUser ? "text-blue-100" : "text-slate-400"}`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-700 p-3 rounded-2xl">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Action Buttons */}
        <div className="p-3 border-t border-slate-700 bg-slate-800/30">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 rounded-lg text-xs font-semibold hover:from-green-700 hover:to-green-800 transition-all"
              onClick={fetchPredictions}
            >
              🚀 Analyze
            </button>
            <button
              className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-xs font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
              onClick={() => setTranslationEnabled(!translationEnabled)}
              title={translationEnabled ? "Disable Translation" : "Enable Translation"}
            >
              {translationEnabled ? "🌐 ON" : "🌐 OFF"}
            </button>
            <button
              className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-xs font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
              onClick={() => {
                const aiMessage: ChatMessage = {
                  id: Date.now().toString(),
                  text: "🤖 Running ML predictions... Analyzing market data and strategic opportunities.",
                  isUser: false,
                  timestamp: new Date(),
                  type: "action",
                };
                setChatMessages((prev) => [...prev, aiMessage]);
              }}
            >
              🤖 ML Run
            </button>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your AI CEO anything..."
              className="flex-1 bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {!isMinimized && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMinimized(true)}
        />
      )}

      <FloatingAlert enabled={true} onToggle={() => {}} />
    </>
  );
}