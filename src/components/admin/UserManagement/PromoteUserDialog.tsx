
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PromoteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPromote: () => Promise<void>;
  promotionRole: string;
}

export const PromoteUserDialog: React.FC<PromoteUserDialogProps> = ({
  isOpen,
  onClose,
  onPromote,
  promotionRole
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive"
            onClick={onPromote}
          >
            Promouvoir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromoteUserDialog;
