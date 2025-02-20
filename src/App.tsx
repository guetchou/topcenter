import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProviders } from "./providers/AppProviders";
import { LanguageSelector } from "./components/LanguageSelector";
import { ThemeToggle } from "./components/ThemeToggle";
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

const queryClient = new QueryClient();

function App() {
  const intl = useIntl();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50" role="banner">
          <div className="container flex items-center justify-between py-4">
            <DynamicNav />
            <div className="flex items-center gap-4">
              <LanguageSelector
                onLanguageChange={(locale) => {
                  // Handle language change
                }}
                currentLocale={intl.locale}
              />
              <ThemeToggle />
            </div>
          </div>
        </header>
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
