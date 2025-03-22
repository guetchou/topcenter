
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users, 
  Eye, 
  Search,
  FileCheck,
  FileX
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { FormattedMessage } from 'react-intl';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Définition des types
interface News {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  status: 'published' | 'draft';
  author: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

const NewsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null);

  // Simuler la récupération des données (à remplacer par une requête API réelle)
  const { data: news = [], isLoading, refetch } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      // Simule une requête API
      return [
        {
          id: '1',
          title: 'Lancement du nouveau service client',
          summary: 'TopCenter lance un nouveau service de support client...',
          content: 'Contenu détaillé...',
          image_url: '/lovable-uploads/staff-tce.jpg',
          status: 'published' as const,
          author: {
            id: '1',
            name: 'Admin'
          },
          created_at: '2023-10-15T10:30:00Z',
          updated_at: '2023-10-15T14:45:00Z'
        },
        {
          id: '2',
          title: 'Formation des agents',
          summary: 'Programme de formation pour nos agents...',
          content: 'Contenu détaillé...',
          image_url: '/lovable-uploads/equipe-topcenter.jpg',
          status: 'draft' as const,
          author: {
            id: '1',
            name: 'Admin'
          },
          created_at: '2023-10-10T09:15:00Z',
          updated_at: '2023-10-10T16:20:00Z'
        }
      ];
    }
  });

  // Filtrer les actualités selon le terme de recherche
  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestion de la suppression
  const handleDeleteClick = (newsItem: News) => {
    setNewsToDelete(newsItem);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!newsToDelete) return;
    
    try {
      // Appel API pour supprimer l'actualité ici
      
      toast({
        title: "Actualité supprimée",
        description: "L'actualité a été supprimée avec succès.",
      });
      
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'actualité."
      });
    } finally {
      setDeleteDialogOpen(false);
      setNewsToDelete(null);
    }
  };

  // Formatter les dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          <FormattedMessage id="news.manage" defaultMessage="Gérer les actualités" />
        </h1>
        <Button onClick={() => navigate('/admin/news/create')} className="gap-2">
          <Plus className="h-4 w-4" />
          <FormattedMessage id="news.add" defaultMessage="Ajouter une actualité" />
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des actualités..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <FormattedMessage id="blog.title" defaultMessage="Actualités" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune actualité trouvée.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Dernière mise à jour</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                          {item.status === 'published' ? (
                            <><FileCheck className="h-3 w-3 mr-1" /> Publié</>
                          ) : (
                            <><FileX className="h-3 w-3 mr-1" /> Brouillon</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.author.name}</TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                      <TableCell>{formatDate(item.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/news/${item.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/news/edit/${item.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              <FormattedMessage id="news.edit" defaultMessage="Modifier" />
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/news/collaborators/${item.id}`)}>
                              <Users className="h-4 w-4 mr-2" />
                              <FormattedMessage id="news.collaborate" defaultMessage="Collaborateurs" />
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive" 
                              onClick={() => handleDeleteClick(item)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              <FormattedMessage id="news.delete" defaultMessage="Supprimer" />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette actualité ?
              <p className="font-medium mt-2">
                {newsToDelete?.title}
              </p>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewsManagementPage;
