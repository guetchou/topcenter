
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, BarChart2, Settings, FileText, Menu, Database, Image, Tag, Layout, Shield } from 'lucide-react';

export const adminLinks = [
  { to: "/admin/dashboard", icon: <BarChart2 size={18} />, label: "Tableau de bord" },
  { to: "/admin/users", icon: <Users size={18} />, label: "Utilisateurs" },
  { to: "/admin/news", icon: <FileText size={18} />, label: "Actualités" },
  { to: "/admin/articles", icon: <FileText size={18} />, label: "Articles" },
  { to: "/admin/categories", icon: <Tag size={18} />, label: "Catégories" },
  { to: "/admin/menus", icon: <Menu size={18} />, label: "Menus" },
  { to: "/admin/medias", icon: <Image size={18} />, label: "Médias" },
  { to: "/admin/cms-layout", icon: <Layout size={18} />, label: "Mise en page" },
  { to: "/admin/settings", icon: <Settings size={18} />, label: "Paramètres" },
  { to: "/admin/pocketbase", icon: <Database size={18} />, label: "PocketBase" },
  { to: "/admin/credentials-doc", icon: <Shield size={18} />, label: "Identifiants" },
  { to: "/admin/database-explorer", icon: <Database size={18} />, label: "Explorateur BDD" }
];

const AdminNavLinks: React.FC = () => {
  return (
    <div className="space-y-1">
      {adminLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`
          }
        >
          <span className="mr-3">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </div>
  );
};

export default AdminNavLinks;
