import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import UvixBotLogo from '@/components/UvixBotLogo';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long');

type Page = 'login' | 'signup' | 'forgot';

const inputStyle = {
  background: '#1c1c1c',
  color: '#ffffff',
  borderColor: '#2a2a2a',
};
const inputFocusBorder = '#a855f7';
const inputErrorBorder = '#f87171';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  rightElement,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  rightElement?: React.ReactNode;
}) => (
  <div>
    <label className="block text-[12px] font-medium tracking-[0.4px] mb-1.5" style={{ color: '#666', fontFamily: "'Space Grotesk', sans-serif" }}>
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-sm"
        style={{ ...inputStyle, borderColor: error ? inputErrorBorder : inputStyle.borderColor, fontFamily: "'Space Grotesk', sans-serif" }}
        onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = inputFocusBorder; e.currentTarget.style.boxShadow = 'rgba(168,85,247,.10) 0 0 0 2px'; }}
        onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = inputStyle.borderColor; e.currentTarget.style.boxShadow = 'none'; }}
      />
      {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
    </div>
    {error && <p className="text-[12px] mt-1" style={{ color: '#f87171' }}>{error}</p>}
  </div>
);


const getPasswordStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#a855f7'];
  return { score, label: labels[score], color: colors[score] };
};

const Auth = () => {
  const [page, setPage] = useState<Page>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [forgotSent, setForgotSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const changePage = (p: Page) => {
    setPage(p);
    setErrors({});
    setForgotSent(false);
  };

  const handleLogin = async () => {
    const errs: Record<string, string> = {};
    if (!emailSchema.safeParse(email).success) errs.email = 'Please enter a valid email address';
    if (!passwordSchema.safeParse(password).success) errs.password = 'Password must be at least 6 characters';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = error.message.includes('Invalid login') ? 'Invalid email or password.' : error.message.includes('Email not confirmed') ? 'Please verify your email first.' : error.message;
        toast({ variant: 'destructive', title: 'Login failed', description: msg });
        return;
      }
      navigate('/');
    } finally { setIsLoading(false); }
  };

  const handleSignup = async () => {
    const errs: Record<string, string> = {};
    if (!nameSchema.safeParse(displayName).success) errs.name = 'Name must be at least 2 characters';
    if (!emailSchema.safeParse(email).success) errs.email = 'Please enter a valid email address';
    if (!passwordSchema.safeParse(password).success) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/`, data: { display_name: displayName } },
      });
      if (error) {
        toast({ variant: 'destructive', title: 'Sign up failed', description: error.message.includes('already registered') ? 'This email is already registered.' : error.message });
        return;
      }
      toast({ title: 'Account created!', description: 'Please check your email to verify your account.' });
    } finally { setIsLoading(false); }
  };

  const handleForgot = async () => {
    if (!emailSchema.safeParse(email).success) { setErrors({ email: 'Please enter a valid email address' }); return; }
    setErrors({});
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      if (error) { toast({ variant: 'destructive', title: 'Error', description: error.message }); return; }
      setForgotSent(true);
    } finally { setIsLoading(false); }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (page === 'login') handleLogin();
    else if (page === 'signup') handleSignup();
    else handleForgot();
  };

  const ToggleEye = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button type="button" onClick={toggle} className="text-[12px] transition-colors" style={{ color: '#444' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#888'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = '#444'; }}>
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: '#121212' }}>
      <div className="w-full max-w-[400px]" key={page}>
        {/* Logo block */}
        <div className="text-center mb-9 flex flex-col items-center">
          <UvixBotLogo size={64} showEars className="mb-4" />
          <h1 className="font-black tracking-[6px] text-[22px] mb-1" style={{ fontFamily: "'Orbitron', sans-serif", color: '#f0f0f0' }}>UVIX</h1>
          <p className="font-semibold text-[8px] tracking-[4px] uppercase" style={{ fontFamily: "'Orbitron', sans-serif", color: '#a855f7' }}>AI Platform</p>
        </div>

        {/* Card */}
        <div className="rounded-[14px] border" style={{ background: '#181818', borderColor: '#202020', padding: '40px 36px' }}>
          {/* Subtitle */}
          <p className="text-[13px] text-center mb-6" style={{ color: '#555', fontFamily: "'Space Grotesk', sans-serif" }}>
            {page === 'login' && 'Sign in to continue to your workspace'}
            {page === 'signup' && 'Start building with UVIX AI'}
            {page === 'forgot' && "We'll send a link to your inbox"}
          </p>

          {page === 'forgot' && forgotSent ? (
            <div>
              <div className="rounded-lg p-3.5 mb-4" style={{ background: '#1a0d2e', border: '1px solid #6b21a8' }}>
                <p className="text-[13px]" style={{ color: '#d8b4fe' }}>✓ We sent a reset link to <strong>{email}</strong>. Check your inbox and follow the link to reset your password.</p>
              </div>
              <button onClick={() => changePage('login')} className="w-full py-3 rounded-lg font-medium text-sm" style={{ background: '#a855f7', color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Social buttons for login/signup */}

              {page === 'signup' && (
                <Input label="Full name" value={displayName} onChange={setDisplayName} placeholder="Jane Doe" error={errors.name} />
              )}

              <Input
                label={page === 'signup' ? 'Work email' : 'Email address'}
                type="email" value={email} onChange={setEmail} placeholder="you@company.com" error={errors.email}
              />

              {page === 'forgot' && (
                <p className="text-[13px] leading-[1.6]" style={{ color: '#555' }}>
                  Enter your email and we'll send you a reset link right away.
                </p>
              )}

              {page !== 'forgot' && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[12px] font-medium tracking-[0.4px]" style={{ color: '#666', fontFamily: "'Space Grotesk', sans-serif" }}>Password</label>
                      {page === 'login' && (
                        <button type="button" onClick={() => changePage('forgot')} className="text-[12px] font-medium transition-colors"
                          style={{ color: '#888', fontFamily: "'Space Grotesk', sans-serif" }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#a855f7'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; }}>
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-10 rounded-lg border outline-none transition-all text-sm"
                        style={{ ...inputStyle, borderColor: errors.password ? inputErrorBorder : inputStyle.borderColor, fontFamily: "'Space Grotesk', sans-serif" }}
                        onFocus={(e) => { if (!errors.password) e.currentTarget.style.borderColor = inputFocusBorder; }}
                        onBlur={(e) => { if (!errors.password) e.currentTarget.style.borderColor = inputStyle.borderColor; }}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <ToggleEye show={showPassword} toggle={() => setShowPassword(!showPassword)} />
                      </div>
                    </div>
                    {errors.password && <p className="text-[12px] mt-1" style={{ color: '#f87171' }}>{errors.password}</p>}
                  </div>

                  {/* Password strength for signup */}
                  {page === 'signup' && password.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-[2px] rounded-full" style={{ background: '#222' }}>
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(strength.score / 4) * 100}%`, background: strength.color }} />
                      </div>
                      <span className="text-[11px] font-medium" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                  )}

                  {page === 'signup' && (
                    <div>
                      <div className="relative">
                        <input
                          type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          className="w-full px-4 py-3 pr-10 rounded-lg border outline-none transition-all text-sm"
                          style={{ ...inputStyle, borderColor: errors.confirm ? inputErrorBorder : inputStyle.borderColor, fontFamily: "'Space Grotesk', sans-serif" }}
                          onFocus={(e) => { if (!errors.confirm) e.currentTarget.style.borderColor = inputFocusBorder; }}
                          onBlur={(e) => { if (!errors.confirm) e.currentTarget.style.borderColor = inputStyle.borderColor; }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <ToggleEye show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
                        </div>
                      </div>
                      {errors.confirm && <p className="text-[12px] mt-1" style={{ color: '#f87171' }}>{errors.confirm}</p>}
                      {passwordsMatch && <p className="text-[12px] mt-1 flex items-center gap-1" style={{ color: '#a855f7' }}><Check className="w-3 h-3" /> Passwords match</p>}
                    </div>
                  )}
                </>
              )}

              <button type="submit" disabled={isLoading}
                className="w-full py-3 rounded-lg font-medium text-sm tracking-wide transition-colors duration-200 disabled:opacity-50"
                style={{ background: '#a855f7', color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}
                onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = '#9333ea'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#a855f7'; }}>
                {isLoading ? 'Please wait...' : page === 'login' ? 'Sign in' : page === 'signup' ? 'Create account' : 'Send reset link'}
              </button>

              {page === 'signup' && (
                <p className="text-[11px] text-center" style={{ color: '#3d3d3d' }}>
                  By signing up you agree to our <a href="#" style={{ color: '#a855f7' }}>Terms</a> and <a href="#" style={{ color: '#a855f7' }}>Privacy Policy</a>
                </p>
              )}

              {page === 'forgot' && (
                <button type="button" onClick={() => changePage('login')} className="flex items-center gap-1.5 mx-auto text-sm font-medium transition-colors" style={{ color: '#a855f7' }}>
                  <ArrowLeft className="w-4 h-4" /> Back to sign in
                </button>
              )}
            </form>
          )}

          {/* Bottom toggle */}
          {page !== 'forgot' && (
            <p className="text-center mt-6 text-[13px]" style={{ color: '#555', fontFamily: "'Space Grotesk', sans-serif" }}>
              {page === 'login' ? 'No account? ' : 'Already have an account? '}
              <button type="button" onClick={() => changePage(page === 'login' ? 'signup' : 'login')}
                className="font-medium transition-colors" style={{ color: '#a855f7' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#c084fc'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#a855f7'; }}>
                {page === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-[12px]" style={{ color: '#333' }}>
          © 2026 UVIX AI · <a href="#" style={{ color: '#333' }}>Privacy</a> · <a href="#" style={{ color: '#333' }}>Terms</a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
