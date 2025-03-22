
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, RefreshCw } from "lucide-react";
import UserTable from "@/components/admin/UserManagement/UserTable";
import AddUserDialog from "@/components/admin/UserManagement/AddUserDialog";
import PromoteUserDialog from "@/components/admin/UserManagement/PromoteUserDialog";
import UserManagementDialog from "@/components/admin/UserManagement/UserManagementDialog";

interface User {
  id: string;
  email: string;
  role: string;
  full_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isPromotingUser, setIsPromotingUser] = useState(false);
  const [promotionRole, setPromotionRole] = useState<string>("super_admin");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, impersonateUser, promoteToSuperAdmin } = useAuth();

  useEffect(() => {
    if (!user || (user.role !== 'super_admin' && user.role !== 'master_admin')) {
      navigate('/login');
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'accès à cette page",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name');
      
      if (profilesError) throw profilesError;
      
      const roleMap = new Map();
      userRoles?.forEach(item => roleMap.set(item.user_id, item.role));
      
      const profileMap = new Map();
      profiles?.forEach(item => profileMap.set(item.id, item.full_name));

      const formattedUsers = authUsers.users.map(authUser => ({
        id: authUser.id,
        email: authUser.email || '',
        role: roleMap.get(authUser.id) || 'client',
        full_name: profileMap.get(authUser.id) || null,
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (userData: {
    email: string;
    password: string;
    fullName: string;
    role: string;
  }) => {
    if (!userData.email || !userData.password || !userData.fullName) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsAddingUser(true);
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: { full_name: userData.fullName }
      });

      if (error) throw error;
      
      await supabase
        .from('user_roles')
        .insert({ 
          user_id: data.user.id, 
          role: userData.role
        });

      fetchUsers();
      
      toast({
        title: "Utilisateur créé",
        description: `L'utilisateur ${userData.email} a été créé avec succès`,
      });

      setIsAddUserDialogOpen(false);
    } catch (error: any) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'utilisateur",
        variant: "destructive",
      });
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleImpersonate = async (userId: string) => {
    try {
      await impersonateUser(userId);
      toast({
        title: "Impersonnification activée",
        description: "Vous naviguez maintenant en tant que cet utilisateur",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'impersonnifier cet utilisateur",
        variant: "destructive",
      });
    }
  };

  const handlePromoteUser = async () => {
    if (!selectedUserId) return;
    
    try {
      await promoteToSuperAdmin(selectedUserId);
      toast({
        title: "Promotion réussie",
        description: `L'utilisateur a été promu ${promotionRole === 'master_admin' ? 'master administrateur' : 'super administrateur'}`,
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de promouvoir cet utilisateur",
        variant: "destructive",
      });
    } finally {
      setIsPromotingUser(false);
      setSelectedUserId(null);
    }
  };

  const openUserDialog = (userId: string) => {
    const user = users.find(u => u.id === userId) || null;
    setSelectedUser(user);
    setSelectedUserId(userId);
    setIsUserDialogOpen(true);
  };

  const handlePromoteClick = () => {
    if (!selectedUser) return;
    setPromotionRole(selectedUser.role === 'super_admin' ? 'master_admin' : 'super_admin');
    setIsUserDialogOpen(false);
    setIsPromotingUser(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <UserTable 
            users={users}
            isLoading={loading}
            searchTerm={searchTerm}
            handleImpersonate={handleImpersonate}
            openUserDialog={openUserDialog}
          />
        </div>
      </Card>

      {/* Dialogs */}
      <AddUserDialog 
        isOpen={isAddUserDialogOpen}
        onClose={() => setIsAddUserDialogOpen(false)}
        onAddUser={handleAddUser}
        isAddingUser={isAddingUser}
        currentUserRole={user?.role}
      />

      <PromoteUserDialog 
        isOpen={isPromotingUser}
        onClose={() => setIsPromotingUser(false)}
        onPromote={handlePromoteUser}
        promotionRole={promotionRole}
      />

      <UserManagementDialog 
        isOpen={isUserDialogOpen}
        onClose={() => setIsUserDialogOpen(false)}
        user={selectedUser}
        onPromote={handlePromoteClick}
        onImpersonate={() => {
          if (selectedUserId) {
            setIsUserDialogOpen(false);
            handleImpersonate(selectedUserId);
          }
        }}
      />
    </div>
  );
};

export default UserManagement;
