
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
  Bot,
  Newspaper,
  BarChart,
  MessageSquare,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { FormattedMessage } from 'react-intl';

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
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
          <FormattedMessage id="admin.dashboard" defaultMessage="Tableau de bord" />
        </h3>
        <div className="space-y-1">
          <NavLink href="/admin" icon={LayoutDashboard} end>
            <FormattedMessage id="admin.overview" defaultMessage="Vue d'ensemble" />
          </NavLink>
          <NavLink href="/admin/analytics" icon={BarChart}>
            <FormattedMessage id="admin.analytics" defaultMessage="Analytiques" />
          </NavLink>
        </div>
      </div>

      <div>
        <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
          <FormattedMessage id="admin.content" defaultMessage="Contenu" />
        </h3>
        <div className="space-y-1">
          <NavLink href="/admin/news" icon={Newspaper}>
            <FormattedMessage id="admin.news" defaultMessage="Actualités" />
          </NavLink>
          <NavLink href="/admin/articles" icon={FileText}>
            <FormattedMessage id="admin.articles" defaultMessage="Articles" />
          </NavLink>
          <NavLink href="/admin/categories" icon={Tag}>
            <FormattedMessage id="admin.categories" defaultMessage="Catégories" />
          </NavLink>
          <NavLink href="/admin/medias" icon={Image}>
            <FormattedMessage id="admin.media" defaultMessage="Médiathèque" />
          </NavLink>
          <NavLink href="/admin/menus" icon={Menu}>
            <FormattedMessage id="admin.menus" defaultMessage="Menus" />
          </NavLink>
        </div>
      </div>

      <div>
        <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
          <FormattedMessage id="admin.system" defaultMessage="Système" />
        </h3>
        <div className="space-y-1">
          <NavLink href="/admin/users" icon={Users}>
            <FormattedMessage id="admin.users" defaultMessage="Utilisateurs" />
          </NavLink>
          <NavLink href="/admin/credentials" icon={Key}>
            <FormattedMessage id="admin.credentials" defaultMessage="Identifiants" />
          </NavLink>
          <NavLink href="/admin/deploy" icon={Rocket}>
            <FormattedMessage id="admin.deployment" defaultMessage="Déploiement" />
          </NavLink>
          <NavLink href="/admin/chatbots" icon={Bot}>
            <FormattedMessage id="admin.chatbots" defaultMessage="Chatbots" />
          </NavLink>
          <NavLink href="/admin/settings" icon={Settings}>
            <FormattedMessage id="admin.settings" defaultMessage="Paramètres" />
          </NavLink>
        </div>
      </div>

      <div>
        <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
          <FormattedMessage id="admin.advanced" defaultMessage="Avancé" />
        </h3>
        <div className="space-y-1">
          <NavLink href="/admin/localization" icon={Globe}>
            <FormattedMessage id="admin.localization" defaultMessage="Localisation" />
          </NavLink>
          <NavLink href="/admin/security" icon={ShieldCheck}>
            <FormattedMessage id="admin.security" defaultMessage="Sécurité" />
          </NavLink>
          <NavLink href="/admin/chat-support" icon={MessageSquare}>
            <FormattedMessage id="admin.chat" defaultMessage="Support Chat" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};
