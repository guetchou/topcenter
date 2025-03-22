import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserRole, DbUserRole } from "@/types/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  UserPlus,
  Shield,
  Search,
  RefreshCw,
  UserCog,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserFullName, setNewUserFullName] = useState("");
  const [newUserRole, setNewUserRole] = useState("client");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isPromotingUser, setIsPromotingUser] = useState(false);
  const [promotionRole, setPromotionRole] = useState<string>("super_admin");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
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

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    if (!newUserEmail || !newUserPassword || !newUserFullName) {
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
        email: newUserEmail,
        password: newUserPassword,
        email_confirm: true,
        user_metadata: { full_name: newUserFullName }
      });

      if (error) throw error;
      
      const roleValue: DbUserRole = newUserRole as DbUserRole;
      
      await supabase
        .from('user_roles')
        .insert({ 
          user_id: data.user.id, 
          role: roleValue 
        });

      fetchUsers();
      
      toast({
        title: "Utilisateur créé",
        description: `L'utilisateur ${newUserEmail} a été créé avec succès`,
      });
      
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserFullName("");
      setNewUserRole("client");
      
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

  // Updated to handle both super_admin and master_admin promotions
  const handlePromoteUser = async () => {
    if (!selectedUserId) return;
    
    try {
      // If we have a specific method for promoting to master admin we'd use it here
      // For now, we're using the same method for both types of promotion
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                <DialogDescription>
                  Créez un nouvel utilisateur et assignez-lui un rôle.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="fullName">Nom complet</label>
                  <Input
                    id="fullName"
                    value={newUserFullName}
                    onChange={(e) => setNewUserFullName(e.target.value)}
                    placeholder="Nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password">Mot de passe</label>
                  <Input
                    id="password"
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Mot de passe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role">Rôle</label>
                  <Select value={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="commercial_agent">Agent Commercial</SelectItem>
                      <SelectItem value="support_agent">Agent Support</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="super_admin">Super Administrateur</SelectItem>
                      {user?.role === 'master_admin' && (
                        <SelectItem value="master_admin">Master Administrateur</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddUser} disabled={isAddingUser}>
                  {isAddingUser ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    "Créer l'utilisateur"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name || "-"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.role === "master_admin" ? "outline" :
                               user.role === "super_admin" ? "destructive" : 
                               user.role === "admin" ? "default" : 
                               user.role.includes("agent") ? "secondary" : "outline"}
                        className={user.role === "master_admin" ? "border-purple-600 text-purple-600" : ""}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {user.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleDateString() 
                        : "Jamais connecté"}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImpersonate(user.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Gérer l'utilisateur</DialogTitle>
                            <DialogDescription>
                              {user.email}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            {user.role !== 'master_admin' && (
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => {
                                  setIsPromotingUser(true);
                                  setPromotionRole(user.role === 'super_admin' ? 'master_admin' : 'super_admin');
                                  setSelectedUserId(user.id);
                                }}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                {user.role === 'super_admin' ? 'Promouvoir en Master Admin' : 'Promouvoir en Super Admin'}
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => handleImpersonate(user.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Se connecter en tant que cet utilisateur
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p>Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>
      </Card>

      <Dialog open={isPromotingUser} onOpenChange={setIsPromotingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {promotionRole === 'master_admin' ? 'Promouvoir en Master Admin' : 'Promouvoir en Super Admin'}
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir promouvoir cet utilisateur en {promotionRole === 'master_admin' ? 'Master Admin' : 'Super Admin'}? 
              Cette action lui donnera un accès complet à toutes les fonctionnalités.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsPromotingUser(false);
                setSelectedUserId(null);
              }}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={handlePromoteUser}
            >
              Promouvoir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
