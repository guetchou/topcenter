
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
}

interface Menu {
  id: string;
  name: string;
  location: string;
  items: MenuItem[];
  created_at: string;
  updated_at: string;
}

export const MenusPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "header",
    items: [] as MenuItem[]
  });

  const { data: menus, isLoading, refetch } = useQuery({
    queryKey: ['menus'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as any[]).map(menu => ({
        ...menu,
        items: menu.items || []
      })) as Menu[];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMenu) {
        const { error } = await supabase
          .from('menus')
          .update({
            name: formData.name,
            location: formData.location,
            items: formData.items
          })
          .eq('id', editingMenu.id);

        if (error) throw error;
        toast.success("Menu mis à jour avec succès");
      } else {
        const { error } = await supabase
          .from('menus')
          .insert({
            name: formData.name,
            location: formData.location,
            items: formData.items
          });

        if (error) throw error;
        toast.success("Menu créé avec succès");
      }

      setIsDialogOpen(false);
      setFormData({ name: "", location: "header", items: [] });
      setEditingMenu(null);
      refetch();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleAddMenuItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: crypto.randomUUID(), label: "", url: "", order: prev.items.length }]
    }));
  };

  const handleUpdateMenuItem = (index: number, field: keyof MenuItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleRemoveMenuItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      location: menu.location,
      items: menu.items
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce menu ?")) return;

    try {
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Menu supprimé avec succès");
      refetch();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Menus</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingMenu(null);
              setFormData({ name: "", location: "header", items: [] });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau menu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMenu ? "Modifier le menu" : "Nouveau menu"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Emplacement</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">En-tête</SelectItem>
                    <SelectItem value="footer">Pied de page</SelectItem>
                    <SelectItem value="sidebar">Barre latérale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Éléments du menu</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddMenuItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un élément
                  </Button>
                </div>
                
                {formData.items.map((item, index) => (
                  <div key={item.id} className="grid gap-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Libellé</Label>
                        <Input
                          value={item.label}
                          onChange={(e) => handleUpdateMenuItem(index, "label", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                          value={item.url}
                          onChange={(e) => handleUpdateMenuItem(index, "url", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleRemoveMenuItem(index)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full">
                {editingMenu ? "Mettre à jour" : "Créer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
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
                          onClick={() => handleEdit(menu)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default MenusPage;
