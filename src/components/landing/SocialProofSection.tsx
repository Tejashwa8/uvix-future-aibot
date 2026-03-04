import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

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
      <div
        className="font-black mb-2"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 'clamp(26px, 4vw, 44px)',
          color: '#f0f0f0',
          textShadow: '0 0 24px rgba(168,85,247,0.3)',
        }}
      >
        {display}{suffix}
      </div>
    </div>
  );
};

const SocialProofSection = () => (
  <section className="py-24" style={{ background: '#0e0e0e' }}>
    <div className="max-w-5xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger}>
        <motion.p variants={fadeUp} className="text-[11px] font-bold tracking-[4px] mb-3 text-center" style={{ color: '#a855f7', fontFamily: "'Orbitron', sans-serif" }}>
          TRUSTED WORLDWIDE
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold mb-16 text-center" style={{ color: '#f0f0f0', fontFamily: "'Orbitron', sans-serif" }}>
          Trusted by developers and researchers worldwide.
        </motion.h2>

        <div className="grid grid-cols-3 gap-8">
          {counters.map((c, i) => (
            <motion.div key={i} variants={fadeUp}>
              <AnimatedCounter target={c.target} suffix={c.suffix} isDecimal={c.isDecimal} />
              <p className="text-center text-[13px] mt-2" style={{ color: '#555' }}>{c.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default SocialProofSection;
