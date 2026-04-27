// components/portfolio/ManualPortfolio.js
'use client';
import { useEffect, useState } from 'react';
import { fetchRTDB } from '@/lib/rtdb';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import EducationSection from './EducationSection';
import ProjectsSection from './ProjectsSection';
import CertificatesSection from './CertificatesSection';
import SkillsSection from './SkillsSection';
import AchievementsSection from './AchievementsSection';
import ContactSection from './ContactSection';
import FeedbackWidget from '@/components/ui/FeedbackWidget';

export default function ManualPortfolio({ visitor }) {
  const [data, setData] = useState({
    about: [], education: [], projects: [],
    certificates: [], skills: [], achievements: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [about, education, projects, certificates, skills, achievements] = await Promise.all([
          fetchRTDB('about'), fetchRTDB('education'), fetchRTDB('projects'),
          fetchRTDB('certificates'), fetchRTDB('skills'), fetchRTDB('achievements'),
        ]);
        setData({ about, education, projects, certificates, skills, achievements });
      } catch (e) {
        console.error('Data load error:', e);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl gold-text" style={{ fontFamily: 'var(--font-display)' }}>
            Loading Portfolio...
          </div>
          <div className="flex gap-1 justify-center">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full"
                style={{ background: 'var(--gold)', animation: 'glowPulse 1s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void">
      <Navbar />
      <HeroSection about={data.about[0]} visitor={visitor} />
      <AboutSection about={data.about[0]} />
      <EducationSection education={data.education} />
      <ProjectsSection projects={data.projects} />
      <CertificatesSection certificates={data.certificates} />
      <SkillsSection skills={data.skills} />
      <AchievementsSection achievements={data.achievements} />
      <ContactSection />
      <FeedbackWidget />

      {/* Back to top */}
      <a href="#top" className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-sm z-50"
        style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)' }}>
        ↑
      </a>
    </div>
  );
}
