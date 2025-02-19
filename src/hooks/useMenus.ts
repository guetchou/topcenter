
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Menu, MenuItem } from "@/types/menu";

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
        items: Array.isArray(menu.items) 
          ? menu.items.map((item: any): MenuItem => ({
              id: item.id,
              label: item.label,
              url: item.url,
              parent_id: item.parent_id || null,
              order: item.order || 0
            }))
          : []
      })) as Menu[];
    },
    // Optimisations de performance avec React Query
    staleTime: 1000 * 60 * 5, // Cache valide pendant 5 minutes
    gcTime: 1000 * 60 * 30, // Garde en cache pendant 30 minutes (nouveau nom pour cacheTime)
    refetchOnWindowFocus: false // Évite les re-fetch inutiles
  });
};
