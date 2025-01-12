import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import NewsAdmin from "./pages/NewsAdmin";
import Analytics from "./pages/Analytics";
import AgentDashboard from "./pages/AgentDashboard";
import ClientPortal from "./pages/ClientPortal";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Training from "./pages/Training";
import Support from "./pages/Support";
import CallCenter from "./pages/services/CallCenter";
import BlogIndex from "./pages/blog/Index";
import Recruitment from "./pages/recruitment/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/actualites" element={<News />} />
          <Route path="/actualites/:id" element={<NewsDetail />} />
          <Route path="/admin/actualites" element={<NewsAdmin />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
          <Route path="/client-portal" element={<ClientPortal />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/training" element={<Training />} />
          <Route path="/support" element={<Support />} />
          <Route path="/services/call-center" element={<CallCenter />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/recrutement" element={<Recruitment />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;