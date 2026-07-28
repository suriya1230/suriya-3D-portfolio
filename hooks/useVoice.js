// hooks/useVoice.js
'use client';
import { useState, useCallback, useRef } from 'react';

// JARVIS → deep male voice
// FRIDAY → female voice
const VOICE_PROFILES = {
  jarvis: {
    names: ['Daniel', 'Google UK English Male', 'Alex', 'Arthur', 'Google US English', 'Microsoft David'],
    rate: 1, pitch: 0.88, gender: 'male',
  },
  friday: {
    names: ['Samantha', 'Google UK English Female', 'Karen', 'Moira', 'Veena', 'Microsoft Zira', 'Google US English Female', 'Victoria'],
    rate: 1, pitch: 1.08, gender: 'female',
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

    const pickVoice = (voices) => {
      for (const name of profile.names) {
        const match = voices.find(v => v.name.includes(name));
        if (match) return match;
      }
      return voices.find(v =>
        profile.gender === 'female'
          ? v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Karen')
          : v.name.toLowerCase().includes('male') || v.name.includes('David') || v.name.includes('Daniel')
      ) || null;
    };

    // On a fresh page load the voice list can still be empty here (Chrome loads
    // it asynchronously) - speaking immediately in that case means the
    // utterance goes out with no voice set and the browser falls back to
    // whatever its own default is, which on some platforms/production
    // environments is a much slower-sounding voice than the one picked once
    // voices did load. Wait for the real list first instead of racing it.
    const runSpeak = (voices) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate   = options.rate   || profile.rate;
      utterance.pitch  = options.pitch  || profile.pitch;
      utterance.volume = options.volume || 1;
      utterance.lang   = 'en-US';

      const chosen = pickVoice(voices);
      if (chosen) utterance.voice = chosen;

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
    };

    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      runSpeak(existing);
    } else {
      let started = false;
      const onVoicesChanged = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        if (started) return;
        started = true;
        runSpeak(window.speechSynthesis.getVoices());
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      // Some browsers never fire voiceschanged (or already missed it) - fall
      // back to speaking with whatever's available after a short wait so
      // narration never just silently never starts.
      setTimeout(() => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        if (started) return;
        started = true;
        runSpeak(window.speechSynthesis.getVoices());
      }, 400);
    }
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