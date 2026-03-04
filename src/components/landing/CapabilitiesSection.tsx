import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const caps = [
  { icon: '💻', title: 'AI Coding Assistant', desc: 'Write, refactor, and debug code in any language instantly.' },
  { icon: '🔬', title: 'AI Research Engine', desc: 'Deep-dive into any topic with citation-aware analysis.' },
  { icon: '✍️', title: 'AI Writing Assistant', desc: 'Drafts, edits, and rewrites that match your voice.' },
  { icon: '📄', title: 'AI Document Analysis', desc: 'Upload and query any document — PDFs, reports, contracts.' },
  { icon: '🔍', title: 'AI Knowledge Search', desc: 'Retrieve precise answers from your knowledge base fast.' },
];

const CapabilitiesSection = () => (
  <section id="capabilities" className="py-24" style={{ background: '#121212' }}>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger}>
        <motion.p variants={fadeUp} className="text-[11px] font-bold tracking-[4px] mb-3" style={{ color: '#a855f7', fontFamily: "'Orbitron', sans-serif" }}>
          CAPABILITIES
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold mb-12" style={{ color: '#f0f0f0', fontFamily: "'Orbitron', sans-serif" }}>
          What UVIX can do.
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {caps.map((c, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1"
              style={{ background: '#161616', borderColor: '#1e1e1e' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(168,85,247,0.35)';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(168,85,247,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1e1e1e';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span className="text-2xl mb-3 block">{c.icon}</span>
              <h3 className="font-bold text-[11px] tracking-[0.8px] mb-2" style={{ color: '#e0e0e0', fontFamily: "'Orbitron', sans-serif" }}>
                {c.title}
              </h3>
              <p className="text-[12px] leading-relaxed" style={{ color: '#4a4a4a' }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default CapabilitiesSection;
