import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#121212', padding: '100px 6%' }}>
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        <div className="relative rounded-[18px] text-center overflow-hidden" style={{ background: '#161616', border: '1px solid #222', padding: '64px 40px' }}>
          {/* Glow */}
          <div className="absolute pointer-events-none" style={{ width: 400, height: 200, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(ellipse, rgba(168,85,247,0.1), transparent 70%)' }} />

          <p className="font-bold tracking-[4px] mb-3 relative z-10" style={{ fontSize: 11, color: '#a855f7', fontFamily: "'Orbitron', sans-serif" }}>
            GET STARTED
          </p>
          <h2 className="font-bold mb-4 relative z-10" style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontFamily: "'Orbitron', sans-serif", color: '#f0f0f0' }}>
            Ready to experience <span className="gradient-text">UVIX AI</span>?
          </h2>
          <p className="text-[14px] mb-8 relative z-10 mx-auto" style={{ color: '#4a4a4a', maxWidth: 380, fontFamily: "'Space Grotesk', sans-serif" }}>
            Join thousands of developers and researchers already building with UVIX.
          </p>

          <div className="flex items-center justify-center gap-3 relative z-10">
            <button onClick={() => navigate('/auth')}
              className="rounded-lg font-medium transition-colors"
              style={{ background: '#a855f7', color: '#fff', padding: '14px 32px', fontSize: 14, fontFamily: "'Space Grotesk', sans-serif" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#9333ea'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#a855f7'; }}>
              Get Started <ArrowRight className="w-4 h-4 ml-1.5 inline" />
            </button>
            <button onClick={() => navigate('/auth')}
              className="rounded-lg font-medium border transition-colors"
              style={{ background: 'transparent', borderColor: '#2a2a2a', color: '#888', padding: '14px 32px', fontSize: 14, fontFamily: "'Space Grotesk', sans-serif" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.color = '#f0f0f0'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; }}>
              Login
            </button>
          </div>

          <p className="text-[12px] mt-6 relative z-10" style={{ color: '#2e2e2e', fontFamily: "'Space Grotesk', sans-serif" }}>
            No credit card required · Free tier available
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
