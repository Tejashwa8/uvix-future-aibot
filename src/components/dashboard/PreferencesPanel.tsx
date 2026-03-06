import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import BotSVG from './BotSVG';
import { ThemeTokens, ThemeName } from '@/hooks/useUvixTheme';
import { S, isSoundOn } from '@/lib/sounds';
import { LS } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const LEVELS = [
  { key: 'beginner', icon: '🌱', label: 'Beginner', desc: 'Simple, step-by-step' },
  { key: 'intermediate', icon: '⚡', label: 'Intermediate', desc: 'Balanced depth' },
  { key: 'professional', icon: '🚀', label: 'Professional', desc: 'Concise, technical' },
] as const;

const FOCUS_AREAS = [
  { key: 'coding', icon: '💻', label: 'AI Coding Assistant', desc: 'Write, refactor and debug code instantly' },
  { key: 'research', icon: '🔬', label: 'AI Research Engine', desc: 'Deep-dive with citation analysis' },
  { key: 'writing', icon: '✍️', label: 'AI Writing Assistant', desc: 'Drafts that match your voice' },
  { key: 'document', icon: '📄', label: 'AI Document Analysis', desc: 'Query PDFs, reports and contracts' },
  { key: 'search', icon: '🔍', label: 'AI Knowledge Search', desc: 'Retrieve precise answers fast' },
] as const;

const THEMES: { key: ThemeName; icon: string; label: string }[] = [
  { key: 'dark', icon: '🌙', label: 'Dark' },
  { key: 'light', icon: '☀️', label: 'Light' },
  { key: 'midnight', icon: '🔮', label: 'Midnight' },
];

interface PreferencesPanelProps {
  t: ThemeTokens;
  themeName: ThemeName;
  onThemeChange: (name: ThemeName) => void;
  onClose: () => void;
  userName: string;
  userEmail: string;
  initials: string;
}

