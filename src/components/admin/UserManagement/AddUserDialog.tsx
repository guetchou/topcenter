
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: {
    email: string;
    password: string;
    fullName: string;
    role: string;
  }) => Promise<void>;
  isAddingUser: boolean;
  currentUserRole: string | undefined;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({
  isOpen,
  onClose,
  onAddUser,
  isAddingUser,
  currentUserRole
}) => {
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserFullName, setNewUserFullName] = useState("");
  const [newUserRole, setNewUserRole] = useState("client");

  const handleSubmit = async () => {
    await onAddUser({
      email: newUserEmail,
      password: newUserPassword,
      fullName: newUserFullName,
      role: newUserRole
    });
    
    // Réinitialiser le formulaire
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserFullName("");
    setNewUserRole("client");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                {currentUserRole === 'master_admin' && (
                  <SelectItem value="master_admin">Master Administrateur</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isAddingUser}>
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
  );
};

export default AddUserDialog;
