
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PageContent {
  id: string;
  page_key: string;
  title: string;
  description: string | null;
  content: Record<string, any>;
  meta_tags: {
    title: string;
    description: string;
  } | null;
  is_active: boolean;
}

export const usePageContent = (pageKey: string) => {
  return useQuery({
    queryKey: ['page-content', pageKey],
    queryFn: async (): Promise<PageContent | null> => {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .eq('page_key', pageKey)
        .single();

      if (error) throw error;
      
      // Cast the Json type to Record<string, any>
      return data ? {
        ...data,
        content: data.content as Record<string, any>,
        meta_tags: data.meta_tags as PageContent['meta_tags']
      } : null;
    }
  });
};
