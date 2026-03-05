const steps = [
  { num: '01', icon: '🔑', title: 'Sign Up', desc: 'Create your free UVIX account in under 30 seconds.' },
  { num: '02', icon: '⚙️', title: 'Configure', desc: 'Set your workspace, connect your tools and API keys.' },
  { num: '03', icon: '💬', title: 'Ask UVIX', desc: 'Type any question, code task, or research prompt.' },
  { num: '04', icon: '🧠', title: 'AI Processes', desc: 'UVIX reasons deeply using context and your knowledge base.' },
  { num: '05', icon: '✅', title: 'Get Results', desc: 'Receive precise, actionable answers in seconds.' },
];

const Arrow = () => (
  <svg width="28" height="16" viewBox="0 0 28 16" fill="none" className="hidden lg:block flex-shrink-0 mt-8">
    <path d="M0 8 H22 M16 2 L24 8 L16 14" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </svg>
);

const HowItWorksSection = () => (
  <section id="how-it-works" style={{ background: '#121212', padding: '100px 6%' }}>
    <div style={{ maxWidth: 1060, margin: '0 auto' }}>
      <p className="font-bold tracking-[4px] mb-3" style={{ fontSize: 11, color: '#a855f7', fontFamily: "'Orbitron', sans-serif" }}>
        PROCESS
      </p>
      <h2 className="font-bold mb-2" style={{ fontSize: 'clamp(20px, 3vw, 30px)', color: '#f0f0f0', fontFamily: "'Orbitron', sans-serif" }}>
        How UVIX Works
      </h2>
      <p className="text-[14px] mb-10" style={{ color: '#4a4a4a', fontFamily: "'Space Grotesk', sans-serif" }}>
        From sign-up to your first AI response in minutes. Five simple steps.
      </p>

      {/* Steps row */}
      <div className="flex flex-wrap justify-center items-start gap-0">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start">
            <div className="relative text-center rounded-[14px]"
              style={{ background: '#161616', border: '1px solid #222', padding: '28px 20px', minWidth: 150, maxWidth: 180, flex: '1' }}>
              {/* Step badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5"
                style={{ background: '#a855f7', color: '#fff', fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 10 }}>
                {s.num}
              </div>
              {/* Icon circle */}
              <div className="mx-auto mt-2.5 mb-4 flex items-center justify-center rounded-full text-[22px]"
                style={{ width: 52, height: 52, background: '#1e1230', border: '1px solid #3d1a6e' }}>
                {s.icon}
              </div>
              <h3 className="font-bold tracking-[0.8px] mb-2" style={{ fontSize: 11, color: '#f0f0f0', fontFamily: "'Orbitron', sans-serif" }}>
                {s.title}
              </h3>
              <p className="text-[12px] leading-[1.7]" style={{ color: '#4a4a4a', fontFamily: "'Space Grotesk', sans-serif" }}>
                {s.desc}
              </p>
              {/* Bottom dot */}
              <div className="mx-auto mt-4 rounded-full" style={{ width: 10, height: 10, background: '#a855f7' }} />
            </div>
            {i < steps.length - 1 && <Arrow />}
          </div>
        ))}
      </div>

      {/* Result connector */}
      <div className="flex flex-col items-center mt-0">
        <div style={{ width: 1, height: 40, background: 'linear-gradient(#a855f7, transparent)' }} />
        <div className="rounded-xl text-center" style={{ background: '#161616', border: '1px solid rgba(168,85,247,0.4)', padding: '18px 32px' }}>
          <h4 className="font-bold mb-1" style={{ fontSize: 13, color: '#a855f7', fontFamily: "'Orbitron', sans-serif" }}>Result</h4>
          <p className="text-[13px]" style={{ color: '#666', maxWidth: 320, fontFamily: "'Space Grotesk', sans-serif" }}>
            Precise, context-aware AI output — delivered in under a second.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
