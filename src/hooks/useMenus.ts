
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface MenuItem {
  title: string;
  path: string;
  children?: MenuItem[];
}

export interface MenusState {
  primaryMenuItems: MenuItem[];
  footerMenuItems: MenuItem[];
  isLoading: boolean;
  error: Error | null;
}

export const useMenus = () => {
  const [state, setState] = useState<MenusState>({
    primaryMenuItems: [
      {
        title: "Accueil",
        path: "/",
      },
      {
        title: "Services",
        path: "/services",
        children: [
          {
            title: "Centre d'Appels",
            path: "/services/call-center",
          },
          {
            title: "Vente en Ligne",
            path: "/services/online-sales",
          },
          {
            title: "Système de Téléphonie",
            path: "/services/telephony-system",
          },
        ],
      },
      {
        title: "Blog",
        path: "/blog",
      },
      {
        title: "Recrutement",
        path: "/recruitment",
      },
      {
        title: "À propos",
        path: "/about",
      },
      {
        title: "Contact",
        path: "/contact",
      },
    ],
    footerMenuItems: [
      {
        title: "Accueil",
        path: "/",
      },
      {
        title: "Services",
        path: "/services",
      },
      {
        title: "Blog",
        path: "/blog",
      },
      {
        title: "FAQ",
        path: "/faq",
      },
      {
        title: "À propos",
        path: "/about",
      },
      {
        title: "Contact",
        path: "/contact",
      },
    ],
    isLoading: false,
    error: null,
  });

  const loadMenus = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Récupérer le menu principal
      const { data: primaryMenu, error: primaryError } = await supabase
        .from('menus')
        .select('items')
        .eq('location', 'primary')
        .single();
        
      if (primaryError) throw primaryError;
      
      // Récupérer le menu de pied de page
      const { data: footerMenu, error: footerError } = await supabase
        .from('menus')
        .select('items')
        .eq('location', 'footer')
        .single();
        
      if (footerError) throw footerError;
      
      // Convertir les données JSON en MenuItems typés
      const parseJsonToMenuItems = (jsonItems: Json[] | null): MenuItem[] => {
        if (!jsonItems) return [];
        
        return jsonItems.map((item: any) => ({
          title: item.title || '',
          path: item.path || '',
          children: item.children ? parseJsonToMenuItems(item.children) : undefined
        }));
      };
      
      setState({
        primaryMenuItems: primaryMenu.items ? parseJsonToMenuItems(primaryMenu.items as Json[]) : state.primaryMenuItems,
        footerMenuItems: footerMenu.items ? parseJsonToMenuItems(footerMenu.items as Json[]) : state.footerMenuItems,
        isLoading: false,
        error: null
      });
      
    } catch (error) {
      console.error('Erreur lors du chargement des menus:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Erreur lors du chargement des menus')
      }));
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  return {
    ...state,
    refetch: loadMenus,
    reloadMenus: loadMenus
  };
};
