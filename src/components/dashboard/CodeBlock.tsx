import { useState } from 'react';
import { Copy, Check, Play } from 'lucide-react';
import { ThemeTokens } from '@/hooks/useUvixTheme';
import { S } from '@/lib/sounds';

interface CodeBlockProps {
  code: string;
  language?: string;
  t: ThemeTokens;
  showToast: (msg: string) => void;
}

const CodeBlock = ({ code, language, t, showToast }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast('📋 Code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    if (language !== 'javascript' && language !== 'js' && language !== 'typescript' && language !== 'ts') {
      showToast('⚠️ Only JavaScript/TypeScript can be run in-browser');
      return;
    }
    setRunning(true);
    S.send();
    try {
      const logs: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
        error: (...args: any[]) => logs.push('Error: ' + args.join(' ')),
        warn: (...args: any[]) => logs.push('Warn: ' + args.join(' ')),
      };

      // Simple sandbox using Function constructor
      const fn = new Function('console', code);
      fn(mockConsole);
      setOutput(logs.length > 0 ? logs.join('\n') : '(no output)');
      S.reply();
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
      S.error();
    } finally {
      setRunning(false);
    }
  };

  const isRunnable = ['javascript', 'js', 'typescript', 'ts'].includes(language?.toLowerCase() || '');

  return (
    <div className="rounded-lg overflow-hidden my-2" style={{ border: `1px solid ${t.border}` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5" style={{ background: t.bg, borderBottom: `1px solid ${t.border}` }}>
        <span style={{ fontSize: 11, color: t.muted, fontFamily: 'Space Grotesk', fontWeight: 500 }}>
          {language || 'code'}
        </span>
        <div className="flex items-center gap-1">
          {isRunnable && (
            <button
              onClick={handleRun}
              onMouseEnter={S.hover}
              disabled={running}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors"
              style={{ color: '#22c55e', fontSize: 11, fontFamily: 'Space Grotesk' }}
            >
              <Play className="w-3 h-3" />
              {running ? 'Running...' : 'Run'}
            </button>
          )}
          <button
            onClick={handleCopy}
            onMouseEnter={S.hover}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors"
            style={{ color: t.muted, fontSize: 11, fontFamily: 'Space Grotesk' }}
          >
            {copied ? <Check className="w-3 h-3" style={{ color: '#22c55e' }} /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      {/* Code content */}
      <pre className="overflow-x-auto" style={{ background: 'rgba(0,0,0,.3)', padding: 12, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
        <code>{code}</code>
      </pre>
      {/* Output */}
      {output !== null && (
        <div style={{ borderTop: `1px solid ${t.border}`, background: t.bg, padding: '8px 12px' }}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: 10, color: '#22c55e', fontFamily: 'Space Grotesk', fontWeight: 600 }}>OUTPUT</span>
            <button onClick={() => setOutput(null)} style={{ fontSize: 10, color: t.muted }}>✕</button>
          </div>
          <pre style={{ fontSize: 12, color: t.sub, whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.5 }}>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
