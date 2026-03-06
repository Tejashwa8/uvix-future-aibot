import { LogOut, PanelLeftClose, PanelLeft } from 'lucide-react';
import BotSVG from './BotSVG';
import { ThemeTokens } from '@/hooks/useUvixTheme';
import { S } from '@/lib/sounds';

interface DashboardNavbarProps {
  t: ThemeTokens;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  initials: string;
  onAvatarClick: () => void;
  onLogout: () => void;
}

const DashboardNavbar = ({ t, sidebarOpen, onToggleSidebar, initials, onAvatarClick, onLogout }: DashboardNavbarProps) => {
  return (
    <div
      className="flex items-center justify-between px-[6%] flex-shrink-0"
      style={{
        height: 54,
        background: t.panel,
        borderBottom: `1px solid ${t.border}`,
        transition: 'background .3s',
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          onMouseEnter={S.hover}
          className="flex items-center justify-center w-8 h-8 rounded-md transition-colors"
          style={{ border: `1px solid ${t.border}`, color: t.muted }}
        >
          {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </button>

        <BotSVG size={26} ears={true} />

        <div className="flex items-baseline gap-1">
          <span style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 13, letterSpacing: 4, color: t.text }}>
            UVIX
          </span>
          <span style={{ fontFamily: 'Orbitron', fontSize: 9, color: '#a855f7', letterSpacing: 2, opacity: 0.7 }}>
            AI
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onAvatarClick}
          onMouseEnter={S.hover}
          className="flex items-center justify-center rounded-full transition-transform hover:scale-105"
          style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            boxShadow: '0 2px 10px rgba(168,85,247,.3)',
          }}
        >
          <span style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 11, color: '#fff' }}>
            {initials}
          </span>
        </button>

        <button
          onClick={() => { S.logout(); onLogout(); }}
          onMouseEnter={S.hover}
          className="flex items-center justify-center w-8 h-8 rounded-md transition-colors"
          style={{ border: `1px solid ${t.border}`, color: t.muted }}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DashboardNavbar;
