const caps = [
  { icon: '💻', title: 'AI Coding Assistant', desc: 'Write, refactor, and debug code in any language instantly.' },
  { icon: '🔬', title: 'AI Research Engine', desc: 'Deep-dive into any topic with citation-aware analysis.' },
  { icon: '✍️', title: 'AI Writing Assistant', desc: 'Drafts, edits, and rewrites that match your voice.' },
  { icon: '📄', title: 'AI Document Analysis', desc: 'Upload and query any document — PDFs, reports, contracts.' },
  { icon: '🔍', title: 'AI Knowledge Search', desc: 'Retrieve precise answers from your knowledge base fast.' },
];

const CapabilitiesSection = () => (
  <section id="capabilities" style={{ background: '#0e0e0e', padding: '100px 6%' }}>
    <div style={{ maxWidth: 1060, margin: '0 auto' }}>
      <p className="font-bold tracking-[4px] mb-3" style={{ fontSize: 11, color: '#a855f7', fontFamily: "'Orbitron', sans-serif" }}>
        CAPABILITIES
      </p>
      <h2 className="font-bold mb-2" style={{ fontSize: 'clamp(20px, 3vw, 30px)', color: '#f0f0f0', fontFamily: "'Orbitron', sans-serif" }}>
        What UVIX can do.
      </h2>
      <p className="text-[14px] mb-10" style={{ color: '#4a4a4a', fontFamily: "'Space Grotesk', sans-serif" }}>
        From writing a line of code to analysing an entire document — UVIX handles it.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
        {caps.map((c, i) => (
          <div key={i} className="rounded-xl" style={{ background: '#161616', border: '1px solid #1e1e1e', padding: '24px 20px' }}>
            <span className="text-[26px] block mb-3.5">{c.icon}</span>
            <h3 className="font-bold tracking-[0.8px] mb-2 leading-[1.4]" style={{ fontSize: 11, color: '#e0e0e0', fontFamily: "'Orbitron', sans-serif" }}>
              {c.title}
            </h3>
            <p className="text-[12px] leading-[1.7]" style={{ color: '#4a4a4a', fontFamily: "'Space Grotesk', sans-serif" }}>
              {c.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CapabilitiesSection;
