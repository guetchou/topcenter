
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Menu } from "@/types/menu";
import { MenuForm } from "./MenuForm";
import { MenuList } from "./MenuList";

export const MenusPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const { data: menus, isLoading, refetch } = useQuery({
    queryKey: ['menus'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(menu => {
        const items = Array.isArray(menu.items) ? menu.items : [];
        return {
          ...menu,
          items: items.map((item: any) => ({
            id: item.id || crypto.randomUUID(),
            label: item.label || "",
            url: item.url || "",
            order: item.order || 0
          }))
        };
      }) as Menu[];
    }
  });

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setIsDialogOpen(true);
  };

  const handleNewMenu = () => {
    setEditingMenu(null);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Menus</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewMenu}>
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
            <MenuForm 
              editingMenu={editingMenu} 
              onClose={() => setIsDialogOpen(false)} 
              onSuccess={handleSuccess} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <MenuList 
            menus={menus} 
            isLoading={isLoading} 
            onEdit={handleEdit} 
            onRefresh={refetch} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MenusPage;