const PreferencesPanel = ({ t, themeName, onThemeChange, onClose, userName: initialName, userEmail: initialEmail, initials }: PreferencesPanelProps) => {
  const { toast } = useToast();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [level, setLevel] = useState(() => LS.get('uvix-level', 'intermediate'));
  const [focus, setFocus] = useState<string[]>(() => LS.get('uvix-focus', FOCUS_AREAS.map(f => f.key)));
  const [soundOn, setSoundOn] = useState(isSoundOn);

  const inputStyle: React.CSSProperties = {
    background: t.input,
    border: `1px solid ${t.border}`,
    color: t.text,
    borderRadius: 7,
    padding: '8px 11px',
    fontSize: 13,
    fontFamily: 'Space Grotesk',
    outline: 'none',
    width: '100%',
    transition: 'border-color .2s',
  };

  const toggleFocus = (key: string) => {
    S.hover();
    setFocus(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleSoundToggle = () => {
    S.hover();
    const next = !soundOn;
    setSoundOn(next);
    localStorage.setItem('uvix-sound', String(next));
  };

  const saveProfile = () => {
    LS.set('uvix-name', name);
    LS.set('uvix-email', email);
    LS.set('uvix-level', level);
    LS.set('uvix-focus', focus);
    setEditingName(false);
    setEditingEmail(false);
    toast({ title: '✓ Preferences saved' });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 z-50 h-screen overflow-y-auto"
        style={{
          width: 325,
          background: t.panel,
          borderLeft: `1px solid ${t.border}`,
          animation: 'slideIn .28s ease',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <BotSVG size={19} ears={false} />
            <span style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 10, color: '#a855f7', letterSpacing: 2 }}>
              PREFERENCES
            </span>
          </div>
          <button onClick={onClose} style={{ color: t.muted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-5">
          {/* User Info Card */}
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 13 }}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
              >
                <span style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 14, color: '#fff' }}>{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                {/* Name */}
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontFamily: 'Orbitron', fontSize: 9, color: '#a855f7', letterSpacing: 2.5 }}>NAME</span>
                  <button
                    onClick={() => setEditingName(!editingName)}
                    style={{ fontSize: 11, color: '#a855f7', fontFamily: 'Space Grotesk', fontWeight: 500 }}
                  >
                    {editingName ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {editingName ? (
                  <input
                    value={name}
                    onChange={e => { S.type(); setName(e.target.value); }}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#a855f7')}
                    onBlur={e => (e.target.style.borderColor = t.border)}
                  />
                ) : (
                  <p style={{ fontSize: 13, color: t.sub }}>{name || 'Not set'}</p>
                )}
              </div>
            </div>
            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontFamily: 'Orbitron', fontSize: 9, color: '#a855f7', letterSpacing: 2.5 }}>EMAIL</span>
                <button
                  onClick={() => setEditingEmail(!editingEmail)}
                  style={{ fontSize: 11, color: '#a855f7', fontFamily: 'Space Grotesk', fontWeight: 500 }}
                >
                  {editingEmail ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {editingEmail ? (
                <input
                  type="email"
                  value={email}
                  onChange={e => { S.type(); setEmail(e.target.value); }}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#a855f7')}
                  onBlur={e => (e.target.style.borderColor = t.border)}
                />
              ) : (
                <p style={{ fontSize: 13, color: t.sub }}>{email || 'Not set'}</p>
              )}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <span style={{ fontFamily: 'Orbitron', fontSize: 9, color: '#a855f7', letterSpacing: 2.5 }}>EXPERIENCE LEVEL</span>
            <p style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>Controls how UVIX responds to you</p>
            <div className="mt-3 space-y-2">
              {LEVELS.map(l => (
                <button
                  key={l.key}
                  onClick={() => { S.hover(); setLevel(l.key); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                  style={{
                    background: level === l.key ? 'rgba(168,85,247,.08)' : t.card,
                    border: `1px solid ${level === l.key ? '#a855f7' : t.border}`,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{l.icon}</span>
                  <div className="flex-1 text-left">
                    <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{l.label}</div>
                    <div style={{ fontSize: 11, color: t.muted }}>{l.desc}</div>
                  </div>
                  {level === l.key && <div className="w-2 h-2 rounded-full bg-[#a855f7]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <span style={{ fontFamily: 'Orbitron', fontSize: 9, color: '#a855f7', letterSpacing: 2.5 }}>FOCUS AREAS</span>
            <p style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>Select your use cases</p>
            <div className="mt-3 space-y-2">
              {FOCUS_AREAS.map(f => {
                const checked = focus.includes(f.key);
                return (
                  <button
                    key={f.key}
                    onClick={() => toggleFocus(f.key)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                    style={{
                      background: checked ? 'rgba(168,85,247,.06)' : 'transparent',
                      border: `1px solid ${checked ? 'rgba(168,85,247,.33)' : t.border}`,
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{f.icon}</span>
                    <div className="flex-1 text-left">
                      <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{f.label}</div>
                      <div style={{ fontSize: 11, color: t.muted }}>{f.desc}</div>
                    </div>
                    <div
                      className="flex items-center justify-center rounded"
                      style={{
                        width: 16,
                        height: 16,
                        background: checked ? '#a855f7' : 'transparent',
                        border: `1.5px solid ${checked ? '#a855f7' : t.border}`,
                      }}
                    >
                      {checked && <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Appearance */}
          <div>
            <span style={{ fontFamily: 'Orbitron', fontSize: 9, color: '#a855f7', letterSpacing: 2.5 }}>APPEARANCE</span>
            <div className="flex gap-1.5 mt-3">
              {THEMES.map(th => (
                <button
                  key={th.key}
                  onClick={() => { S.hover(); onThemeChange(th.key); }}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg transition-colors"
                  style={{
                    background: themeName === th.key ? 'rgba(168,85,247,.1)' : 'transparent',
                    border: `1px solid ${themeName === th.key ? '#a855f7' : t.border}`,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{th.icon}</span>
                  <span style={{ fontSize: 10, color: t.text }}>{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gaming Sounds */}
          <div>
            <span style={{ fontFamily: 'Orbitron', fontSize: 9, color: '#a855f7', letterSpacing: 2.5 }}>GAMING SOUNDS</span>
            <div className="flex items-center justify-between mt-3">
              <div>
                <div style={{ fontSize: 12, color: t.text }}>Enable sounds</div>
                <div style={{ fontSize: 10, color: t.muted }}>Login, logout, send, reply & more</div>
              </div>
              <button
                onClick={handleSoundToggle}
                className="relative rounded-full transition-colors"
                style={{
                  width: 40,
                  height: 22,
                  background: soundOn ? '#a855f7' : t.border,
                }}
              >
                <div
                  className="absolute top-1 rounded-full bg-white transition-all"
                  style={{
                    width: 14,
                    height: 14,
                    left: soundOn ? 23 : 3,
                  }}
                />
              </button>
            </div>
          </div>

          {/* Save */}
          <button
            onClick={saveProfile}
            className="w-full py-3 rounded-lg transition-colors"
            style={{
              background: '#a855f7',
              color: '#fff',
              fontFamily: 'Space Grotesk',
              fontWeight: 600,
              fontSize: 14,
              boxShadow: '0 4px 14px rgba(168,85,247,.25)',
            }}
            onMouseEnter={S.hover}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </>
  );
};

export default PreferencesPanel;
