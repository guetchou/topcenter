
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  Image, 
  Tag,
  Menu,
  Key,
  Rocket,
  Bot
} from 'lucide-react';

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  end?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon: Icon, children, end }) => {
  const location = useLocation();
  const isActive = end 
    ? location.pathname === href
    : location.pathname.startsWith(href);

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
};

export const AdminNavLinks: React.FC = () => {
  return (
    <div className="space-y-1">
      <NavLink href="/admin/dashboard" icon={LayoutDashboard} end>
        Tableau de bord
      </NavLink>
      <NavLink href="/admin/users" icon={Users}>
        Utilisateurs
      </NavLink>
      <NavLink href="/admin/credentials" icon={Key}>
        Identifiants
      </NavLink>
      <NavLink href="/admin/articles" icon={FileText}>
        Articles
      </NavLink>
      <NavLink href="/admin/categories" icon={Tag}>
        Catégories
      </NavLink>
      <NavLink href="/admin/medias" icon={Image}>
        Médiathèque
      </NavLink>
      <NavLink href="/admin/menus" icon={Menu}>
        Menus
      </NavLink>
      <NavLink href="/admin/deploy" icon={Rocket}>
        Déploiement
      </NavLink>
      <NavLink href="/admin/chatbots" icon={Bot}>
        Chatbots
      </NavLink>
      <NavLink href="/admin/settings" icon={Settings}>
        Paramètres
      </NavLink>
    </div>
  );
};
