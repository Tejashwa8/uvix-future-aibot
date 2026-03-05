import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const typewriterTexts = [
  'Build faster.',
  'Research smarter.',
  'Code with confidence.',
  'Think at scale.',
];

const neuralNodes = [
  [80, 60], [160, 40], [220, 90], [140, 130],
  [60, 130], [190, 160], [100, 180], [250, 60],
];
const neuralEdges = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [2, 5], [3, 6], [5, 7],
  [1, 3], [0, 6], [1, 7],
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = typewriterTexts[textIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) setCharIndex((c) => c + 1);
        else setTimeout(() => setDeleting(true), 1500);
      } else {
        if (charIndex > 0) setCharIndex((c) => c - 1);
        else { setDeleting(false); setTextIndex((i) => (i + 1) % typewriterTexts.length); }
      }
    }, deleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex]);

  return (
    <section className="min-h-screen flex items-center pt-[60px]" style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,237,.1), #121212 70%)' }}>
      <div className="w-full" style={{ maxWidth: 1060, margin: '0 auto', padding: '0 6%' }}>
        <div className="flex flex-wrap items-center gap-12">
          {/* Left column */}
          <div style={{ flex: '1 1 380px', maxWidth: 560 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#a855f7', boxShadow: '0 0 6px #a855f7' }} />
              <span className="text-[12px] font-medium" style={{ color: '#a855f7', fontFamily: "'Space Grotesk', sans-serif" }}>
                Next-Generation AI Platform
              </span>
            </div>

            <h1 className="font-black leading-tight mb-2"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(28px, 5vw, 58px)', color: '#f0f0f0' }}>
              UVIX AI
            </h1>
            <h2 className="font-bold mb-4"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(16px, 2.8vw, 26px)', color: '#a855f7' }}>
              The Next Generation AI Assistant
            </h2>

            {/* Typewriter */}
            <div className="mb-4 h-8">
              <span className="gradient-text text-lg font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {typewriterTexts[textIndex].slice(0, charIndex)}
              </span>
              <span className="animate-typing-cursor text-lg" style={{ color: '#a855f7' }}>|</span>
            </div>

            <p className="text-[14px] leading-[1.8] mb-8" style={{ color: '#4a4a4a', maxWidth: 440, fontFamily: "'Space Grotesk', sans-serif" }}>
              Build, research, code and think faster with UVIX — the AI platform built for developers, researchers, and teams who demand more.
            </p>

            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => navigate('/auth')}
                className="rounded-lg font-medium transition-colors"
                style={{ background: '#a855f7', color: '#fff', padding: '13px 28px', fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#9333ea'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#a855f7'; }}>
                Start for Free <ArrowRight className="w-4 h-4 ml-1.5 inline" />
              </button>
              <button onClick={() => navigate('/auth')}
                className="rounded-lg font-medium border transition-colors"
                style={{ background: 'transparent', borderColor: '#2a2a2a', color: '#888', padding: '13px 28px', fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.color = '#f0f0f0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; }}>
                Login
              </button>
            </div>

            <p className="text-[12px]" style={{ color: '#2e2e2e', fontFamily: "'Space Grotesk', sans-serif" }}>
              Trusted by developers worldwide · No credit card required
            </p>
          </div>

          {/* Right column — Neural Orb */}
          <div className="hidden md:flex items-center justify-center" style={{ flex: '1 1 300px' }}>
            <div className="relative" style={{ width: 300, height: 300, animation: 'float 5s ease-in-out infinite' }}>
              {/* Concentric rings */}
              {[140, 110, 80].map((s, i) => (
                <div key={i} className="absolute rounded-full"
                  style={{
                    width: s, height: s,
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: `1px solid rgba(168, 85, 247, ${[0.08, 0.14, 0.20][i]})`,
                    animation: `pulse-glow ${3 + i}s ease-in-out infinite`,
                  }} />
              ))}
              {/* Core orb */}
              <div className="absolute rounded-full"
                style={{
                  width: 68, height: 68,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle at 35% 35%, #c084fc, #7c3aed, #3b0764)',
                  boxShadow: '0 0 30px rgba(168,85,247,0.6), 0 0 60px rgba(168,85,247,0.25)',
                  animation: 'glow-pulse 8s ease-in-out infinite',
                  zIndex: 10,
                }} />
              {/* Neural network SVG */}
              <svg className="absolute inset-0" width="300" height="300" viewBox="0 0 300 300" style={{ zIndex: 5 }}>
                {neuralEdges.map(([a, b], i) => (
                  <line key={i}
                    x1={neuralNodes[a][0]} y1={neuralNodes[a][1]}
                    x2={neuralNodes[b][0]} y2={neuralNodes[b][1]}
                    stroke="#a855f7" strokeWidth="0.8" opacity="0.18" />
                ))}
                {neuralNodes.map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="3.5" fill="#a855f7">
                    <animate attributeName="opacity" values="0.15;0.7;0.15" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
