import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Pencil, Copy, Trash2, Download } from 'lucide-react';
import BotSVG from './BotSVG';
import { ThemeTokens } from '@/hooks/useUvixTheme';
import { S } from '@/lib/sounds';

interface MessageData {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  edited?: boolean;
}

interface MessageBubbleProps {
  m: MessageData;
  t: ThemeTokens;
  initials: string;
  onDelete: () => void;
  onEdit: (newText: string) => void;
  showToast: (msg: string) => void;
}

const ActionBtn = ({ icon, onClick, danger, t }: { icon: React.ReactNode; onClick: () => void; danger?: boolean; t: ThemeTokens }) => (
  <button
    onClick={onClick}
    onMouseEnter={S.hover}
    className="flex items-center justify-center w-6 h-6 rounded transition-colors"
    style={{ color: danger ? t.muted : t.muted }}
    onMouseOver={e => { (e.currentTarget.style.color = danger ? '#f87171' : '#a855f7'); }}
    onMouseOut={e => { (e.currentTarget.style.color = t.muted); }}
  >
    {icon}
  </button>
);

const MessageBubble = ({ m, t, initials, onDelete, onEdit, showToast }: MessageBubbleProps) => {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(m.text);
  const isUser = m.role === 'user';

  const saveEdit = () => {
    if (draft.trim() && draft.trim() !== m.text) {
      onEdit(draft.trim());
      S.send();
    }
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(m.text);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div
      className="flex gap-2"
      style={{
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        animation: 'fadeUp .4s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      {isUser ? (
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{
            width: 22,
            height: 22,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            marginBottom: 20,
          }}
        >
          <span style={{ fontFamily: 'Orbitron', fontSize: 8, fontWeight: 700, color: '#fff' }}>{initials}</span>
        </div>
      ) : (
        <div className="flex-shrink-0" style={{ marginBottom: 20 }}>
          <BotSVG size={22} ears={false} />
        </div>
      )}

      {/* Content */}
      <div className="relative max-w-[75%]">
        {/* Action bar */}
        <div
          className="absolute flex gap-0.5 rounded-lg z-10"
          style={{
            top: -28,
            [isUser ? 'right' : 'left']: 0,
            opacity: hovered && !editing ? 1 : 0,
            transition: 'opacity .15s',
            background: t.card,
            border: `1px solid ${t.border}`,
            padding: '2px 4px',
          }}
        >
          {isUser && <ActionBtn icon={<Pencil className="w-3 h-3" />} onClick={() => { setDraft(m.text); setEditing(true); }} t={t} />}
          <ActionBtn
            icon={<Copy className="w-3 h-3" />}
            onClick={() => { navigator.clipboard.writeText(m.text); showToast('📋 Copied to clipboard'); }}
            t={t}
          />
          <ActionBtn icon={<Trash2 className="w-3 h-3" />} onClick={() => { onDelete(); showToast('Message deleted'); }} danger t={t} />
        </div>

        {/* Bubble */}
        {editing ? (
          <div>
            <textarea
              value={draft}
              onChange={e => { S.type(); setDraft(e.target.value); }}
              onKeyDown={handleKeyDown}
              className="w-full resize-none outline-none"
              style={{
                border: '1px solid #a855f7',
                background: 'rgba(124,58,237,.15)',
                color: t.text,
                borderRadius: 10,
                padding: '10px 12px',
                fontSize: 14,
                lineHeight: 1.75,
                fontFamily: 'Space Grotesk',
                minHeight: 60,
              }}
              autoFocus
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button
                onClick={cancelEdit}
                className="px-3 py-1.5 rounded-md text-xs"
                style={{ border: `1px solid ${t.border}`, color: t.sub, fontFamily: 'Space Grotesk' }}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-3 py-1.5 rounded-md text-xs"
                style={{ background: '#a855f7', color: '#fff', fontFamily: 'Space Grotesk' }}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: isUser ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : t.card,
              border: isUser ? 'none' : `1px solid ${t.border}`,
              borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              color: isUser ? '#fff' : t.text,
              boxShadow: isUser ? '0 3px 12px rgba(168,85,247,.22)' : 'none',
              padding: '10px 14px',
              fontSize: 14,
              lineHeight: 1.75,
              wordBreak: 'break-word',
            }}
          >
            {isUser ? (
              <p style={{ whiteSpace: 'pre-wrap' }}>{m.text}</p>
            ) : (
              <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <ReactMarkdown
                  components={{
                    p: (props) => <p style={{ fontSize: 14, lineHeight: 1.75, marginBottom: 8 }} {...props} />,
                    code: (props) => <code style={{ background: 'rgba(168,85,247,.15)', padding: '2px 6px', borderRadius: 4, fontSize: 13 }} {...props} />,
                    pre: (props) => <pre style={{ background: 'rgba(0,0,0,.3)', padding: 12, borderRadius: 8, overflowX: 'auto', fontSize: 13, marginBottom: 8 }} {...props} />,
                    strong: (props) => <strong style={{ color: t.text }} {...props} />,
                    a: (props) => <a target="_blank" rel="noopener noreferrer" style={{ color: '#a855f7' }} {...props} />,
                    ul: (props) => <ul style={{ listStyle: 'disc', paddingLeft: 20, marginBottom: 8 }} {...props} />,
                    ol: (props) => <ol style={{ listStyle: 'decimal', paddingLeft: 20, marginBottom: 8 }} {...props} />,
                    img: ({ src, alt }) => (
                      <div className="relative group my-2">
                        <img src={src} alt={alt || 'Generated image'} className="rounded-lg max-w-full" />
                        <a href={src} download target="_blank" rel="noopener noreferrer"
                          className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="w-4 h-4 text-white" />
                        </a>
                      </div>
                    ),
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 mt-1" style={{ justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
          {m.edited && <span style={{ fontSize: 9, color: t.muted, fontStyle: 'italic' }}>edited</span>}
          <span style={{ fontSize: 10, color: t.muted }}>{m.time}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
