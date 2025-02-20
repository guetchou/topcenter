
import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useIntl } from "react-intl";
import { DynamicNav } from "./components/nav/DynamicNav";
import { HeroSection } from "./components/sections/HeroSection";
import { FeaturesSection } from "./components/sections/FeaturesSection";
import { CallToActionSection } from "./components/sections/CallToActionSection";
import { PartnersSection } from "./components/sections/PartnersSection";
import { TeamSection } from "./components/sections/TeamSection";
import { TestimonialsSection } from "./components/sections/TestimonialsSection";
import { BlogSection } from "./components/sections/BlogSection";
import { ContactSection } from "./components/sections/ContactSection";
import { AIChatBubble } from "./components/ChatBubble";
import { queryClient } from "./lib/react-query";

function HomePage() {
  return (
    <>
      <main role="main" className="flex-1">
        <HeroSection />
        <FeaturesSection />
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
          <Route path="/devis" element={<ContactSection />} />
          <Route path="/services" element={<FeaturesSection />} />
          <Route path="/contact" element={<ContactSection />} />
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
