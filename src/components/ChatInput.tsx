import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Paperclip, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import FilePreview, { AttachedFile } from './FilePreview';
import {
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE,
  isImageFile,
  isTextFile,
  readFileAsText,
  readFileAsDataURL,
} from '@/lib/fileUtils';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSend: (message: string, files?: AttachedFile[]) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleVoiceResult = useCallback((text: string) => {
    setInput((prev) => (prev ? prev + ' ' + text : text));
  }, []);

  const { isListening, transcript, startListening, stopListening, isSupported: voiceSupported } =
    useVoiceInput(handleVoiceResult);

  // Update input with interim transcript
  useEffect(() => {
    if (isListening && transcript) {
      setInput((prev) => {
        const base = prev.replace(/\s*\[.*?\]\s*$/, ''); // remove old interim
        return base ? base + ' ' + transcript : transcript;
      });
    }
  }, [transcript, isListening]);

  const handleSubmit = () => {
    if ((input.trim() || attachedFiles.length > 0) && !disabled) {
      onSend(input.trim(), attachedFiles.length > 0 ? attachedFiles : undefined);
      setInput('');
      setAttachedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles: AttachedFile[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: `${file.name} exceeds the 10MB limit.`,
        });
        continue;
      }

      const attached: AttachedFile = { file };

      if (isImageFile(file)) {
        attached.preview = await readFileAsDataURL(file);
      } else if (isTextFile(file)) {
        attached.extractedText = await readFileAsText(file);
      } else {
        // PDF/DOC - we'll send as base64 to the edge function
        attached.preview = undefined;
      }

      newFiles.push(attached);
    }

    setAttachedFiles((prev) => [...prev, ...newFiles].slice(0, 5)); // max 5 files
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
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

      <div className="relative glass-panel neon-border rounded-2xl p-2">
        {/* File previews */}
        <FilePreview files={attachedFiles} onRemove={removeFile} />

        <div className="flex items-end gap-2">
          {/* File attach button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className={cn(
              'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
              'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            title="Attach file (TXT, PDF, DOC, DOCX, JPG, PNG)"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

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
                'resize-none outline-none px-2 py-3 text-sm leading-relaxed',
                'scrollbar-thin scrollbar-thumb-primary/20'
              )}
            />
          </div>

          {/* Voice input button */}
          {voiceSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={disabled}
              className={cn(
                'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all',
                isListening
                  ? 'bg-destructive/20 text-destructive animate-pulse'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              title={isListening ? 'Stop recording' : 'Voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={(!input.trim() && attachedFiles.length === 0) || disabled}
            className={cn(
              'flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center',
              'transition-all duration-300',
              (input.trim() || attachedFiles.length > 0) && !disabled
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
    </div>
  );
};

export default ChatInput;
