
export interface MenuItem {
  id: string;
  label: string;
  url: string;
  parent_id?: string | null;
  order?: number;
}

export interface Menu {
  id: string;
  name: string;
  location: string;
  items: MenuItem[];
  created_at: string;
  updated_at: string;
}
