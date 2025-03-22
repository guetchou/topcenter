
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Eye } from "lucide-react";

interface UserManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: { email: string; role: string } | null;
  onPromote: () => void;
  onImpersonate: () => void;
}

export const UserManagementDialog: React.FC<UserManagementDialogProps> = ({
  isOpen,
  onClose,
  user,
  onPromote,
  onImpersonate
}) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              onClick={onPromote}
            >
              <Shield className="h-4 w-4 mr-2" />
              {user.role === 'super_admin' ? 'Promouvoir en Master Admin' : 'Promouvoir en Super Admin'}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onImpersonate}
          >
            <Eye className="h-4 w-4 mr-2" />
            Se connecter en tant que cet utilisateur
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDialog;
