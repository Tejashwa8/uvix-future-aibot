import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UvixBotLogo from '@/components/UvixBotLogo';

const navLinks = [
  { label: 'Features', target: 'features' },
  { label: 'How It Works', target: 'how-it-works' },
  { label: 'Capabilities', target: 'capabilities' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between transition-all duration-300"
      style={{
        padding: '0 6%',
        background: scrolled ? 'rgba(18,18,18,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid #1e1e1e' : '1px solid transparent',
      }}
    >
      <div className="flex items-center gap-2.5">
        <UvixBotLogo size={30} showEars />
        <span className="font-black tracking-[4px] text-[14px]" style={{ fontFamily: "'Orbitron', sans-serif", color: '#f0f0f0' }}>
          UVIX
        </span>
      </div>

      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <button
            key={link.target}
            onClick={() => scrollTo(link.target)}
            className="text-[13px] transition-colors duration-200"
            style={{ color: '#888', fontFamily: "'Space Grotesk', sans-serif" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#a855f7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; }}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/auth')}
          className="text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
          style={{ color: '#888', fontFamily: "'Space Grotesk', sans-serif" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#f0f0f0'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; }}
        >
          Login
        </button>
        <button
          onClick={() => navigate('/auth')}
          className="text-[13px] font-medium rounded-lg transition-colors"
          style={{ background: '#a855f7', color: '#fff', padding: '8px 18px', fontFamily: "'Space Grotesk', sans-serif" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#9333ea'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#a855f7'; }}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
