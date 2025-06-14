
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from './FileUpload';
import { 
  Image, 
  Video, 
  FileText, 
  Folder, 
  Search, 
  Filter,
  Grid3X3,
  List,
  Download,
  Trash2
} from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: number;
  uploadDate: string;
  tags: string[];
}

export const MediaManager: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      name: 'presentation.pdf',
      type: 'document',
      url: '/documents/presentation.pdf',
      size: 2048000,
      uploadDate: '2024-01-15',
      tags: ['presentation', 'business']
    },
    {
      id: '2',
      name: 'logo.png',
      type: 'image',
      url: '/images/logo.png',
      size: 512000,
      uploadDate: '2024-01-14',
      tags: ['logo', 'brand']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleFileUpload = (files: any[]) => {
    const newItems: MediaItem[] = files.map(file => ({
      id: `new-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'document',
      url: file.url || '#',
      size: file.size,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: []
    }));

    setMediaItems(prev => [...prev, ...newItems]);
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      default: return <Folder className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-500';
      case 'video': return 'bg-purple-500';
      case 'document': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDelete = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Gestionnaire de médias
          </CardTitle>
          <CardDescription>
            Gérez vos fichiers, images, vidéos et documents
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="library">Bibliothèque</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <FileUpload 
            onUpload={handleFileUpload}
            acceptedTypes={['image/*', 'video/*', 'application/pdf', '.doc', '.docx', '.txt']}
            maxSize={50}
            multiple={true}
          />
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          {/* Barre de recherche et filtres */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Rechercher des fichiers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="all">Tous les types</option>
                    <option value="image">Images</option>
                    <option value="video">Vidéos</option>
                    <option value="document">Documents</option>
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  >
                    {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grille/Liste des médias */}
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-2'
          }>
            {filteredItems.map((item) => (
              <Card key={item.id} className={viewMode === 'list' ? 'p-4' : ''}>
                {viewMode === 'grid' ? (
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-3">
                      {item.type === 'image' ? (
                        <img 
                          src={item.url} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`${item.type === 'image' ? 'hidden' : ''} text-4xl opacity-50`}>
                        {getTypeIcon(item.type)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-sm truncate" title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={`${getTypeColor(item.type)} text-white`}>
                          {item.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(item.size)}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-3 h-3 mr-1" />
                          Télécharger
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(item.size)} • {item.uploadDate}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={`${getTypeColor(item.type)} text-white`}>
                        {item.type}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Folder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Aucun fichier trouvé</p>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez par uploader des fichiers'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaManager;
