import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, Mic, X } from 'lucide-react';
import { ThemeTokens } from '@/hooks/useUvixTheme';
import { S } from '@/lib/sounds';

interface Attachment {
  name: string;
  size: number;
  type: string;
  file: File;
}

interface DashboardInputBarProps {
  t: ThemeTokens;
  input: string;
  setInput: (v: string) => void;
  loading: boolean;
  sendMessage: (attachments?: Attachment[]) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

const formatSize = (bytes: number) => (bytes / 1024).toFixed(1) + ' KB';

const DashboardInputBar = ({ t, input, setInput, loading, sendMessage, inputRef }: DashboardInputBarProps) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [listening, setListening] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input, inputRef]);

  const doSend = () => {
    if ((!input.trim() && !attachments.length) || loading) return;
    sendMessage(attachments);
    setAttachments([]);
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map(f => ({ name: f.name, size: f.size, type: f.type, file: f }));
    setAttachments(prev => [...prev, ...mapped].slice(0, 5));
    if (fileRef.current) fileRef.current.value = '';
  };

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Speech recognition not supported in this browser.'); return; }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(input ? input + ' ' + transcript : transcript);
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const iconBtnStyle = (active = false): React.CSSProperties => ({
    border: `1px solid ${active ? '#a855f7' : t.border}`,
    background: active ? 'rgba(168,85,247,.15)' : 'transparent',
    color: active ? '#a855f7' : t.muted,
    borderRadius: 8,
    width: 34,
    height: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .2s',
    flexShrink: 0,
  });

  const getIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    return '📎';
  };

  return (
    <div style={{ padding: '10px 14px 12px' }}>
      {/* Attachments row */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {attachments.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ background: 'rgba(168,85,247,.08)', border: '1px solid rgba(168,85,247,.33)', fontSize: 12 }}
            >
              <span>{getIcon(a.type)}</span>
              <span style={{ maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: t.text }}>{a.name}</span>
              <span style={{ color: t.muted, fontSize: 10 }}>{formatSize(a.size)}</span>
              <button
                onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
                style={{ color: t.muted }}
                onMouseOver={e => (e.currentTarget.style.color = '#f87171')}
                onMouseOut={e => (e.currentTarget.style.color = t.muted)}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Listening banner */}
      {listening && (
        <div className="flex items-center gap-2 mb-2" style={{ padding: '5px 0' }}>
          <div className="w-2 h-2 rounded-full bg-red-500" style={{ animation: 'dotBounce .6s ease infinite' }} />
          <span style={{ fontSize: 12, color: '#f87171', fontWeight: 700 }}>Listening… speak now</span>
          <span style={{ fontSize: 11, color: t.muted }}>(tap mic to stop)</span>
        </div>
      )}

      {/* Main row */}
      <div className="flex items-end gap-1.5">
        <button style={iconBtnStyle()} onClick={() => fileRef.current?.click()} onMouseEnter={S.hover}>
          <Paperclip className="w-4 h-4" />
        </button>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileChange} />

        <button style={iconBtnStyle(listening)} onClick={toggleVoice} onMouseEnter={S.hover}>
          <Mic className="w-4 h-4" style={listening ? { color: '#f87171' } : undefined} />
        </button>

        <textarea
          ref={inputRef as any}
          value={input}
          onChange={e => { S.type(); setInput(e.target.value); }}
          onKeyDown={handleKeyDown}
          placeholder={listening ? 'Speaking… or type here' : 'Ask UVIX anything… (Enter to send)'}
          rows={1}
          className="flex-1 resize-none outline-none"
          style={{
            background: t.input,
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 14,
            lineHeight: 1.6,
            color: t.text,
            fontFamily: 'Space Grotesk',
            maxHeight: 120,
            transition: 'border-color .2s',
          }}
          onFocus={e => (e.target.style.borderColor = '#a855f7')}
          onBlur={e => (e.target.style.borderColor = t.border)}
        />

        <button
          onClick={doSend}
          disabled={(!input.trim() && !attachments.length) || loading}
          onMouseEnter={S.hover}
          className="rounded-lg transition-colors"
          style={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: (input.trim() || attachments.length) && !loading ? '#a855f7' : undefined,
            opacity: (input.trim() || attachments.length) && !loading ? 1 : 0.35,
            cursor: (input.trim() || attachments.length) && !loading ? 'pointer' : 'not-allowed',
            flexShrink: 0,
          }}
        >
          <Send className="w-4 h-4" style={{ color: (input.trim() || attachments.length) && !loading ? '#fff' : t.muted }} />
        </button>
      </div>
    </div>
  );
};

export default DashboardInputBar;
export type { Attachment };
