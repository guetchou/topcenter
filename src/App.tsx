
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { CMSLayout } from "@/pages/admin/CMSLayout";
import { DynamicNav } from "@/components/nav/DynamicNav";
import AdminDashboard from "@/pages/admin/Dashboard";
import MediasPage from "@/pages/admin/medias/MediasPage";
import CategoriesPage from "@/pages/admin/categories/CategoriesPage";
import ArticlesPage from "@/pages/admin/articles/ArticlesPage";
import ArticleEditor from "@/pages/admin/articles/ArticleEditor";
import MenusPage from "@/pages/admin/menus/MenusPage";
import SettingsPage from "@/pages/admin/settings/SettingsPage";
import Auth from "@/pages/Auth";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import BlogIndex from "./pages/blog/Index";
import BlogPost from "./pages/blog/[id]";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <DynamicNav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/auth" element={<Auth />} />

          {/* Routes CMS protégées */}
          <Route path="/admin" element={
            <AdminRoute>
              <CMSLayout />
            </AdminRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="medias" element={<MediasPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="articles/:id" element={<ArticleEditor />} />
            <Route path="menus" element={<MenusPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
};

export default App;
