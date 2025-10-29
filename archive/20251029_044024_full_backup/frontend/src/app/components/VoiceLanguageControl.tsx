'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { locales, localeNames, type Locale } from '@/i18n';
import { useUserPreferences } from '../providers/UserPreferencesProvider';

export function VoiceLanguageControl() {
  const locale = useLocale() as Locale;
  const { updatePreferences } = useUserPreferences();
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');

  useEffect(() => {
    const speechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(!!speechRecognition);
  }, []);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = locale;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setLastCommand(transcript);

      // Language switching commands
      const languageCommands: Record<string, Locale> = {
        'switch to english': 'en',
        'cambiar a español': 'es',
        'spanish': 'es',
        'passer au français': 'fr',
        'french': 'fr',
        'wechseln zu deutsch': 'de',
        'german': 'de',
        'mudar para português': 'pt',
        'portuguese': 'pt'
      };

      for (const [command, targetLocale] of Object.entries(languageCommands)) {
        if (transcript.includes(command)) {
          document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
          await updatePreferences({ language: targetLocale });
          window.location.href = window.location.href;
          break;
        }
      }
    };

    recognition.start();
  };

  if (!supported) return null;

  return (
    <div style={{
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      marginTop: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ color: '#60a5fa', fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px' }}>
            🎤 Voice Control
          </h4>
          <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
            Say "Switch to [language]" to change
          </p>
        </div>
        <button
          onClick={startListening}
          disabled={isListening}
          style={{
            background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '10px',
            cursor: isListening ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: isListening ? 0.7 : 1
          }}
        >
          {isListening ? (
            <>
              <span className="pulse-dot" style={{
                width: '8px',
                height: '8px',
                background: '#ef4444',
                borderRadius: '50%',
                animation: 'pulse 1.5s infinite'
              }} />
              Listening...
            </>
          ) : (
            <>🎙️ Activate</>
          )}
        </button>
      </div>
      {lastCommand && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '6px',
          fontSize: '0.8rem',
          color: '#9ca3af'
        }}>
          Last command: "{lastCommand}"
        </div>
      )}
    </div>
  );
}

export default VoiceLanguageControl;