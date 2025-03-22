
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Plus, Trash2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

// Définition des types
interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'editor' | 'viewer';
  added_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const NewsCollaboratorsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collaboratorToDelete, setCollaboratorToDelete] = useState<Collaborator | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Record<string, boolean>>({});
  const [selectedRole, setSelectedRole] = useState<'editor' | 'viewer'>('viewer');

  // Récupérer les données de l'actualité
  const { data: newsItem, isLoading: newsLoading } = useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      // Simuler une requête API
      return {
        id: '1',
        title: 'Lancement du nouveau service client',
      };
    }
  });

  // Récupérer la liste des collaborateurs actuels
  const { data: collaborators = [], isLoading: collaboratorsLoading, refetch } = useQuery({
    queryKey: ['news-collaborators', id],
    queryFn: async () => {
      // Simuler une requête API
      return [
        {
          id: '1',
          name: 'Jean Dupont',
          email: 'jean.dupont@example.com',
          role: 'editor' as const,
          added_at: '2023-10-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Marie Martin',
          email: 'marie.martin@example.com',
          role: 'viewer' as const,
          added_at: '2023-10-16T14:20:00Z'
        }
      ];
    }
  });

  // Récupérer la liste des utilisateurs pouvant être ajoutés
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Simuler une requête API
      return [
        {
          id: '1',
          name: 'Jean Dupont',
          email: 'jean.dupont@example.com'
        },
        {
          id: '2',
          name: 'Marie Martin',
          email: 'marie.martin@example.com'
        },
        {
          id: '3',
          name: 'Pierre Lefebvre',
          email: 'pierre.lefebvre@example.com'
        },
        {
          id: '4',
          name: 'Sophie Moreau',
          email: 'sophie.moreau@example.com'
        }
      ];
    }
  });

  // Filtrer les collaborateurs selon le terme de recherche
  const filteredCollaborators = collaborators.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrer les utilisateurs qui ne sont pas déjà collaborateurs
  const availableUsers = users.filter(user => 
    !collaborators.some(collaborator => collaborator.id === user.id)
  );

  // Gestion de la suppression d'un collaborateur
  const handleDeleteClick = (collaborator: Collaborator) => {
    setCollaboratorToDelete(collaborator);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!collaboratorToDelete) return;
    
    try {
      // Appel API pour supprimer le collaborateur ici
      
      toast({
        title: "Collaborateur supprimé",
        description: "Le collaborateur a été retiré avec succès."
      });
      
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le collaborateur."
      });
    } finally {
      setDeleteDialogOpen(false);
      setCollaboratorToDelete(null);
    }
  };

  // Gestion de l'ajout de collaborateurs
  const handleAddCollaborators = async () => {
    const selectedUserIds = Object.entries(selectedUsers)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    if (selectedUserIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins un utilisateur."
      });
      return;
    }
    
    try {
      // Appel API pour ajouter les collaborateurs ici
      
      toast({
        title: "Collaborateurs ajoutés",
        description: `${selectedUserIds.length} collaborateur(s) ajouté(s) avec succès.`
      });
      
      refetch();
      setDialogOpen(false);
      setSelectedUsers({});
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter les collaborateurs."
      });
    }
  };

  // Formatter les dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isLoading = newsLoading || collaboratorsLoading;

  if (isLoading) {
    return (
      <div className="container py-6 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate('/admin/news')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">
            Collaborateurs - {newsItem?.title}
          </h1>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter des collaborateurs
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des collaborateurs..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collaborateurs</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCollaborators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun collaborateur trouvé.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Ajouté le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollaborators.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        <Badge variant={item.role === 'editor' ? 'default' : 'secondary'}>
                          {item.role === 'editor' ? 'Éditeur' : 'Lecteur'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(item.added_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(item)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogue pour ajouter des collaborateurs */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter des collaborateurs</DialogTitle>
            <DialogDescription>
              Sélectionnez les utilisateurs que vous souhaitez ajouter comme collaborateurs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label>Rôle des nouveaux collaborateurs</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-editor" 
                      checked={selectedRole === 'editor'} 
                      onCheckedChange={() => setSelectedRole('editor')}
                    />
                    <Label htmlFor="role-editor" className="font-normal">Éditeur</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-viewer" 
                      checked={selectedRole === 'viewer'} 
                      onCheckedChange={() => setSelectedRole('viewer')}
                    />
                    <Label htmlFor="role-viewer" className="font-normal">Lecteur</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Utilisateurs disponibles</Label>
                <div className="border rounded-md mt-2">
                  <ScrollArea className="h-60 rounded-md">
                    <div className="p-4 space-y-2">
                      {usersLoading ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                        </div>
                      ) : availableUsers.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          Tous les utilisateurs sont déjà collaborateurs.
                        </div>
                      ) : (
                        availableUsers.map(user => (
                          <div key={user.id} className="flex items-center gap-2">
                            <Checkbox 
                              id={`user-${user.id}`} 
                              checked={selectedUsers[user.id] || false}
                              onCheckedChange={(checked) => 
                                setSelectedUsers(prev => ({ 
                                  ...prev, 
                                  [user.id]: !!checked 
                                }))
                              }
                            />
                            <Label htmlFor={`user-${user.id}`} className="font-normal flex-1">
                              <div>{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddCollaborators}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce collaborateur ?
              <p className="font-medium mt-2">
                {collaboratorToDelete?.name} ({collaboratorToDelete?.email})
              </p>
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

export default NewsCollaboratorsPage;
