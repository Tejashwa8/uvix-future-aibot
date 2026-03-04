import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
        return;
      }
      setSent(true);
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
          {sent ? (
            <div className="text-center space-y-4">
              <h2 className="text-lg font-semibold" style={{ color: '#ffffff' }}>Check your email</h2>
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                We sent a password reset link to <span style={{ color: '#ffffff' }}>{email}</span>
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors mt-4"
                style={{ color: '#7C3AED' }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-1" style={{ color: '#ffffff' }}>Reset your password</h2>
              <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-sm"
                    style={{ background: '#0a0a0a', color: '#ffffff', borderColor: error ? '#ef4444' : '#333333' }}
                    onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = '#7C3AED'; }}
                    onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = '#333333'; }}
                  />
                  {error && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-50"
                  style={{ background: '#7C3AED', color: '#ffffff' }}
                  onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = '#6D28D9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#7C3AED'; }}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 text-sm transition-colors"
                  style={{ color: '#7C3AED' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
