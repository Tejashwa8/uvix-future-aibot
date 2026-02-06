import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

const ChatMessage = ({ role, content, isTyping }: ChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        'flex gap-4 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
          isUser
            ? 'bg-secondary'
            : 'bg-gradient-to-br from-primary/30 to-accent/30 neon-border box-glow-sm'
        )}
      >
        {isUser ? (
          <User className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Bot className="w-5 h-5 text-primary" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-5 py-3',
          isUser
            ? 'bg-secondary text-secondary-foreground rounded-tr-sm'
            : 'glass-panel neon-border rounded-tl-sm'
        )}
      >
        {isTyping ? (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75" />
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
          </div>
        ) : isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown
              components={{
                p: (props) => (
                  <p className="text-sm leading-relaxed mb-2 last:mb-0" {...props} />
                ),
                ul: (props) => (
                  <ul className="list-disc list-inside space-y-1 text-sm mb-2" {...props} />
                ),
                ol: (props) => (
                  <ol className="list-decimal list-inside space-y-1 text-sm mb-2" {...props} />
                ),
                li: (props) => (
                  <li className="text-sm text-foreground" {...props} />
                ),
                strong: (props) => (
                  <strong className="font-semibold text-primary" {...props} />
                ),
                code: (props) => (
                  <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono text-primary" {...props} />
                ),
                pre: (props) => (
                  <pre className="bg-secondary/80 p-3 rounded-lg overflow-x-auto text-xs mb-2" {...props} />
                ),
                h1: (props) => (
                  <h1 className="text-lg font-bold mb-2 text-foreground" {...props} />
                ),
                h2: (props) => (
                  <h2 className="text-base font-semibold mb-2 text-foreground" {...props} />
                ),
                h3: (props) => (
                  <h3 className="text-sm font-semibold mb-1 text-foreground" {...props} />
                ),
                a: (props) => (
                  <a target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" {...props} />
                ),
                blockquote: (props) => (
                  <blockquote className="border-l-2 border-primary/50 pl-3 italic text-muted-foreground text-sm" {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
