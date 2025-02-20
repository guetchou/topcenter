
import { useQuery } from "@tanstack/react-query";

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  parent_id?: string | null;
}

export interface Menu {
  id: string;
  title: string;
  items: MenuItem[];
  location: string;
}

const fetchMenus = async (location: string): Promise<Menu[]> => {
  // Simulate API call
  return [
    {
      id: '1',
      title: 'Navigation principale',
      location: 'header',
      items: [
        { id: '1', label: 'Accueil', url: '/' },
        { id: '2', label: 'Services', url: '/services' },
        { id: '3', label: 'Contact', url: '/contact' }
      ]
    }
  ];
};

export const useMenus = (location: string = 'header') => {
  return useQuery({
    queryKey: ['menus', location],
    queryFn: () => fetchMenus(location),
  });
};
