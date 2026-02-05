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
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
