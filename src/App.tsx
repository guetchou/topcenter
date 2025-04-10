
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import NotFound from "@/pages/NotFound";
import DeployDashboard from "@/pages/DeployDashboard";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <MainNav />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/deploy" element={<DeployDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="bottom-right" richColors />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
