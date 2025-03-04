
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MenuItemChild {
  title: string;
  path: string;
}

export interface MenuItem {
  title: string;
  path: string;
  children?: MenuItemChild[];
}

export const useMenus = () => {
  // Menu principal par défaut
  const defaultPrimaryMenu: MenuItem[] = [
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
  ];

  // Menu du footer par défaut
  const defaultFooterMenu: MenuItem[] = [
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
      title: "À propos",
      path: "/about",
    },
    {
      title: "Contact",
      path: "/contact",
    },
    {
      title: "Mentions Légales",
      path: "/legal",
    },
  ];

  const [primaryMenuItems, setPrimaryMenuItems] = useState<MenuItem[]>(
    defaultPrimaryMenu
  );
  const [footerMenuItems, setFooterMenuItems] = useState<MenuItem[]>(
    defaultFooterMenu
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      setIsLoading(true);
      try {
        // Récupérer le menu principal depuis Supabase
        const { data: primaryData, error: primaryError } = await supabase
          .from("menus")
          .select("items")
          .eq("location", "primary")
          .single();

        if (primaryError) {
          // Si erreur, utiliser le menu par défaut
          console.log("Utilisation du menu primaire par défaut");
        } else if (primaryData?.items) {
          setPrimaryMenuItems(primaryData.items as MenuItem[]);
        }

        // Récupérer le menu du footer depuis Supabase
        const { data: footerData, error: footerError } = await supabase
          .from("menus")
          .select("items")
          .eq("location", "footer")
          .single();

        if (footerError) {
          // Si erreur, utiliser le menu par défaut
          console.log("Utilisation du menu footer par défaut");
        } else if (footerData?.items) {
          setFooterMenuItems(footerData.items as MenuItem[]);
        }
      } catch (err: any) {
        setError(err);
        console.error("Erreur lors de la récupération des menus:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, []);

  return {
    primaryMenuItems,
    footerMenuItems,
    isLoading,
    error,
  };
};
