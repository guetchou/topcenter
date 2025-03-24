
import { useState, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { UploadCloud, File, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FileDropzoneProps {
  onDrop: (files: File[]) => void;
  onRemove?: (file: File) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  className?: string;
  children?: ReactNode;
  showPreview?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export function FileDropzone({
  onDrop,
  onRemove,
  accept,
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  className,
  children,
  showPreview = true,
  loading = false,
  disabled = false,
}: FileDropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled || loading) return;
    
    setIsDragging(true);
  }, [disabled, loading]);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(false);
  }, []);
  
  const validateFiles = useCallback((fileList: FileList | File[]): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    Array.from(fileList).forEach(file => {
      // Check file type if accept is specified
      if (accept && !file.type.match(accept.replace(/,/g, '|'))) {
        errors.push(`Le fichier ${file.name} n'est pas d'un type accepté`);
        return;
      }
      
      // Check file size
      if (file.size > maxSize) {
        errors.push(`Le fichier ${file.name} dépasse la taille maximale autorisée (${maxSize / (1024 * 1024)}MB)`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (errors.length > 0) {
      setError(errors.join('. '));
    } else {
      setError(null);
    }
    
    return validFiles;
  }, [accept, maxSize]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled || loading) return;
    
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;
    
    const validFiles = validateFiles(droppedFiles);
    if (validFiles.length === 0) return;
    
    const newFiles = multiple ? [...files, ...validFiles] : validFiles;
    
    setFiles(newFiles);
    onDrop(newFiles);
  }, [disabled, files, loading, multiple, onDrop, validateFiles]);
  
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || loading || !e.target.files || e.target.files.length === 0) return;
    
    const selectedFiles = e.target.files;
    const validFiles = validateFiles(selectedFiles);
    if (validFiles.length === 0) return;
    
    const newFiles = multiple ? [...files, ...validFiles] : validFiles;
    
    setFiles(newFiles);
    onDrop(newFiles);
    
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  }, [disabled, files, loading, multiple, onDrop, validateFiles]);
  
  const handleRemoveFile = useCallback((index: number) => {
    if (disabled || loading) return;
    
    const fileToRemove = files[index];
    const newFiles = [...files];
    newFiles.splice(index, 1);
    
    setFiles(newFiles);
    if (onRemove) onRemove(fileToRemove);
  }, [disabled, files, loading, onRemove]);
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-border',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          className
        )}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <UploadCloud className={cn(
            'h-10 w-10 mb-4',
            isDragging ? 'text-primary animate-bounce' : 'text-muted-foreground'
          )} />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              {loading ? 'Chargement en cours...' : 'Déposez vos fichiers ici'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {children || `Glissez-déposez vos fichiers ou cliquez pour sélectionner.${
                accept ? ` Accepte: ${accept}` : ''
              }${maxSize ? ` (Max: ${formatFileSize(maxSize)})` : ''}`}
            </p>
            
            <input
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleFileInputChange}
              disabled={disabled || loading}
              className="hidden"
              id="file-upload"
            />
            
            <label
              htmlFor="file-upload"
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
                "border border-input hover:bg-accent hover:text-accent-foreground",
                "h-10 py-2 px-4",
                disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              )}
            >
              Parcourir les fichiers
            </label>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-3 flex items-start gap-2 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {showPreview && files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="bg-muted rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                disabled={disabled || loading}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Supprimer ${file.name}`}
              >
                <X className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileDropzone;
