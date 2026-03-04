import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import UvixBotLogo from '@/components/UvixBotLogo';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long');

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0].message;
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0].message;
    if (!isLogin) {
      const nameResult = nameSchema.safeParse(displayName);
      if (!nameResult.success) newErrors.name = nameResult.error.errors[0].message;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({ variant: 'destructive', title: 'Login failed', description: 'Invalid email or password.' });
          } else if (error.message.includes('Email not confirmed')) {
            toast({ variant: 'destructive', title: 'Email not verified', description: 'Please check your inbox and verify your email.' });
          } else {
            toast({ variant: 'destructive', title: 'Login failed', description: error.message });
          }
          return;
        }
        toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/`, data: { display_name: displayName } },
        });
        if (error) {
          if (error.message.includes('already registered')) {
            toast({ variant: 'destructive', title: 'Account exists', description: 'This email is already registered.' });
          } else {
            toast({ variant: 'destructive', title: 'Sign up failed', description: error.message });
          }
          return;
        }
        toast({ title: 'Account created!', description: 'Please check your email to verify your account.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) {
      toast({ variant: 'destructive', title: 'Login failed', description: error.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Subtle ambient glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] opacity-20" style={{ background: '#7C3AED' }} />

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10 flex flex-col items-center">
          <UvixBotLogo size={48} className="mb-4" />
          <h1 className="text-[22px] font-black tracking-[6px] mb-1" style={{ fontFamily: "'Orbitron', sans-serif", color: '#f0f0f0' }}>
            UVIX
          </h1>
          <p className="text-[8px] font-semibold tracking-[4px] uppercase" style={{ fontFamily: "'Orbitron', sans-serif", color: '#a855f7' }}>
            AI Platform
          </p>
          <p className="text-sm tracking-wide mt-3" style={{ color: '#9ca3af' }}>
            {isLogin ? 'Welcome back to UVIX AI' : 'Create your UVIX account'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 border" style={{ background: '#141414', borderColor: '#262626' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <input
                  type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display name"
                  className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-sm"
                  style={{ background: '#0a0a0a', color: '#ffffff', borderColor: errors.name ? '#ef4444' : '#333333' }}
                  onFocus={(e) => { if (!errors.name) e.currentTarget.style.borderColor = '#7C3AED'; }}
                  onBlur={(e) => { if (!errors.name) e.currentTarget.style.borderColor = '#333333'; }}
                />
                {errors.name && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.name}</p>}
              </div>
            )}

            <div>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-sm"
                style={{ background: '#0a0a0a', color: '#ffffff', borderColor: errors.email ? '#ef4444' : '#333333' }}
                onFocus={(e) => { if (!errors.email) e.currentTarget.style.borderColor = '#7C3AED'; }}
                onBlur={(e) => { if (!errors.email) e.currentTarget.style.borderColor = '#333333'; }}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-12 rounded-lg border outline-none transition-colors text-sm"
                  style={{ background: '#0a0a0a', color: '#ffffff', borderColor: errors.password ? '#ef4444' : '#333333' }}
                  onFocus={(e) => { if (!errors.password) e.currentTarget.style.borderColor = '#7C3AED'; }}
                  onBlur={(e) => { if (!errors.password) e.currentTarget.style.borderColor = '#333333'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#6b7280' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.password}</p>}
            </div>

            {isLogin && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs transition-colors" style={{ color: '#7C3AED' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#a78bfa'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#7C3AED'; }}>
                  Forgot password?
                </Link>
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-50"
              style={{ background: '#7C3AED', color: '#ffffff' }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = '#6D28D9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#7C3AED'; }}>
              {isLoading ? 'Please wait...' : isLogin ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px" style={{ background: '#262626' }} />
            <span className="px-4 text-xs" style={{ color: '#6b7280' }}>OR</span>
            <div className="flex-1 h-px" style={{ background: '#262626' }} />
          </div>

          <div className="space-y-3">
            <button onClick={() => handleSocialLogin('google')}
              className="w-full py-3 rounded-lg border text-sm font-medium transition-colors duration-200"
              style={{ background: 'transparent', borderColor: '#333333', color: '#d1d5db' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333333'; e.currentTarget.style.color = '#d1d5db'; }}>
              Continue with Google
            </button>
            <button onClick={() => handleSocialLogin('github')}
              className="w-full py-3 rounded-lg border text-sm font-medium transition-colors duration-200"
              style={{ background: 'transparent', borderColor: '#333333', color: '#d1d5db' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333333'; e.currentTarget.style.color = '#d1d5db'; }}>
              Continue with GitHub
            </button>
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: '#9ca3af' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
              className="font-medium transition-colors" style={{ color: '#7C3AED' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#a78bfa'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#7C3AED'; }}>
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
