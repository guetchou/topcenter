
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { CMSLayout } from "@/pages/admin/CMSLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import MediasPage from "@/pages/admin/medias/MediasPage";
import CategoriesPage from "@/pages/admin/categories/CategoriesPage";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import BlogIndex from "./pages/blog/Index";
import BlogPost from "./pages/blog/[id]";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:id" element={<BlogPost />} />

        {/* Routes CMS */}
        <Route path="/admin" element={<CMSLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="medias" element={<MediasPage />} />
          <Route path="categories" element={<CategoriesPage />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
