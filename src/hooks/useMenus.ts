
import { useQuery } from "@tanstack/react-query";

export interface Menu {
  id: string;
  title: string;
  path: string;
  location: string;
}

const fetchMenus = async (location: string): Promise<Menu[]> => {
  // Simulate API call
  return [
    { id: '1', title: 'Accueil', path: '/', location: 'header' },
    { id: '2', title: 'Services', path: '/services', location: 'header' },
    { id: '3', title: 'Contact', path: '/contact', location: 'header' },
  ];
};

export const useMenus = (location: string = 'header') => {
  return useQuery({
    queryKey: ['menus', location],
    queryFn: () => fetchMenus(location),
  });
};
