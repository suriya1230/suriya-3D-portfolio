// app/page.js
'use client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { logVisitRTDB } from '@/lib/rtdb';
import VisitPopup from '@/components/ui/VisitPopup';
import ModeSelector from '@/components/ui/ModeSelector';
import ManualPortfolio from '@/components/portfolio/ManualPortfolio';
import FeedbackWidget from '@/components/ui/FeedbackWidget';

export default function Home() {
  const [stage, setStage] = useState('popup'); // popup | mode | manual | agentic
  const [visitor, setVisitor] = useState({ name: '', company: '' });
  const [sessionId] = useState(() => uuidv4());
  const [showFeedback, setShowFeedback] = useState(false);

  // Check if already visited this session
  useEffect(() => {
    const visited = sessionStorage.getItem('suriya_visited');
    if (visited) {
      const data = JSON.parse(visited);
      setVisitor(data);
      setStage('mode');
    }
  }, []);

  const handleVisitSubmit = async (name, company) => {
    const data = { name, company };
    setVisitor(data);
    sessionStorage.setItem('suriya_visited', JSON.stringify(data));
    setStage('mode');
    // Log in background
    try {
      await logVisitRTDB({ name, company, sessionId, mode: 'entry' });
    } catch (e) {
      console.warn('Visit log failed:', e);
    }
  };

  const handleModeSelect = async (mode) => {
    try {
      await logVisitRTDB({ ...visitor, sessionId, mode });
    } catch (e) {
      console.warn('Mode log failed:', e);
    }
    if (mode === 'agentic') {
      window.location.href = '/agentic';
    } else {
      setStage('manual');
    }
  };

  return (
    <main className="min-h-screen bg-void">
      {stage === 'popup' && (
        <VisitPopup onSubmit={handleVisitSubmit} onSkip={() => handleVisitSubmit('Guest', '')} />
      )}
      {stage === 'mode' && (
  <>
    <ModeSelector visitor={visitor} onSelect={handleModeSelect} />

    

    {/* ✅ FEEDBACK DRAWER */}
    <FeedbackWidget
      forceOpen={showFeedback}
      onClose={() => setShowFeedback(false)}
    />
  </>
)}
      {stage === 'manual' && (
        <ManualPortfolio visitor={visitor} />
      )}
    </main>
  );
}
