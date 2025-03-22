
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, UserCog, AlertCircle } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface User {
  id: string;
  email: string;
  role: string;
  full_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  searchTerm: string;
  handleImpersonate: (userId: string) => Promise<void>;
  openUserDialog: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  searchTerm,
  handleImpersonate,
  openUserDialog
}) => {
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p>Aucun utilisateur trouvé</p>
      </div>
    );
  }

  return (
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
                    onClick={() => openUserDialog(user.id)}
                  >
                    <UserCog className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
