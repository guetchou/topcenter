
import { Routes, Route } from "react-router-dom";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { SettingsPage } from "@/pages/admin/settings/SettingsPage";
import { CMSLayout } from "@/pages/admin/CMSLayout";
import UserManagement from "@/pages/admin/UserManagement";
import { UserCredentialsPage } from "@/pages/admin/settings/UserCredentialsPage";
import { CredentialsDocPage } from "@/pages/admin/CredentialsDocPage";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<CMSLayout />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/credentials" element={<UserCredentialsPage />} />
        <Route path="/credentials/docs" element={<CredentialsDocPage />} />
      </Route>
    </Routes>
  );
};
