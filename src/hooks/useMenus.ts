
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Menu } from "@/types/menu";

export const useMenus = (location: string) => {
  return useQuery({
    queryKey: ['menus', location],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('location', location)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      return (data || []).map(menu => ({
        ...menu,
        items: Array.isArray(menu.items) ? menu.items : []
      })) as Menu[];
    }
  });
};
