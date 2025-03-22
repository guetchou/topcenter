
import { Route, Routes } from 'react-router-dom';
import Dashboard from '@/pages/admin/Dashboard';
import UserManagement from '@/pages/admin/UserManagement';
import CMSLayout from '@/pages/admin/CMSLayout';
import ArticlesPage from '@/pages/admin/articles/ArticlesPage';
import ArticleEditor from '@/pages/admin/articles/ArticleEditor';
import CategoriesPage from '@/pages/admin/categories/CategoriesPage';
import MediasPage from '@/pages/admin/medias/MediasPage';
import MenusPage from '@/pages/admin/menus/MenusPage';
import SettingsPage from '@/pages/admin/settings/SettingsPage';
import { AdminRoute } from '../auth/AdminRoute';
import AdminSettings from '@/pages/admin/AdminSettings';

export const AdminRoutes = () => {
  return (
    <AdminRoute>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<AdminSettings />} />
        
        {/* Routes CMS */}
        <Route path="cms" element={<CMSLayout />}>
          <Route index element={<ArticlesPage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/new" element={<ArticleEditor />} />
          <Route path="articles/:id" element={<ArticleEditor />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="medias" element={<MediasPage />} />
          <Route path="menus" element={<MenusPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AdminRoute>
  );
};

export default AdminRoutes;
