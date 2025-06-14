
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onUpload?: (files: FileInfo[]) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
}

interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  acceptedTypes = ['image/*', 'video/*', 'application/pdf', '.doc', '.docx'],
  maxSize = 10,
  multiple = true
}) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList) => {
    const newFiles: FileInfo[] = [];

    Array.from(selectedFiles).forEach((file) => {
      // Validation de la taille
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`${file.name} dépasse la taille limite de ${maxSize}MB`);
        return;
      }

      // Validation du type
      const isValidType = acceptedTypes.some(type => 
        type === file.type || 
        (type.includes('*') && file.type.startsWith(type.split('*')[0])) ||
        file.name.toLowerCase().endsWith(type)
      );

      if (!isValidType) {
        toast.error(`${file.name} n'est pas un type de fichier accepté`);
        return;
      }

      const fileInfo: FileInfo = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      };

      newFiles.push(fileInfo);
      
      // Simuler l'upload
      simulateUpload(fileInfo, file);
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const simulateUpload = async (fileInfo: FileInfo, file: File) => {
    try {
      // Simuler le progrès d'upload
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => 
          prev.map(f => 
            f.id === fileInfo.id 
              ? { ...f, progress }
              : f
          )
        );
      }

      // Créer une URL locale pour l'aperçu
      const url = URL.createObjectURL(file);
      
      setFiles(prev => 
        prev.map(f => 
          f.id === fileInfo.id 
            ? { ...f, status: 'completed', url }
            : f
        )
      );

      toast.success(`${fileInfo.name} uploadé avec succès`);
      
    } catch (error) {
      setFiles(prev => 
        prev.map(f => 
          f.id === fileInfo.id 
            ? { ...f, status: 'error' }
            : f
        )
      );
      toast.error(`Erreur lors de l'upload de ${fileInfo.name}`);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(f => f.id !== fileId);
      if (onUpload) {
        onUpload(updatedFiles.filter(f => f.status === 'completed'));
      }
      return updatedFiles;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.includes('pdf')) return '📄';
    if (type.includes('doc')) return '📝';
    return '📎';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload de fichiers</CardTitle>
        <CardDescription>
          Glissez-déposez vos fichiers ou cliquez pour sélectionner.
          Taille max: {maxSize}MB. Types acceptés: {acceptedTypes.join(', ')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Zone de drop */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Glissez vos fichiers ici
            </p>
            <p className="text-sm text-muted-foreground">
              ou
            </p>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              Parcourir les fichiers
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={(e) => {
            if (e.target.files) {
              handleFileSelect(e.target.files);
            }
          }}
          className="hidden"
        />

        {/* Liste des fichiers */}
        {files.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Fichiers sélectionnés</Label>
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <span className="text-lg">{getFileIcon(file.type)}</span>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                  
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="mt-1 h-1" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      file.status === 'completed' ? 'default' : 
                      file.status === 'error' ? 'destructive' : 
                      'secondary'
                    }
                  >
                    {file.status === 'completed' && <Check className="w-3 h-3 mr-1" />}
                    {file.status === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                    {file.status === 'uploading' ? `${file.progress}%` : file.status}
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(file.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
