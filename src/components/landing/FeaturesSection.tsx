const features = [
  {
    icon: '🧠',
    title: 'INTELLIGENT AI',
    bullets: ['Claude-powered reasoning', 'Deep contextual understanding', 'Research grade responses'],
  },
  {
    icon: '⚡',
    title: 'DEVELOPER FRIENDLY',
    bullets: ['API integration', 'Code generation', 'Debug assistance'],
  },
  {
    icon: '📚',
    title: 'SMART KNOWLEDGE',
    bullets: ['Memory based responses', 'Document analysis', 'Fast retrieval system'],
  },
];

const FeaturesSection = () => (
  <section id="features" style={{ background: '#0e0e0e', padding: '100px 6%' }}>
    <div style={{ maxWidth: 1060, margin: '0 auto' }}>
      <p className="font-bold tracking-[4px] mb-3" style={{ fontSize: 11, color: '#a855f7', fontFamily: "'Orbitron', sans-serif" }}>
        FEATURES
      </p>
      <h2 className="font-bold mb-2" style={{ fontSize: 'clamp(20px, 3vw, 30px)', color: '#f0f0f0', fontFamily: "'Orbitron', sans-serif" }}>
        Built for every use case.
      </h2>
      <p className="text-[14px] mb-10" style={{ color: '#4a4a4a', fontFamily: "'Space Grotesk', sans-serif" }}>
        Three pillars that make UVIX the most versatile AI platform available.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        {features.map((f, i) => (
          <div key={i} className="rounded-[14px]" style={{ background: '#161616', border: '1px solid #222', padding: '28px 24px' }}>
            <div className="flex items-center justify-center text-xl mb-4"
              style={{ width: 44, height: 44, background: '#1e1230', border: '1px solid #2d1a4a', borderRadius: 10 }}>
              {f.icon}
            </div>
            <h3 className="font-bold tracking-[1px] mb-3" style={{ fontSize: 14, color: '#f0f0f0', fontFamily: "'Orbitron', sans-serif" }}>
              {f.title}
            </h3>
            <ul className="space-y-2">
              {f.bullets.map((b, j) => (
                <li key={j} className="flex items-center gap-2.5" style={{ fontSize: 13, color: '#666', fontFamily: "'Space Grotesk', sans-serif" }}>
                  <span className="flex-shrink-0 rounded-full" style={{ width: 5, height: 5, background: '#a855f7', boxShadow: '0 0 4px #a855f7' }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
