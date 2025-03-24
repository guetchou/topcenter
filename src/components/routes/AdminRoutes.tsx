
import { Navigate, Routes, Route } from "react-router-dom";
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
import PocketBaseTestPage from "@/pages/admin/PocketBaseTest";
import { useAuth } from "@/hooks/useAuth";

export const AdminRoutes = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Vérifier que l'utilisateur est authentifié et a le rôle d'administrateur
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<CMSLayout />}>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/credentials" element={<UserCredentialsPage />} />
        <Route path="/credentials/docs" element={<CredentialsDocPage />} />
        <Route path="/deploy" element={<DeployDashboard />} />
        <Route path="/chatbots" element={<ChatBotsSettingsPage />} />
        <Route path="/pocketbase-test" element={<PocketBaseTestPage />} />
        {/* Routes de gestion des actualités */}
        <Route path="/news" element={<NewsManagementPage />} />
        <Route path="/news/create" element={<NewsEditorPage />} />
        <Route path="/news/edit/:id" element={<NewsEditorPage />} />
        <Route path="/news/collaborators/:id" element={<NewsCollaboratorsPage />} />
      </Route>
    </Routes>
  );
};
