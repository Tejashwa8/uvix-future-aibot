import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="relative">
      {/* Glow effect behind input */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl opacity-50" />
      
      <div className="relative glass-panel neon-border rounded-2xl p-2 flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Vivix anything..."
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full bg-transparent text-foreground placeholder:text-muted-foreground',
              'resize-none outline-none px-4 py-3 text-sm leading-relaxed',
              'scrollbar-thin scrollbar-thumb-primary/20'
            )}
          />
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          className={cn(
            'flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center',
            'transition-all duration-300',
            input.trim() && !disabled
              ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground box-glow hover:scale-105'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          {disabled ? (
            <Sparkles className="w-5 h-5 animate-pulse" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
