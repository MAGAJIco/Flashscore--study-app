
"use client";
import React, { useEffect, useState, useRef } from "react";
import FloatingAlert, { triggerFloatingAlert } from "@components/FloatingAlert";
import { magajicoCEO, Prediction, CEOAction, getStrategicInsights } from "./ai/magajicoCEO";

interface MagajiCoManagerProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function MagajiCoManager({ isOpen = false, onToggle }: MagajiCoManagerProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isMinimized, setIsMinimized] = useState(!isOpen);
  const [ceoActions, setCeoActions] = useState<CEOAction[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Array<{
    type: 'system' | 'ceo' | 'user';
    content: string;
    timestamp: Date;
    level?: 'info' | 'success' | 'warning' | 'danger';
  }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Fetch predictions from backend
  const fetchPredictions = async () => {
    try {
      const res = await fetch("/api/backend/predictions");
      if (res.ok) {
        const data = await res.json();
        setPredictions(data.data || []);
        addMessage('system', `📊 Fetched ${data.data?.length || 0} predictions from backend`, 'info');
      } else {
        throw new Error(`Backend returned ${res.status}`);
      }
    } catch (err) {
      addMessage('system', "❌ Failed to fetch predictions - Backend offline", 'danger');
      // Generate mock predictions for demo
      const mockPredictions: Prediction[] = [
        { match: "Arsenal vs Chelsea", prediction: "Arsenal Win", confidence: 85, marketValue: 75, riskFactor: 0.3 },
        { match: "Man City vs Liverpool", prediction: "Draw", confidence: 92, marketValue: 80, riskFactor: 0.2 },
        { match: "Barcelona vs Real Madrid", prediction: "Barcelona Win", confidence: 78, marketValue: 90, riskFactor: 0.4 }
      ];
      setPredictions(mockPredictions);
    }
  };

  const addMessage = (type: 'system' | 'ceo' | 'user', content: string, level?: 'info' | 'success' | 'warning' | 'danger') => {
    setMessages(prev => [...prev, {
      type,
      content,
      timestamp: new Date(),
      level
    }]);
  };

  // Autonomous CEO thinking every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPredictions();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // CEO reviews predictions with strategic intelligence
  useEffect(() => {
    if (predictions.length > 0) {
      setIsThinking(true);
      
      setTimeout(() => {
        const decisions: CEOAction[] = magajicoCEO(predictions);
        const insights = getStrategicInsights(predictions);
        setCeoActions(decisions);
        
        addMessage('ceo', `🧠 CEO Analysis Complete: Reviewed ${predictions.length} predictions`, 'info');
        
        decisions.forEach((action, index) => {
          setTimeout(() => {
            if (action.type === "ALERT") {
              addMessage('ceo', action.message, action.level);
            }
            if (action.type === "STRATEGIC_MOVE") {
              addMessage('ceo', `🎯 Strategic Decision: ${action.action} - ${action.reasoning}`, 'success');
            }
            if (action.type === "MARKET_OPPORTUNITY") {
              addMessage('ceo', `💎 Market Opportunity: ${action.prediction.match} - ${action.potential}% potential`, 'success');
            }
          }, index * 500);
        });
        
        // Display strategic insights
        if (insights.totalOpportunities > 0) {
          setTimeout(() => {
            addMessage('ceo', 
              `📈 Strategic Intel Report:\n` +
              `• Opportunities: ${insights.totalOpportunities}\n` +
              `• Innovation Index: ${insights.innovationIndex}%\n` +
              `• Risk Management: ${insights.riskManagementScore}%\n` +
              `• Meta Intelligence: ${insights.metaIntelligence}%\n` +
              `• Zuckerberg Strategy: ${insights.zuckerbergStrategy}\n` +
              `• Filter 5(1) Score: ${insights.filter5Score}%`, 
              'info'
            );
          }, 2000);
        }
        
        setIsThinking(false);
      }, 1500);
    }
  }, [predictions]);

  const strategicInsights = predictions.length > 0 ? getStrategicInsights(predictions) : null;

  const handleToggle = () => {
    setIsMinimized(!isMinimized);
    if (onToggle) onToggle();
  };

  const getMessageIcon = (type: string, level?: string) => {
    if (type === 'ceo') return '🧠';
    if (type === 'system') {
      switch (level) {
        case 'success': return '✅';
        case 'warning': return '⚠️';
        case 'danger': return '❌';
        default: return '📊';
      }
    }
    return '👤';
  };

  const getMessageColor = (level?: string) => {
    switch (level) {
      case 'success': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  return (
    <>
      {/* ChatGPT-style Toggle Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-4 right-4 z-50 transition-all duration-300 hover:scale-105"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: isMinimized 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          fontWeight: '600',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer'
        }}
        title={isMinimized ? 'Open MagajiCo CEO' : 'Minimize MagajiCo CEO'}
      >
        {isMinimized ? '🧠' : '✕'}
      </button>

      {/* ChatGPT-style Panel */}
      {!isMinimized && (
        <div
          className="fixed bottom-20 right-4 z-40 transition-all duration-500 ease-out"
          style={{
            width: '400px',
            height: '600px',
            background: 'rgba(17, 25, 40, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}
              >
                🧠
              </div>
              <div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '16px', fontWeight: '600' }}>
                  MagajiCo CEO
                </h3>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '12px' }}>
                  {isThinking ? 'Analyzing...' : 'Strategic AI Assistant'}
                </p>
              </div>
            </div>
            
            {strategicInsights && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#22c55e', fontSize: '14px', fontWeight: '600' }}>
                  {strategicInsights.totalOpportunities} Opportunities
                </div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                  {strategicInsights.zuckerbergStrategy}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧠</div>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  MagajiCo CEO is ready to analyze predictions and provide strategic insights.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: message.type === 'ceo' ? '12px' : '8px',
                  borderRadius: '8px',
                  background: message.type === 'ceo' 
                    ? 'rgba(102, 126, 234, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: message.level === 'success' ? '1px solid rgba(34, 197, 94, 0.3)' :
                         message.level === 'warning' ? '1px solid rgba(245, 158, 11, 0.3)' :
                         message.level === 'danger' ? '1px solid rgba(239, 68, 68, 0.3)' :
                         '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div
                  style={{
                    fontSize: '16px',
                    minWidth: '20px',
                    color: getMessageColor(message.level)
                  }}
                >
                  {getMessageIcon(message.type, message.level)}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: '#e2e8f0',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {message.content}
                  </div>
                  <div
                    style={{
                      color: '#64748b',
                      fontSize: '11px',
                      marginTop: '4px'
                    }}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(102, 126, 234, 0.1)',
                  border: '1px solid rgba(102, 126, 234, 0.3)'
                }}
              >
                <div style={{ fontSize: '16px' }}>🧠</div>
                <div style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>
                  CEO is thinking...
                  <div style={{ display: 'inline-block', animation: 'pulse 1.5s infinite' }}>
                    ●●●
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Status Bar */}
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  animation: 'pulse 2s infinite'
                }}
              />
              <span style={{ color: '#94a3b8', fontSize: '11px' }}>
                Active • {predictions.length} predictions
              </span>
            </div>
            <button
              onClick={fetchPredictions}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#3b82f6',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
              title="Refresh predictions"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
