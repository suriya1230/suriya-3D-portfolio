// hooks/useVoice.js
'use client';
import { useState, useCallback, useRef } from 'react';

// JARVIS → deep male voice
// FRIDAY → female voice
const VOICE_PROFILES = {
  jarvis: {
    names: ['Daniel', 'Google UK English Male', 'Alex', 'Arthur', 'Google US English', 'Microsoft David'],
    rate: 0.88, pitch: 0.88, gender: 'male',
  },
  friday: {
    names: ['Samantha', 'Google UK English Female', 'Karen', 'Moira', 'Veena', 'Microsoft Zira', 'Google US English Female', 'Victoria'],
    rate: 0.92, pitch: 1.08, gender: 'female',
  },
};

export function useVoice() {
  const [speaking, setSpeaking]   = useState(false);
  const [persona, setPersona]     = useState('jarvis'); // 'jarvis' | 'friday'
  const utteranceRef = useRef(null);
  const onEndRef     = useRef(null);
  const personaRef   = useRef('jarvis');

  const switchPersona = useCallback((p) => {
    personaRef.current = p;
    setPersona(p);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (options.onEnd) setTimeout(options.onEnd, 800);
      return;
    }

    window.speechSynthesis.cancel();
    onEndRef.current = options.onEnd || null;

    const profile = VOICE_PROFILES[personaRef.current] || VOICE_PROFILES.jarvis;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate   = options.rate   || profile.rate;
    utterance.pitch  = options.pitch  || profile.pitch;
    utterance.volume = options.volume || 1;
    utterance.lang   = 'en-US';

    const loadVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Try each preferred name in order
      let chosen = null;
      for (const name of profile.names) {
        chosen = voices.find(v => v.name.includes(name));
        if (chosen) break;
      }
      // Fallback: pick any voice matching the gender heuristic
      if (!chosen) {
        chosen = voices.find(v =>
          profile.gender === 'female'
            ? v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Karen')
            : v.name.toLowerCase().includes('male') || v.name.includes('David') || v.name.includes('Daniel')
        );
      }
      if (chosen) utterance.voice = chosen;
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoice();
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoice, { once: true });
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      if (onEndRef.current) { onEndRef.current(); onEndRef.current = null; }
    };
    utterance.onerror = (e) => {
      setSpeaking(false);
      console.warn('[useVoice] Error:', e.error);
      if (onEndRef.current) { onEndRef.current(); onEndRef.current = null; }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      onEndRef.current = null;
    }
  }, []);

  return { speak, stop, speaking, persona, switchPersona };
}