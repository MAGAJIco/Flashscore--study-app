
"use client";

import React, { useState, useEffect } from 'react';

export default function VoicePredictionAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [prediction, setPrediction] = useState<any>(null);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        
        if (event.results[current].isFinal) {
          processPrediction(transcriptText);
        }
      };
      
      recognition.start();
    } else {
      alert('Voice recognition not supported in this browser');
    }
  };

  const processPrediction = (text: string) => {
    // Parse voice command and create prediction
    console.log('Processing:', text);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      right: '20px',
      zIndex: 1000
    }}>
      <button
        onClick={startListening}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: isListening
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'linear-gradient(135deg, #3b82f6, #2563eb)',
          border: 'none',
          color: '#fff',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
          transition: 'all 0.3s ease',
          animation: isListening ? 'pulse 1.5s infinite' : 'none'
        }}
      >
        🎤
      </button>

      {transcript && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: '0',
          background: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: '12px',
          maxWidth: '250px',
          fontSize: '14px'
        }}>
          {transcript}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
