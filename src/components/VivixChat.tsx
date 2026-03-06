import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUvixTheme } from '@/hooks/useUvixTheme';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { useConversations } from '@/hooks/useConversations';
import { LS } from '@/lib/storage';
import { S } from '@/lib/sounds';
import DashboardNavbar from './dashboard/DashboardNavbar';
import DashboardSidebar, { ConvoItem } from './dashboard/DashboardSidebar';
import DashboardInputBar, { Attachment } from './dashboard/DashboardInputBar';
import MessageBubble from './dashboard/MessageBubble';
import PreferencesPanel from './dashboard/PreferencesPanel';
import UvixToast from './dashboard/UvixToast';
import BotSVG from './dashboard/BotSVG';
import type { AttachedFile } from './FilePreview';

const SUGGESTION_CHIPS = [
  { icon: '💻', text: 'Write a Python async function' },
  { icon: '🔬', text: 'Explain RAG architecture' },
  { icon: '✍️', text: 'Help improve my writing' },
  { icon: '📄', text: 'Summarise a document' },
];

interface LocalMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  edited?: boolean;
}

const now = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

const VivixChat = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { themeName, setThemeName, t } = useUvixTheme();
  const {
    conversations: dbConversations,
    createConversation,
    deleteConversation,
    deleteAllConversations,
    getMessages: getDbMessages,
    saveMessage: saveDbMessage,
    updateConversationTitle,
  } = useConversations();

  const { messages: streamMessages, isLoading, sendMessage: streamSend, setMessages: setStreamMessages } = useStreamingChat([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const initials = userName.slice(0, 2).toUpperCase();
  const level = LS.get('uvix-level', 'intermediate');

  // Play login sound on mount
  useEffect(() => { S.login(); }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamMessages]);

  // Convert stream messages to local format
  const localMessages: LocalMessage[] = streamMessages.map(m => ({
    id: m.id,
    role: m.role,
    text: m.content,
    time: now(),
  }));

  // Convert db conversations to sidebar format
  const sidebarConvos: ConvoItem[] = dbConversations.map(c => ({
    id: parseInt(c.id, 16) || Date.now(), // fallback
    title: c.title,
    date: c.created_at,
    messages: [],
    _dbId: c.id,
  })) as any;

  const showToast = (msg: string) => setToastMsg(msg);

  const loadConversation = useCallback(async (sidebarId: number) => {
    const convo = dbConversations.find((_, i) => (sidebarConvos[i] as any)?.id === sidebarId);
    if (!convo) return;
    const msgs = await getDbMessages(convo.id);
    setStreamMessages(msgs.map(m => ({ id: m.id, role: m.role, content: m.content })));
    setActiveConversationId(convo.id);
  }, [dbConversations, sidebarConvos, getDbMessages, setStreamMessages]);

  const handleNew = useCallback(async () => {
    const newId = await createConversation();
    if (newId) {
      setActiveConversationId(newId);
      setStreamMessages([]);
    }
  }, [createConversation, setStreamMessages]);

  const handleDeleteConvo = useCallback(async (sidebarId: number) => {
    const convo = dbConversations.find((_, i) => (sidebarConvos[i] as any)?.id === sidebarId);
    if (!convo) return;
    await deleteConversation(convo.id);
    if (activeConversationId === convo.id) {
      setActiveConversationId(null);
      setStreamMessages([]);
    }
  }, [dbConversations, sidebarConvos, deleteConversation, activeConversationId, setStreamMessages]);

  const handleDeleteAll = useCallback(async () => {
    await deleteAllConversations();
    setActiveConversationId(null);
    setStreamMessages([]);
  }, [deleteAllConversations, setStreamMessages]);

  const handleSendMessage = useCallback(async (attachments?: Attachment[]) => {
    if ((!input.trim() && (!attachments || !attachments.length)) || isLoading) return;
    S.send();

    let conversationId = activeConversationId;
    if (!conversationId) {
      conversationId = await createConversation(input.trim().slice(0, 50));
      if (!conversationId) return;
      setActiveConversationId(conversationId);
    } else if (streamMessages.length === 0) {
      await updateConversationTitle(conversationId, input.trim().slice(0, 50));
    }

    const userText = input.trim() + (attachments?.length ? '\n📎 ' + attachments.map(a => a.name).join(', ') : '');
    await saveDbMessage(conversationId, 'user', userText);

    // Convert attachments to AttachedFile format for streaming
    const files: AttachedFile[] | undefined = attachments?.map(a => ({ file: a.file }));
    await streamSend(input.trim(), files);
    setInput('');
  }, [input, isLoading, activeConversationId, createConversation, streamMessages, updateConversationTitle, saveDbMessage, streamSend]);

  // Save assistant messages to DB
  useEffect(() => {
    const lastMsg = streamMessages[streamMessages.length - 1];
    if (activeConversationId && lastMsg?.role === 'assistant' && lastMsg.content && !isLoading) {
      saveDbMessage(activeConversationId, 'assistant', lastMsg.content);
    }
  }, [isLoading]);

  // Reply sound
  useEffect(() => {
    if (!isLoading && streamMessages.length > 0 && streamMessages[streamMessages.length - 1]?.role === 'assistant') {
      S.reply();
    }
  }, [isLoading]);

  const handleEditMessage = (index: number, newText: string) => {
    setStreamMessages(prev => prev.map((m, i) => i === index ? { ...m, content: newText } : m));
  };

  const handleDeleteMessage = (index: number) => {
    setStreamMessages(prev => prev.filter((_, i) => i !== index));
  };

  const isEmpty = streamMessages.length === 0;

  const handleLogout = async () => {
    await signOut();
    navigate('/landing');
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: t.bg, color: t.text, transition: 'all .3s ease' }}>
      <DashboardNavbar
        t={t}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(p => !p)}
        initials={initials}
        onAvatarClick={() => setPrefsOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar
          t={t}
          open={sidebarOpen}
          convos={sidebarConvos}
          activeId={sidebarConvos.find(c => {
            const convo = dbConversations.find(d => d.id === activeConversationId);
            return convo && (c as any)._dbId === convo.id;
          })?.id ?? null}
          onSelect={loadConversation}
          onNew={handleNew}
          onDelete={handleDeleteConvo}
          onDeleteAll={handleDeleteAll}
          level={level}
          userName={userName}
          showToast={showToast}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: 'thin' }}>
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center h-full" style={{ animation: 'fadeUp .6s ease' }}>
                <BotSVG size={48} ears={false} />
                <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 17, marginTop: 16, color: t.text }}>UVIX AI</div>
                <div style={{ fontSize: 14, color: t.sub, marginTop: 6 }}>What can I help you with today?</div>

                <div className="grid grid-cols-2 gap-2.5 mt-6" style={{ maxWidth: 440 }}>
                  {SUGGESTION_CHIPS.map(chip => (
                    <button
                      key={chip.text}
                      onClick={() => { setInput(chip.text); inputRef.current?.focus(); }}
                      onMouseEnter={S.hover}
                      className="flex items-center gap-2 px-3.5 py-3 rounded-lg text-left transition-colors"
                      style={{ background: t.card, border: `1px solid ${t.border}`, fontSize: 13, color: t.sub }}
                    >
                      <span>{chip.icon}</span>
                      <span>{chip.text}</span>
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: 11, color: t.muted, marginTop: 20 }}>
                  Powered by Claude · <span style={{ color: '#a855f7' }}>{level}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 max-w-3xl mx-auto">
                {localMessages.map((m, i) => (
                  <MessageBubble
                    key={m.id}
                    m={m}
                    t={t}
                    initials={initials}
                    onDelete={() => handleDeleteMessage(i)}
                    onEdit={(newText) => handleEditMessage(i, newText)}
                    showToast={showToast}
                  />
                ))}

                {isLoading && streamMessages[streamMessages.length - 1]?.role !== 'assistant' && (
                  <div className="flex items-center gap-2 pl-8">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: '#a855f7',
                            animation: `dotBounce .6s ease ${i * 0.15}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ borderTop: `1px solid ${t.border}` }}>
            <DashboardInputBar
              t={t}
              input={input}
              setInput={setInput}
              loading={isLoading}
              sendMessage={(attachments) => handleSendMessage(attachments)}
              inputRef={inputRef}
            />
          </div>
        </div>
      </div>

      {/* Preferences Panel */}
      {prefsOpen && (
        <PreferencesPanel
          t={t}
          themeName={themeName}
          onThemeChange={setThemeName}
          onClose={() => setPrefsOpen(false)}
          userName={userName}
          userEmail={userEmail}
          initials={initials}
        />
      )}

      {/* Toast */}
      {toastMsg && <UvixToast message={toastMsg} onDone={() => setToastMsg('')} />}
    </div>
  );
};

export default VivixChat;
