import { X, FileText, Image as ImageIcon, FileType, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isImageFile } from '@/lib/fileUtils';

const getFileIcon = (file: File) => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (isImageFile(file)) return <ImageIcon className="w-4 h-4 text-green-500 flex-shrink-0" />;
  if (ext === 'pdf') return <FileType className="w-4 h-4 text-red-500 flex-shrink-0" />;
  if (ext === 'doc' || ext === 'docx') return <FileSpreadsheet className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  return <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />;
};

export interface AttachedFile {
  file: File;
  preview?: string; // data URL for images
  extractedText?: string; // text content for text/docs
}

interface FilePreviewProps {
  files: AttachedFile[];
  onRemove: (index: number) => void;
}

const FilePreview = ({ files, onRemove }: FilePreviewProps) => {
  if (files.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap px-2 pt-2">
      {files.map((f, i) => (
        <div
          key={i}
          className={cn(
            'relative group flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs',
            'max-w-[200px]'
          )}
        >
          {f.preview ? (
            <img src={f.preview} alt="" className="w-8 h-8 rounded object-cover" />
          ) : (
            getFileIcon(f.file)
          )}
          <span className="truncate text-foreground">{f.file.name}</span>
          <button
            onClick={() => onRemove(i)}
            className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilePreview;
