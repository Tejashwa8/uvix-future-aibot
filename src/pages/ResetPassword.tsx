import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('type=recovery')) {
      navigate('/auth');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
        return;
      }
      toast({ title: 'Password updated', description: 'You can now log in with your new password.' });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] opacity-20" style={{ background: '#7C3AED' }} />

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-widest mb-2" style={{ fontFamily: "'Orbitron', sans-serif", color: '#ffffff' }}>
            UVIX
          </h1>
        </div>

        <div className="rounded-2xl p-8 border" style={{ background: '#141414', borderColor: '#262626' }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: '#ffffff' }}>Set new password</h2>
          <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>Enter your new password below.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="w-full px-4 py-3 pr-12 rounded-lg border outline-none transition-colors text-sm"
                style={{ background: '#0a0a0a', color: '#ffffff', borderColor: '#333333' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#333333'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#6b7280' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-sm"
              style={{ background: '#0a0a0a', color: '#ffffff', borderColor: '#333333' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#333333'; }}
            />
            {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-50"
              style={{ background: '#7C3AED', color: '#ffffff' }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = '#6D28D9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#7C3AED'; }}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
