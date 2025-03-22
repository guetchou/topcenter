
import { Routes, Route } from "react-router-dom";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { SettingsPage } from "@/pages/admin/settings/SettingsPage";
import { CMSLayout } from "@/pages/admin/CMSLayout";
import UserManagement from "@/pages/admin/UserManagement";
import { UserCredentialsPage } from "@/pages/admin/settings/UserCredentialsPage";
import { CredentialsDocPage } from "@/pages/admin/CredentialsDocPage";
import DeployDashboard from "@/pages/DeployDashboard";
import ChatBotsSettingsPage from "@/pages/admin/settings/ChatBotsSettingsPage";
import NewsManagementPage from "@/pages/admin/news/NewsManagementPage";
import NewsEditorPage from "@/pages/admin/news/NewsEditorPage";
import NewsCollaboratorsPage from "@/pages/admin/news/NewsCollaboratorsPage";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<CMSLayout />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/credentials" element={<UserCredentialsPage />} />
        <Route path="/credentials/docs" element={<CredentialsDocPage />} />
        <Route path="/deploy" element={<DeployDashboard />} />
        <Route path="/chatbots" element={<ChatBotsSettingsPage />} />
        {/* Routes de gestion des actualités */}
        <Route path="/news" element={<NewsManagementPage />} />
        <Route path="/news/create" element={<NewsEditorPage />} />
        <Route path="/news/edit/:id" element={<NewsEditorPage />} />
        <Route path="/news/collaborators/:id" element={<NewsCollaboratorsPage />} />
      </Route>
    </Routes>
  );
};
