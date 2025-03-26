
import React from 'react';
import { LayoutDashboard, Users, FileText, Settings, Database, Layers, Upload, Menu, Webhook, HardDrive } from 'lucide-react';

export const adminLinks = [
  {
    to: '/admin/dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    label: 'Tableau de bord'
  },
  {
    to: '/admin/users',
    icon: <Users className="h-4 w-4" />,
    label: 'Utilisateurs'
  },
  {
    to: '/admin/articles',
    icon: <FileText className="h-4 w-4" />,
    label: 'Articles'
  },
  {
    to: '/admin/news',
    icon: <Layers className="h-4 w-4" />,
    label: 'Actualités'
  },
  {
    to: '/admin/medias',
    icon: <Upload className="h-4 w-4" />,
    label: 'Médias'
  },
  {
    to: '/admin/menus',
    icon: <Menu className="h-4 w-4" />,
    label: 'Menus'
  },
  {
    to: '/admin/database-connection',
    icon: <Database className="h-4 w-4" />,
    label: 'Connexion BDD'
  },
  {
    to: '/admin/database-migration',
    icon: <HardDrive className="h-4 w-4" />,
    label: 'Migration Infomaniak'
  },
  {
    to: '/deploy',
    icon: <Webhook className="h-4 w-4" />,
    label: 'Déploiement'
  },
  {
    to: '/admin/settings',
    icon: <Settings className="h-4 w-4" />,
    label: 'Paramètres'
  }
];

export default adminLinks;
