import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, LogOut, Menu, User, PanelLeftClose, PanelLeft, Send } from 'lucide-react';
import type { AttachedFile } from './FilePreview';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ConversationSidebar from './ConversationSidebar';
import { ThemeToggle } from './ThemeToggle';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { useConversations, Message } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "How can I assist you today?",
  created_at: new Date().toISOString(),
};

const VivixChat = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const {
    conversations,
    isLoading: conversationsLoading,
    createConversation,
    deleteConversation,
    deleteAllConversations,
    getMessages,
    saveMessage,
    updateConversationTitle,
  } = useConversations();
  
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, sendMessage, setMessages } = useStreamingChat([INITIAL_MESSAGE]);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    };
    loadProfile();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = useCallback(async (conversationId: string) => {
    const msgs = await getMessages(conversationId);
    if (msgs.length > 0) {
      setMessages(msgs.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
      })));
    } else {
      setMessages([INITIAL_MESSAGE]);
    }
    setActiveConversationId(conversationId);
    setSidebarOpen(false);
  }, [getMessages, setMessages]);

  const handleNewConversation = useCallback(async () => {
    const newId = await createConversation();
    if (newId) {
      setActiveConversationId(newId);
      setMessages([INITIAL_MESSAGE]);
      setSidebarOpen(false);
    }
  }, [createConversation, setMessages]);

  const handleDeleteConversation = useCallback(async (id: string) => {
    await deleteConversation(id);
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setMessages([INITIAL_MESSAGE]);
    }
  }, [deleteConversation, activeConversationId, setMessages]);

  const handleDeleteAllConversations = useCallback(async () => {
    await deleteAllConversations();
    setActiveConversationId(null);
    setMessages([INITIAL_MESSAGE]);
  }, [deleteAllConversations, setMessages]);

  const handleRenameConversation = useCallback(async (id: string, title: string) => {
    await updateConversationTitle(id, title);
  }, [updateConversationTitle]);

  const handleSendMessage = useCallback(async (content: string, files?: AttachedFile[]) => {
    let conversationId = activeConversationId;

    if (!conversationId) {
      conversationId = await createConversation(content.slice(0, 50));
      if (!conversationId) return;
      setActiveConversationId(conversationId);
    } else {
      const currentMsgs = messages.filter(m => m.role === 'user');
      if (currentMsgs.length === 0) {
        await updateConversationTitle(conversationId, content.slice(0, 50));
      }
    }

    const displayContent = files && files.length > 0
      ? `${content}\n\n📎 ${files.map(f => f.file.name).join(', ')}`
      : content;

    await saveMessage(conversationId, 'user', displayContent);
    await sendMessage(content, files);
  }, [activeConversationId, createConversation, saveMessage, sendMessage, messages, updateConversationTitle]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      activeConversationId &&
      lastMessage?.role === 'assistant' &&
      lastMessage.content &&
      !isLoading &&
      lastMessage.id !== '1'
    ) {
      saveMessage(activeConversationId, 'assistant', lastMessage.content);
    }
  }, [isLoading, messages, activeConversationId, saveMessage]);

  const SidebarContent = (
    <ConversationSidebar
      conversations={conversations}
      activeId={activeConversationId}
      isLoading={conversationsLoading}
      onSelect={loadConversation}
      onNew={handleNewConversation}
      onDelete={handleDeleteConversation}
      onRename={handleRenameConversation}
      onDeleteAll={handleDeleteAllConversations}
    />
  );

  return (
    <div className="flex h-full">
      {!isMobile && desktopSidebarOpen && SidebarContent}

      <div className="flex flex-col flex-1 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex-shrink-0 py-5 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMobile ? (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="mr-2">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-64">
                    {SidebarContent}
                  </SheetContent>
                </Sheet>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => setDesktopSidebarOpen((prev) => !prev)}
                >
                  {desktopSidebarOpen ? (
                    <PanelLeftClose className="h-5 w-5" />
                  ) : (
                    <PanelLeft className="h-5 w-5" />
                  )}
                </Button>
              )}
              
              <div className="relative">
                <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl animate-pulse" />
                <div className="relative w-12 h-12 rounded-full flex items-center justify-center animate-glow-pulse" style={{ background: 'var(--gradient-neon)' }}>
                  <Bot className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading gradient-text">
                  Uvix
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-accent" />
                  Premium AI Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl || undefined} />
                        <AvatarFallback className="bg-secondary text-muted-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-4 scrollbar-thin scrollbar-thumb-primary/20">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              files={message.files}
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
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          <p className="text-center text-xs text-muted-foreground mt-3">
            Uvix may occasionally make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VivixChat;
