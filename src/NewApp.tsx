
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { NotificationsProvider } from "@/components/notifications/NotificationsProvider";
import { Toaster } from "sonner";

// Components
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";

// Pages
import HomeNew from "@/pages/HomeNew";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

/**
 * Version alternative de l'application avec le nouveau design
 * Pour tester sans impacter l'application existante
 */
const NewApp = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider>
          {/* Utilise le nouveau design du MainNav */}
          <MainNav useNewDesign={true} />
          
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<HomeNew />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Footer />
          <Toaster position="bottom-right" richColors />
        </NotificationsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default NewApp;
