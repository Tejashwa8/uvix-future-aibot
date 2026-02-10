import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Bot, User, Download, FileText, FileType, FileSpreadsheet, Image as ImageIcon } from 'lucide-react';
import { AttachedFile } from './FilePreview';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
  files?: AttachedFile[];
}

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return <ImageIcon className="w-3.5 h-3.5 text-accent" />;
  if (ext === 'pdf') return <FileType className="w-3.5 h-3.5 text-destructive" />;
  if (ext === 'doc' || ext === 'docx') return <FileSpreadsheet className="w-3.5 h-3.5 text-primary" />;
  return <FileText className="w-3.5 h-3.5 text-muted-foreground" />;
};

const ChatMessage = ({ role, content, isTyping, files }: ChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-3 animate-fade-in', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-secondary'
            : ''
        )}
        style={!isUser ? {
          background: 'radial-gradient(circle at 30% 30%, #A78BFA, #7C3AED, #4C1D95)',
          boxShadow: '0 0 12px hsl(263 70% 58% / 0.3)',
        } : undefined}
      >
        {isUser ? (
          <User className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-secondary text-secondary-foreground rounded-tr-sm'
            : 'glass-panel rounded-tl-sm border-primary/20'
        )}
      >
        {isTyping ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Uvix is typing</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse delay-75" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse delay-150" />
            </span>
          </div>
        ) : (
          <>
            {isUser && files && files.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {files.map((f, i) => (
                  <div key={i}>
                    {f.preview ? (
                      <img src={f.preview} alt={f.file.name} className="rounded-lg max-w-[200px] max-h-[150px] object-cover border border-border" />
                    ) : (
                      <div className="flex items-center gap-1.5 bg-background/50 rounded-lg px-2.5 py-1.5 border border-border text-xs">
                        {getFileIcon(f.file.name)}
                        <span className="truncate max-w-[120px] text-foreground">{f.file.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            ) : (
              <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <ReactMarkdown
                  components={{
                    p: (props) => <p className="text-sm leading-relaxed mb-2 last:mb-0" {...props} />,
                    ul: (props) => <ul className="list-disc list-inside space-y-1 text-sm mb-2" {...props} />,
                    ol: (props) => <ol className="list-decimal list-inside space-y-1 text-sm mb-2" {...props} />,
                    li: (props) => <li className="text-sm text-foreground" {...props} />,
                    strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
                    code: (props) => <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono text-accent" {...props} />,
                    pre: (props) => <pre className="bg-secondary/80 p-3 rounded-lg overflow-x-auto text-xs mb-2" {...props} />,
                    h1: (props) => <h1 className="text-lg font-bold mb-2 text-foreground font-heading" {...props} />,
                    h2: (props) => <h2 className="text-base font-semibold mb-2 text-foreground font-heading" {...props} />,
                    h3: (props) => <h3 className="text-sm font-semibold mb-1 text-foreground font-heading" {...props} />,
                    a: (props) => <a target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" {...props} />,
                    blockquote: (props) => <blockquote className="border-l-2 border-primary/40 pl-3 italic text-muted-foreground text-sm" {...props} />,
                    img: ({ src, alt }) => (
                      <div className="relative group my-2">
                        <img src={src} alt={alt || 'Generated image'} className="rounded-lg max-w-full" />
                        <a
                          href={src}
                          download="uvix-image.png"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Download className="w-4 h-4 text-foreground" />
                        </a>
                      </div>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
