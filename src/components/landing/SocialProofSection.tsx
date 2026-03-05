import { useEffect, useState, useRef } from 'react';

const counters = [
  { target: 10000, suffix: '+', label: 'Users' },
  { target: 1000000, suffix: '+', label: 'AI Responses' },
  { target: 99.9, suffix: '%', label: 'Uptime', isDecimal: true },
];

const AnimatedCounter = ({ target, suffix, isDecimal }: { target: number; suffix: string; isDecimal?: boolean }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString();

  return (
    <div ref={ref} className="text-center">
      <div className="font-black mb-2"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 'clamp(26px, 4vw, 44px)',
          color: '#f0f0f0',
          textShadow: '0 0 24px rgba(168,85,247,0.3)',
        }}>
        {display}{suffix}
      </div>
    </div>
  );
};

const SocialProofSection = () => (
  <section style={{ background: '#0e0e0e', padding: '100px 6%' }}>
    <div style={{ maxWidth: 1060, margin: '0 auto' }}>
      <p className="text-center font-bold tracking-[4px] mb-3" style={{ fontSize: 11, color: '#a855f7', fontFamily: "'Orbitron', sans-serif" }}>
        TRUSTED WORLDWIDE
      </p>
      <h2 className="text-center font-bold mb-16" style={{ fontSize: 'clamp(20px, 3vw, 30px)', color: '#f0f0f0', fontFamily: "'Orbitron', sans-serif" }}>
        Trusted by developers and researchers worldwide.
      </h2>

      <div className="grid grid-cols-3 gap-8">
        {counters.map((c, i) => (
          <div key={i}>
            <AnimatedCounter target={c.target} suffix={c.suffix} isDecimal={c.isDecimal} />
            <p className="text-center text-[13px] mt-2" style={{ color: '#555', fontFamily: "'Space Grotesk', sans-serif" }}>{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProofSection;
