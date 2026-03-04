import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const features = [
  {
    icon: '🧠',
    title: 'Intelligent AI',
    bullets: ['Claude-powered reasoning', 'Deep contextual understanding', 'Research grade responses'],
  },
  {
    icon: '⚡',
    title: 'Developer Friendly',
    bullets: ['API integration', 'Code generation', 'Debug assistance'],
  },
  {
    icon: '📚',
    title: 'Smart Knowledge',
    bullets: ['Memory based responses', 'Document analysis', 'Fast retrieval system'],
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-24" style={{ background: '#0e0e0e' }}>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger}>
        <motion.p variants={fadeUp} className="text-[11px] font-bold tracking-[4px] mb-3" style={{ color: '#a855f7', fontFamily: "'Orbitron', sans-serif" }}>
          FEATURES
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold mb-12" style={{ color: '#f0f0f0', fontFamily: "'Orbitron', sans-serif" }}>
          Built for every use case.
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group rounded-[14px] p-6 border transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden"
              style={{ background: '#161616', borderColor: '#222' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(168,85,247,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#222';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center text-xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-[4deg]"
                style={{ background: '#1e1230', border: '1px solid #2d1a4a' }}
              >
                {f.icon}
              </div>
              <h3 className="font-bold text-[14px] tracking-[1px] mb-3" style={{ color: '#f0f0f0', fontFamily: "'Orbitron', sans-serif" }}>
                {f.title}
              </h3>
              <ul className="space-y-2">
                {f.bullets.map((b, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-[13px]" style={{ color: '#666' }}>
                    <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: '#a855f7', boxShadow: '0 0 6px #a855f7' }} />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default FeaturesSection;
