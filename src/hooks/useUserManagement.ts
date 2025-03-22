
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/api/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export const useUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [promotionRole, setPromotionRole] = useState<'super_admin' | 'master_admin'>('super_admin');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Récupérer la liste des utilisateurs
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      return data?.users || [];
    }
  });

  // Mutation pour supprimer un utilisateur
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.functions.invoke('admin-delete-user', { 
        body: { userId } 
      });
      if (error) throw error;
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Utilisateur supprimé avec succès');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  });

  // Mutation pour promouvoir un utilisateur
  const promoteUserMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { error } = await supabase.functions.invoke('admin-promote-user', { 
        body: { userId, role } 
      });
      if (error) throw error;
      return { userId, role };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`Utilisateur promu en ${promotionRole === 'master_admin' ? 'Master Admin' : 'Super Admin'}`);
      setIsPromoteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Erreur lors de la promotion:', error);
      toast.error("Erreur lors de la promotion de l'utilisateur");
    }
  });

  // Mutation pour l'impersonnification
  const impersonateUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.functions.invoke('admin-impersonate-user', { 
        body: { userId } 
      });
      if (error) throw error;
      return userId;
    },
    onSuccess: (userId) => {
      toast.success('Impersonnification réussie');
      // Redirection ou mise à jour de l'état global si nécessaire
    },
    onError: (error) => {
      console.error('Erreur lors de l\'impersonnification:', error);
      toast.error("Erreur lors de l'impersonnification");
    }
  });

  // Fonction pour ouvrir la boîte de dialogue
  const openUserDialog = useCallback((userId: string) => {
    setSelectedUser(userId);
    setIsDialogOpen(true);
  }, []);

  // Fonction pour ouvrir la boîte de dialogue de promotion
  const openPromoteDialog = useCallback((userId: string, role: 'super_admin' | 'master_admin') => {
    setSelectedUser(userId);
    setPromotionRole(role);
    setIsPromoteDialogOpen(true);
  }, []);

  // Fonction pour impersonnifier un utilisateur
  const handleImpersonate = useCallback(async (userId: string) => {
    impersonateUserMutation.mutate(userId);
  }, [impersonateUserMutation]);

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = useCallback(async () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser);
    }
  }, [selectedUser, deleteUserMutation]);

  // Fonction pour promouvoir un utilisateur
  const handlePromoteUser = useCallback(async () => {
    if (selectedUser) {
      promoteUserMutation.mutate({ userId: selectedUser, role: promotionRole });
    }
  }, [selectedUser, promotionRole, promoteUserMutation]);

  return {
    users,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedUser,
    isDialogOpen,
    setIsDialogOpen,
    isPromoteDialogOpen,
    setIsPromoteDialogOpen,
    promotionRole,
    openUserDialog,
    openPromoteDialog,
    handleImpersonate,
    handleDeleteUser,
    handlePromoteUser,
    isCurrentUser: selectedUser === user?.id
  };
};
