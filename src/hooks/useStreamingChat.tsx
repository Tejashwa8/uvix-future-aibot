import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AttachedFile } from '@/components/FilePreview';
import { isImageFile, isTextFile, readFileAsBase64, readFileAsText } from '@/lib/fileUtils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  files?: AttachedFile[];
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`;

const IMAGE_MARKER_REGEX = /\[GENERATE_IMAGE:\s*(.*?)\]/g;

export const useStreamingChat = (initialMessages: Message[] = []) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(async (content: string, files?: AttachedFile[], mode?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      files,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = '';
    const assistantId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '' },
    ]);

    try {
      let attachments: any[] | undefined;
      if (files && files.length > 0) {
        attachments = await Promise.all(
          files.map(async (f) => {
            if (isImageFile(f.file)) {
              const data = await readFileAsBase64(f.file);
              return { type: 'image', name: f.file.name, mimeType: f.file.type, data };
            } else if (isTextFile(f.file)) {
              const extractedText = f.extractedText || await readFileAsText(f.file);
              return { type: 'text', name: f.file.name, extractedText };
            } else {
              const data = await readFileAsBase64(f.file);
              return { type: 'document', name: f.file.name, mimeType: f.file.type, data };
            }
          })
        );
      }

      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      if (attachments) {
        (apiMessages[apiMessages.length - 1] as any).attachments = attachments;
      }

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages, mode }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({ variant: 'destructive', title: 'Rate limit exceeded', description: 'Please wait a moment before sending another message.' });
          throw new Error('Rate limited');
        }
        if (response.status === 402) {
          toast({ variant: 'destructive', title: 'Usage limit reached', description: 'Please try again later.' });
          throw new Error('Payment required');
        }
        throw new Error('Failed to get response');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantContent += delta;
              setMessages((prev) =>
                prev.map((m) => m.id === assistantId ? { ...m, content: assistantContent } : m)
              );
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Process image generation markers
      const imageMatches = [...assistantContent.matchAll(IMAGE_MARKER_REGEX)];
      if (imageMatches.length > 0) {
        let processedContent = assistantContent;
        for (const match of imageMatches) {
          const prompt = match[1].trim();
          try {
            const imgRes = await fetch(IMAGE_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              },
              body: JSON.stringify({ prompt }),
            });
            if (imgRes.ok) {
              const imgData = await imgRes.json();
              if (imgData.imageUrl) {
                processedContent = processedContent.replace(match[0], `![Generated Image](${imgData.imageUrl})`);
              } else {
                processedContent = processedContent.replace(match[0], '*Image generation failed.*');
              }
            } else {
              processedContent = processedContent.replace(match[0], '*Image generation failed.*');
            }
          } catch {
            processedContent = processedContent.replace(match[0], '*Image generation failed.*');
          }
        }
        assistantContent = processedContent;
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: assistantContent } : m)
        );
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantContent += delta;
              setMessages((prev) =>
                prev.map((m) => m.id === assistantId ? { ...m, content: assistantContent } : m)
              );
            }
          } catch { /* ignore */ }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId || m.content));
      if (!(error instanceof Error) || !['Rate limited', 'Payment required'].includes(error.message)) {
        toast({ variant: 'destructive', title: 'Something went wrong', description: 'Failed to get a response. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, toast]);

  return { messages, isLoading, sendMessage, setMessages };
};
