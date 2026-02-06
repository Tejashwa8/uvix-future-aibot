import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const createConversation = useCallback(async (title: string = 'New Chat'): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({ user_id: user.id, title })
        .select()
        .single();

      if (error) throw error;
      
      setConversations(prev => [data, ...prev]);
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to create conversation',
        description: 'Please try again.',
      });
      return null;
    }
  }, [user, toast]);

  const updateConversationTitle = useCallback(async (id: string, title: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ title })
        .eq('id', id);

      if (error) throw error;
      
      setConversations(prev =>
        prev.map(c => c.id === id ? { ...c, title, updated_at: new Date().toISOString() } : c)
      );
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setConversations(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete conversation',
        description: 'Please try again.',
      });
    }
  }, [toast]);

  const getMessages = useCallback(async (conversationId: string): Promise<Message[]> => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(m => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        created_at: m.created_at,
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }, []);

  const saveMessage = useCallback(async (
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, role, content })
        .select()
        .single();

      if (error) throw error;
      
      // Update conversation's updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data.id;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  }, []);

  return {
    conversations,
    isLoading,
    createConversation,
    updateConversationTitle,
    deleteConversation,
    getMessages,
    saveMessage,
    refetch: fetchConversations,
  };
};
