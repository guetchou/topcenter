
import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useIntl } from "react-intl";
import { DynamicNav } from "./components/nav/DynamicNav";
import { HeroSection } from "./components/sections/HeroSection";
import { AboutSection } from "./components/sections/AboutSection";
import { CallToActionSection } from "./components/sections/CallToActionSection";
import { PartnersSection } from "./components/sections/PartnersSection";
import { TeamSection } from "./components/sections/TeamSection";
import { TestimonialsSection } from "./components/sections/TestimonialsSection";
import { BlogSection } from "./components/sections/BlogSection";
import { ContactSection } from "./components/sections/ContactSection";
import { AIChatBubble } from "./components/ChatBubble";
import { queryClient } from "./lib/react-query";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import ClientPortal from "./pages/ClientPortal";
import NewsAdmin from "./pages/NewsAdmin";

function HomePage() {
  return (
    <>
      <main role="main" className="flex-1">
        <HeroSection />
        <AboutSection />
        <CallToActionSection />
        <PartnersSection />
        <TeamSection />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />
      </main>
    </>
  );
}

function App() {
  const intl = useIntl();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <DynamicNav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/devis" element={<ContactSection />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/news" element={<NewsAdmin />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/client" element={<ClientPortal />} />
        </Routes>
        <footer role="contentinfo" className="bg-muted py-8">
          <div className="container text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} TopCenter. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
      <AIChatBubble />
    </QueryClientProvider>
  );
}

export default App;
