import { Code2, Bug, Swords, BookOpen } from 'lucide-react';
import { ThemeTokens } from '@/hooks/useUvixTheme';
import { S } from '@/lib/sounds';

interface CodingToolbarProps {
  t: ThemeTokens;
  onAction: (prompt: string, mode?: string) => void;
}

const tools = [
  { icon: <Bug className="w-3.5 h-3.5" />, label: 'Code Review', prompt: 'Please review my code. I\'ll paste it next.', mode: 'code-review' },
  { icon: <Swords className="w-3.5 h-3.5" />, label: 'Challenge', prompt: 'Give me a coding challenge. Pick a random difficulty (Easy/Medium/Hard) and topic.', mode: 'challenge' },
  { icon: <Code2 className="w-3.5 h-3.5" />, label: 'Debug', prompt: 'Help me debug this code. I\'ll paste the code and error next.' },
  { icon: <BookOpen className="w-3.5 h-3.5" />, label: 'Explain', prompt: 'Explain this concept or code step by step. I\'ll describe what I need next.' },
];

const CodingToolbar = ({ t, onAction }: CodingToolbarProps) => {
  return (
    <div className="flex items-center gap-1.5 px-4 py-1.5 overflow-x-auto" style={{ borderBottom: `1px solid ${t.border}` }}>
      <span style={{ fontSize: 10, color: t.muted, fontFamily: 'Orbitron', fontWeight: 700, letterSpacing: 1, marginRight: 4 }}>TOOLS</span>
      {tools.map(tool => (
        <button
          key={tool.label}
          onClick={() => { S.hover(); onAction(tool.prompt, tool.mode); }}
          onMouseEnter={S.hover}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-all"
          style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            color: t.sub,
            fontFamily: 'Space Grotesk',
            fontWeight: 500,
            fontSize: 11,
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.color = '#a855f7'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.sub; }}
        >
          {tool.icon}
          {tool.label}
        </button>
      ))}
    </div>
  );
};

export default CodingToolbar;
