
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Upload } from 'lucide-react';

interface MediaUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ value, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewUrl(url);
    onChange(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Here you would typically make an API call to upload the file
      // For now, we'll just create a local URL as a placeholder
      const tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);
      onChange(tempUrl);
      
      // In a real implementation, you would upload to your server:
      /*
      const response = await api.post('/admin/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPreviewUrl(response.data.url);
      onChange(response.data.url);
      */
      
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Input 
            type="text" 
            placeholder="Image URL" 
            value={previewUrl} 
            onChange={handleUrlChange}
            className="flex-1"
          />
          <div className="relative">
            <Button variant="outline" type="button" className="relative">
              <Upload className="h-4 w-4 mr-2" />
              Browse
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Enter an image URL or upload an image
        </p>
      </div>
      
      {previewUrl && (
        <div className="border rounded-md overflow-hidden p-2">
          <div className="aspect-video relative bg-muted/40 flex items-center justify-center overflow-hidden rounded-md">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="object-cover w-full h-full" 
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }} 
            />
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="text-center py-2">
          <span className="animate-spin inline-block mr-2">⟳</span>
          Uploading...
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
