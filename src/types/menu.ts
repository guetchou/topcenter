
export interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  [key: string]: string | number; // Pour satisfaire l'index signature
}

export interface Menu {
  id: string;
  name: string;
  location: string;
  items: MenuItem[];
  created_at: string;
  updated_at: string;
}
