
"use client";
import React, { useState, useEffect } from 'react';

interface VoicePredictionInterfaceProps {
  onPredictionMade?: (prediction: any) => void;
}

const VoicePredictionInterface: React.FC<VoicePredictionInterfaceProps> = ({ onPredictionMade }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [parsedPrediction, setParsedPrediction] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        
        if (event.results[current].isFinal) {
          parsePrediction(transcriptText);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const parsePrediction = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Parse team names and prediction
    const patterns = {
      win: /(.+?)\s+(?:will\s+)?(?:win|beat|defeat)\s+(.+?)(?:\s+by\s+(\d+))?/i,
      score: /(.+?)\s+(\d+)\s*-\s*(\d+)\s+(.+)/i,
      draw: /(.+?)\s+(?:and|vs|versus)\s+(.+?)\s+(?:will\s+)?draw/i,
      over: /over\s+(\d+\.?\d*)\s+goals/i,
      under: /under\s+(\d+\.?\d*)\s+goals/i,
    };

    let prediction: any = { originalText: text };

    if (patterns.win.test(lowerText)) {
      const match = lowerText.match(patterns.win);
      if (match) {
        prediction = {
          ...prediction,
          homeTeam: match[1].trim(),
          awayTeam: match[2].trim(),
          prediction: `${match[1].trim()} to win`,
          margin: match[3] ? parseInt(match[3]) : null,
          type: 'win'
        };
      }
    } else if (patterns.score.test(lowerText)) {
      const match = lowerText.match(patterns.score);
      if (match) {
        prediction = {
          ...prediction,
          homeTeam: match[1].trim(),
          homeScore: parseInt(match[2]),
          awayScore: parseInt(match[3]),
          awayTeam: match[4].trim(),
          prediction: `${match[2]}-${match[3]}`,
          type: 'score'
        };
      }
    } else if (patterns.draw.test(lowerText)) {
      const match = lowerText.match(patterns.draw);
      if (match) {
        prediction = {
          ...prediction,
          homeTeam: match[1].trim(),
          awayTeam: match[2].trim(),
          prediction: 'Draw',
          type: 'draw'
        };
      }
    } else if (patterns.over.test(lowerText)) {
      const match = lowerText.match(patterns.over);
      if (match) {
        prediction = {
          ...prediction,
          prediction: `Over ${match[1]} goals`,
          value: parseFloat(match[1]),
          type: 'over'
        };
      }
    } else if (patterns.under.test(lowerText)) {
      const match = lowerText.match(patterns.under);
      if (match) {
        prediction = {
          ...prediction,
          prediction: `Under ${match[1]} goals`,
          value: parseFloat(match[1]),
          type: 'under'
        };
      }
    }

    setParsedPrediction(prediction);
    speak(`I heard: ${prediction.prediction || text}`);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      setParsedPrediction(null);
      recognition.start();
      setIsListening(true);
      speak("I'm listening. Tell me your prediction.");
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const confirmPrediction = () => {
    if (parsedPrediction && onPredictionMade) {
      onPredictionMade(parsedPrediction);
      speak("Prediction confirmed!");
      setTranscript('');
      setParsedPrediction(null);
    }
  };

  if (!voiceEnabled) {
    return (
      <div style={{
        background: 'rgba(99, 102, 241, 0.1)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎤</div>
        <h3 style={{ color: '#6366f1', marginBottom: '12px' }}>Voice Predictions</h3>
        <p style={{ color: '#d1d5db', marginBottom: '20px', fontSize: '0.9rem' }}>
          Make predictions hands-free with voice commands
        </p>
        <button
          onClick={() => setVoiceEnabled(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Enable Voice Predictions
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(99, 102, 241, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(99, 102, 241, 0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#6366f1', margin: 0 }}>🎤 Voice Predictions</h3>
        <button
          onClick={() => setVoiceEnabled(false)}
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          Disable
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <button
          onClick={isListening ? stopListening : startListening}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: 'none',
            background: isListening 
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            fontSize: '3rem',
            cursor: 'pointer',
            boxShadow: isListening ? '0 0 30px rgba(239, 68, 68, 0.6)' : '0 0 20px rgba(99, 102, 241, 0.4)',
            animation: isListening ? 'pulse 1.5s infinite' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          🎤
        </button>
      </div>

      {transcript && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '8px' }}>
            Transcript:
          </div>
          <div style={{ color: '#fff', fontSize: '1rem' }}>
            "{transcript}"
          </div>
        </div>
      )}

      {parsedPrediction && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          marginBottom: '16px'
        }}>
          <div style={{ color: '#22c55e', fontSize: '0.9rem', marginBottom: '12px', fontWeight: '600' }}>
            Parsed Prediction:
          </div>
          <div style={{ color: '#d1fae5', fontSize: '0.9rem', marginBottom: '8px' }}>
            {parsedPrediction.homeTeam && `${parsedPrediction.homeTeam} vs ${parsedPrediction.awayTeam}`}
          </div>
          <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '600' }}>
            {parsedPrediction.prediction}
          </div>
          
          <button
            onClick={confirmPrediction}
            style={{
              marginTop: '12px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: '600',
              width: '100%'
            }}
          >
            ✓ Confirm Prediction
          </button>
        </div>
      )}

      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '12px' }}>
          Example commands:
        </div>
        <div style={{ display: 'grid', gap: '8px', fontSize: '0.85rem', color: '#d1d5db' }}>
          <div>• "Lakers will win by 10 points"</div>
          <div>• "Manchester United 2-1 Arsenal"</div>
          <div>• "Over 2.5 goals"</div>
          <div>• "Chiefs and 49ers will draw"</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default VoicePredictionInterface;
