
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importations corrigées avec lazily loaded components
const AdminDashboard = React.lazy(() => import('@/pages/admin/Dashboard'));
const UserManagement = React.lazy(() => import('@/pages/admin/UserManagement'));
const ArticlesPage = React.lazy(() => import('@/pages/admin/articles/ArticlesPage'));
const ArticleEditor = React.lazy(() => import('@/pages/admin/articles/ArticleEditor'));
const CategoriesPage = React.lazy(() => import('@/pages/admin/categories/CategoriesPage'));
const MediasPage = React.lazy(() => import('@/pages/admin/medias/MediasPage'));
const NewsManagementPage = React.lazy(() => import('@/pages/admin/news/NewsManagementPage'));
const NewsEditorPage = React.lazy(() => import('@/pages/admin/news/NewsEditorPage'));
const NewsCollaboratorsPage = React.lazy(() => import('@/pages/admin/news/NewsCollaboratorsPage'));
const MenusPage = React.lazy(() => import('@/pages/admin/menus/MenusPage'));
const SettingsPage = React.lazy(() => import('@/pages/admin/settings/SettingsPage'));
const UserCredentialsPage = React.lazy(() => import('@/pages/admin/settings/UserCredentialsPage'));
const ChatBotsSettingsPage = React.lazy(() => import('@/pages/admin/settings/ChatBotsSettingsPage'));
const CMSLayout = React.lazy(() => import('@/pages/admin/CMSLayout'));
const CredentialsDocPage = React.lazy(() => import('@/pages/admin/CredentialsDocPage'));
const DatabaseConnection = React.lazy(() => import('@/pages/admin/DatabaseConnection'));
const DatabaseMigration = React.lazy(() => import('@/pages/admin/DatabaseMigration'));
const DatabaseExplorerPage = React.lazy(() => import('@/pages/admin/DatabaseExplorerPage'));
const DeployDashboard = React.lazy(() => import('@/pages/DeployDashboard'));
const PocketBaseTest = React.lazy(() => import('@/pages/admin/PocketBaseTest'));
const PocketBaseDashboard = React.lazy(() => import('@/pages/admin/PocketBaseDashboard'));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="cms" element={<CMSLayout />} />
      <Route path="articles" element={<ArticlesPage />} />
      <Route path="articles/new" element={<ArticleEditor />} />
      <Route path="articles/:id" element={<ArticleEditor />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="medias" element={<MediasPage />} />
      <Route path="news" element={<NewsManagementPage />} />
      <Route path="news/new" element={<NewsEditorPage />} />
      <Route path="news/:id" element={<NewsEditorPage />} />
      <Route path="news/collaborators" element={<NewsCollaboratorsPage />} />
      <Route path="menus" element={<MenusPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="settings/users" element={<UserCredentialsPage />} />
      <Route path="settings/chatbots" element={<ChatBotsSettingsPage />} />
      <Route path="credentials" element={<CredentialsDocPage />} />
      <Route path="database-connection" element={<DatabaseConnection />} />
      <Route path="database-migration" element={<DatabaseMigration />} />
      <Route path="database-explorer" element={<DatabaseExplorerPage />} />
      <Route path="pocketbase-test" element={<PocketBaseTest />} />
      <Route path="pocketbase-dashboard" element={<PocketBaseDashboard />} />
      <Route path="deploy" element={<DeployDashboard />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
