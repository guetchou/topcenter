
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MediaFile {
  id: string;
  file_name: string;
  file_type: string;
  url: string;
  created_at: string;
  description?: string;
  alt_text?: string;
}

export const MediasPage = () => {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: medias, isLoading, refetch } = useQuery({
    queryKey: ['medias'],
    queryFn: async () => {
      const response = await api.get('/admin/media');
      return response.data as MediaFile[];
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileToUpload(file);
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload) return;

    setIsUploading(true);
    try {
      // Créer un FormData pour l'upload de fichier
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('fileName', fileToUpload.name);
      formData.append('fileType', fileToUpload.type);

      // Configurer les headers pour multipart/form-data
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      // Envoyer au serveur
      await api.post('/admin/media/upload', formData, config);

      toast.success("Fichier uploadé avec succès");
      setFileToUpload(null);
      refetch();
    } catch (error) {
      console.error("Erreur durant l'upload:", error);
      toast.error("Erreur lors de l'upload du fichier");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/media/${id}`);
      toast.success("Fichier supprimé avec succès");
      refetch();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du fichier");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bibliothèque multimédia</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <Input
              type="file"
              onChange={handleFileChange}
              className="max-w-sm"
            />
            <Button 
              onClick={handleUpload} 
              disabled={!fileToUpload || isUploading}
            >
              {isUploading ? (
                "Upload en cours..."
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Uploader
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {medias?.map((media) => (
            <Card key={media.id} className="overflow-hidden group">
              <CardContent className="p-0">
                {media.file_type.startsWith('image/') ? (
                  <div className="aspect-video relative">
                    <img 
                      src={media.url} 
                      alt={media.alt_text || media.file_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(media.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    <File className="w-8 h-8 text-muted-foreground" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(media.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{media.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(media.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediasPage;
