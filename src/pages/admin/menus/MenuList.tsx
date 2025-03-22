
import React from "react";
import { Menu } from "@/types/menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MenuListProps {
  menus: Menu[] | undefined;
  isLoading: boolean;
  onEdit: (menu: Menu) => void;
  onRefresh: () => void;
}

export const MenuList: React.FC<MenuListProps> = ({ menus, isLoading, onEdit, onRefresh }) => {
  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce menu ?")) return;

    try {
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Menu supprimé avec succès");
      onRefresh();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Emplacement</TableHead>
          <TableHead>Éléments</TableHead>
          <TableHead>Date de création</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Chargement...
            </TableCell>
          </TableRow>
        ) : menus?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Aucun menu trouvé
            </TableCell>
          </TableRow>
        ) : (
          menus?.map((menu) => (
            <TableRow key={menu.id}>
              <TableCell className="font-medium">{menu.name}</TableCell>
              <TableCell>
                {menu.location === "header" ? "En-tête" : 
                 menu.location === "footer" ? "Pied de page" : 
                 "Barre latérale"}
              </TableCell>
              <TableCell>{menu.items?.length || 0} éléments</TableCell>
              <TableCell>
                {new Date(menu.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(menu)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(menu.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
