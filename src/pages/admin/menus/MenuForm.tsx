
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { MenuItem, Menu } from "@/types/menu";

interface MenuFormProps {
  editingMenu: Menu | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const MenuForm: React.FC<MenuFormProps> = ({ editingMenu, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: editingMenu?.name || "",
    location: editingMenu?.location || "header",
    items: editingMenu?.items || [] as MenuItem[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const menuData = {
        name: formData.name,
        location: formData.location,
        items: formData.items.map(item => ({
          id: item.id,
          label: item.label,
          url: item.url,
          order: item.order
        }))
      };

      if (editingMenu) {
        const { error } = await supabase
          .from('menus')
          .update(menuData)
          .eq('id', editingMenu.id);

        if (error) throw error;
        toast.success("Menu mis à jour avec succès");
      } else {
        const { error } = await supabase
          .from('menus')
          .insert(menuData);

        if (error) throw error;
        toast.success("Menu créé avec succès");
      }

      onSuccess();
      onClose();
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

  return (
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
  );
};
