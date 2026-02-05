import { useRef, useEffect } from 'react';
import { Bot, Sparkles, LogOut } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "Hello. I'm Vivax — your intelligent assistant. I'm here to help with questions, writing, learning, and more. How can I assist you today?",
};

const VivaxChat = () => {
  const { messages, isLoading, sendMessage } = useStreamingChat([INITIAL_MESSAGE]);
  const { user, signOut } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex-shrink-0 py-6 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/50 rounded-full blur-xl animate-pulse" />
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center box-glow">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-glow bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Vivax
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Premium AI Assistant
              </p>
            </div>
          </div>

          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-4 scrollbar-thin scrollbar-thumb-primary/20">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}
        
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <ChatMessage
            role="assistant"
            content=""
            isTyping
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 pt-2">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
        <p className="text-center text-xs text-muted-foreground mt-3">
          Vivax may occasionally make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default VivaxChat;
