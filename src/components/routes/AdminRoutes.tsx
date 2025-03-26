
import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

// Lazy loading pages for admin
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const PocketBaseDashboard = lazy(() => import('@/pages/admin/PocketBaseDashboard'));
const PocketBaseTest = lazy(() => import('@/pages/admin/PocketBaseTest'));
const SettingsPage = lazy(() => import('@/pages/admin/settings/SettingsPage'));
const UserCredentialsPage = lazy(() => import('@/pages/admin/settings/UserCredentialsPage'));
const ChatBotsSettingsPage = lazy(() => import('@/pages/admin/settings/ChatBotsSettingsPage'));
const NewsManagementPage = lazy(() => import('@/pages/admin/news/NewsManagementPage'));
const NewsEditorPage = lazy(() => import('@/pages/admin/news/NewsEditorPage'));
const NewsCollaboratorsPage = lazy(() => import('@/pages/admin/news/NewsCollaboratorsPage'));
const ArticlesPage = lazy(() => import('@/pages/admin/articles/ArticlesPage'));
const ArticleEditor = lazy(() => import('@/pages/admin/articles/ArticleEditor'));
const CategoriesPage = lazy(() => import('@/pages/admin/categories/CategoriesPage'));
const MenusPage = lazy(() => import('@/pages/admin/menus/MenusPage'));
const MediasPage = lazy(() => import('@/pages/admin/medias/MediasPage'));
const CMSLayout = lazy(() => import('@/pages/admin/CMSLayout'));
const CredentialsDocPage = lazy(() => import('@/pages/admin/CredentialsDocPage'));
const DatabaseExplorerPage = lazy(() => import('@/pages/admin/DatabaseExplorer'));

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="pocketbase" element={<PocketBaseDashboard />} />
      <Route path="pocketbase-test" element={<PocketBaseTest />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="settings/user-credentials" element={<UserCredentialsPage />} />
      <Route path="settings/chatbots" element={<ChatBotsSettingsPage />} />
      <Route path="news" element={<NewsManagementPage />} />
      <Route path="news/editor/:id?" element={<NewsEditorPage />} />
      <Route path="news/collaborators" element={<NewsCollaboratorsPage />} />
      <Route path="articles" element={<ArticlesPage />} />
      <Route path="articles/editor/:id?" element={<ArticleEditor />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="menus" element={<MenusPage />} />
      <Route path="medias" element={<MediasPage />} />
      <Route path="cms-layout" element={<CMSLayout />} />
      <Route path="credentials-doc" element={<CredentialsDocPage />} />
      
      <Route path="database-explorer" element={<DatabaseExplorerPage />} />
    </Routes>
  );
};

export default AdminRoutes;
