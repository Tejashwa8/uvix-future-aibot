import { useState, useMemo } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { ThemeTokens } from '@/hooks/useUvixTheme';
import { S } from '@/lib/sounds';
import { LS } from '@/lib/storage';

interface ConvoItem {
  id: number;
  title: string;
  date: string;
  messages: any[];
}

interface DashboardSidebarProps {
  t: ThemeTokens;
  open: boolean;
  convos: ConvoItem[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onNew: () => void;
  onDelete: (id: number) => void;
  onDeleteAll: () => void;
  level: string;
  userName: string;
  showToast: (msg: string) => void;
}

const groupByDate = (convos: ConvoItem[]) => {
  const today = new Date().toDateString();
  const groups: Record<string, ConvoItem[]> = {};
  convos.forEach(c => {
    const d = new Date(c.date).toDateString();
    const label = d === today ? 'Today' : new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!groups[label]) groups[label] = [];
    groups[label].push(c);
  });
  return groups;
};

const DashboardSidebar = ({ t, open, convos, activeId, onSelect, onNew, onDelete, onDeleteAll, level, userName, showToast }: DashboardSidebarProps) => {
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const grouped = useMemo(() => groupByDate(convos), [convos]);

  return (
    <>
      <div
        className="flex flex-col h-full flex-shrink-0 overflow-hidden"
        style={{
          width: open ? 232 : 0,
          transition: 'width .25s ease',
          background: t.panel,
          borderRight: open ? `1px solid ${t.border}` : 'none',
        }}
      >
        {/* Top actions */}
        <div className="flex items-center gap-1.5 p-2.5" style={{ padding: '11px 10px 8px' }}>
          <button
            onClick={onNew}
            onMouseEnter={S.hover}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white transition-colors"
            style={{ background: '#a855f7', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13 }}
          >
            <Plus className="w-3.5 h-3.5" /> New Chat
          </button>
          {convos.length > 0 && (
            <button
              onClick={() => setConfirmDeleteAll(true)}
              onMouseEnter={S.hover}
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
              style={{ border: `1px solid ${t.border}`, color: t.muted }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Convo list */}
        <div className="flex-1 overflow-y-auto px-2 py-0.5" style={{ scrollbarWidth: 'thin' }}>
          {Object.entries(grouped).map(([label, items]) => (
            <div key={label} className="mb-2">
              <div style={{ fontSize: 9, color: t.muted, textTransform: 'uppercase', letterSpacing: 2, padding: '4px 8px' }}>
                {label}
              </div>
              {items.map(c => (
                <div
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className="group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: activeId === c.id ? 'rgba(168,85,247,.1)' : 'transparent',
                    borderLeft: activeId === c.id ? '2px solid #a855f7' : '2px solid transparent',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 12, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.title}
                    </div>
                    <div style={{ fontSize: 10, color: t.muted }}>{c.messages.length} msg{c.messages.length !== 1 ? 's' : ''}</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(c.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: t.muted }}
                    onMouseOver={e => (e.currentTarget.style.color = '#f87171')}
                    onMouseOut={e => (e.currentTarget.style.color = t.muted)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderTop: `1px solid ${t.border}` }}>
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{ width: 26, height: 26, background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            <span style={{ fontFamily: 'Orbitron', fontSize: 8, fontWeight: 700, color: '#fff' }}>
              {userName.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span style={{ fontSize: 12, color: t.text }}>{userName}</span>
          <span style={{ fontSize: 10, color: '#a855f7', marginLeft: 'auto' }}>{level}</span>
        </div>
      </div>

      {/* Delete All Modal */}
      {confirmDeleteAll && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(3px)' }}
          onClick={() => setConfirmDeleteAll(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: t.panel,
              border: '1px solid rgba(248,113,113,.33)',
              borderRadius: 14,
              padding: 28,
              maxWidth: 340,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>🗑️</div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 13, color: t.text, marginBottom: 8 }}>Delete All?</div>
            <p style={{ fontSize: 13, color: t.sub, lineHeight: 1.6, marginBottom: 20 }}>
              This will permanently delete all your conversations. This cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmDeleteAll(false)}
                className="px-5 py-2 rounded-lg"
                style={{ border: `1px solid ${t.border}`, color: t.sub, fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  S.error();
                  onDeleteAll();
                  setConfirmDeleteAll(false);
                  showToast('🗑 All conversations deleted');
                }}
                className="px-5 py-2 rounded-lg text-white"
                style={{ background: '#f87171', fontSize: 13 }}
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardSidebar;
export type { ConvoItem };
