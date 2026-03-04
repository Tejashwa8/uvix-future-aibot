import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const typewriterTexts = [
  'Build faster.',
  'Research smarter.',
  'Code with confidence.',
  'Think at scale.',
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const HeroSection = () => {
  const navigate = useNavigate();
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = typewriterTexts[textIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setCharIndex((c) => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 1500);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((c) => c - 1);
        } else {
          setDeleting(false);
          setTextIndex((i) => (i + 1) % typewriterTexts.length);
        }
      }
    }, deleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex]);

  return (
    <section className="min-h-screen flex items-center pt-[60px]" style={{ background: '#121212' }}>
      <div className="max-w-6xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left column */}
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#a855f7', boxShadow: '0 0 8px #a855f7' }} />
            <span className="text-xs font-medium" style={{ color: '#a855f7', fontFamily: "'Space Grotesk', sans-serif" }}>
              Next-Generation AI Platform
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp}
            className="font-black leading-tight mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(28px, 5vw, 58px)', color: '#f0f0f0' }}>
            UVIX AI
          </motion.h1>

          <motion.h2 variants={fadeUp}
            className="font-bold mb-4"
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(16px, 2.5vw, 26px)', color: '#a855f7' }}>
            The Next Generation AI Assistant
          </motion.h2>

          {/* Typewriter */}
          <motion.div variants={fadeUp} className="mb-4 h-8">
            <span className="text-lg font-semibold" style={{ color: '#e0e0e0', fontFamily: "'Space Grotesk', sans-serif" }}>
              {typewriterTexts[textIndex].slice(0, charIndex)}
            </span>
            <span className="animate-typing-cursor text-lg" style={{ color: '#a855f7' }}>|</span>
          </motion.div>

          <motion.p variants={fadeUp} className="text-sm leading-relaxed mb-8 max-w-md" style={{ color: '#888' }}>
            Build, research, code and think faster with UVIX — the AI platform built for developers, researchers, and teams who demand more.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <Button onClick={() => navigate('/auth')} className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
              Start for Free <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/auth')}
              className="border-border text-muted-foreground hover:text-foreground">
              Login
            </Button>
          </motion.div>

          <motion.p variants={fadeUp} className="text-xs" style={{ color: '#555' }}>
            Trusted by developers worldwide · No credit card required
          </motion.p>
        </motion.div>

        {/* Right column — Neural Orb */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative animate-float">
            {/* Rings */}
            {[140, 110, 80].map((s, i) => (
              <div key={i} className="absolute rounded-full animate-pulse-glow"
                style={{
                  width: s, height: s,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: `1px solid rgba(168, 85, 247, ${0.12 + i * 0.06})`,
                  animationDelay: `${i * 0.5}s`,
                }} />
            ))}
            {/* Core orb */}
            <div className="w-[68px] h-[68px] rounded-full relative z-10"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #c084fc, #7c3aed, #3b0764)',
                boxShadow: '0 0 40px rgba(168, 85, 247, 0.5), 0 0 80px rgba(168, 85, 247, 0.25)',
              }} />
            {/* Neural nodes SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="-80 -80 160 160" style={{ width: 200, height: 200, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              {/* Edges */}
              {[
                [-50, -40, -20, -55], [-20, -55, 25, -50], [25, -50, 55, -25],
                [55, -25, 50, 20], [50, 20, 20, 50], [20, 50, -30, 45],
                [-30, 45, -55, 15], [-55, 15, -50, -40], [-20, -55, 50, 20],
                [-50, -40, 20, 50], [25, -50, -30, 45],
              ].map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a855f7" strokeWidth="0.5" opacity="0.18" />
              ))}
              {/* Nodes */}
              {[
                [-50, -40], [-20, -55], [25, -50], [55, -25],
                [50, 20], [20, 50], [-30, 45], [-55, 15],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3" fill="#a855f7" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
