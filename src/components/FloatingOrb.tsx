import { useState } from 'react';
import { Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const FloatingOrb = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/auth')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed bottom-6 right-6 z-50 rounded-full flex items-center justify-center',
        'w-14 h-14 md:w-16 md:h-16',
        'transition-transform duration-300 ease-out',
        isHovered && 'scale-105'
      )}
      style={{
        background: 'radial-gradient(circle at 30% 30%, #A78BFA, #7C3AED, #4C1D95)',
        boxShadow: isHovered
          ? '0 0 30px hsl(263 70% 58% / 0.6), 0 0 60px hsl(187 85% 53% / 0.3)'
          : '0 0 20px hsl(263 70% 58% / 0.4), 0 0 40px hsl(187 85% 53% / 0.15)',
      }}
      aria-label="Try Uvix"
    >
      {/* Pulse glow ring */}
      <span
        className="absolute inset-0 rounded-full animate-glow-pulse"
        style={{
          background: 'radial-gradient(circle, hsl(187 85% 53% / 0.2), hsl(263 70% 58% / 0.15), transparent)',
          filter: 'blur(10px)',
          transform: 'scale(1.5)',
        }}
      />
      <Bot className="w-6 h-6 md:w-7 md:h-7 text-white relative z-10" />
    </button>
  );
};

export default FloatingOrb;
