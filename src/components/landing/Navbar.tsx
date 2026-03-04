import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import UvixBotLogo from '@/components/UvixBotLogo';

const navLinks = [
  { label: 'Features', target: 'features' },
  { label: 'Capabilities', target: 'capabilities' },
  { label: 'Pricing', target: 'pricing' },
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
      className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-6 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(18,18,18,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid #1e1e1e' : '1px solid transparent',
      }}
    >
      <div className="flex items-center gap-2.5">
        <UvixBotLogo size={28} />
        <span
          className="font-bold tracking-[4px] text-[14px]"
          style={{ fontFamily: "'Orbitron', sans-serif", color: '#f0f0f0' }}
        >
          UVIX
        </span>
      </div>

      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <button
            key={link.target}
            onClick={() => scrollTo(link.target)}
            className="text-sm transition-colors duration-200"
            style={{ color: '#888', fontFamily: "'Space Grotesk', sans-serif" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#a855f7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; }}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/auth')}
          className="text-muted-foreground hover:text-foreground"
        >
          Login
        </Button>
        <Button
          size="sm"
          onClick={() => navigate('/auth')}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Get Started
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
