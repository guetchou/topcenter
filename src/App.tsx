
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import Index from "@/pages/Index";
import BlogIndex from "@/pages/blog/Index";
import Recruitment from "@/pages/recruitment/Index";
import OnlineSales from "@/pages/services/OnlineSales";
import TelephonySystem from "@/pages/services/TelephonySystem";
import CallCenter from "@/pages/services/CallCenter";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import Training from "@/pages/Training";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Services from "@/pages/Services";
import TrainingContent from "@/pages/TrainingContent";
import TrainerDashboard from "@/pages/trainer/Dashboard";

const App = () => {
  return (
    <Router>
      <PerformanceMonitor />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/training" element={<Training />} />
        <Route path="/training/content/:materialId" element={<TrainingContent />} />
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/services/online-sales" element={<OnlineSales />} />
        <Route path="/services/telephony-system" element={<TelephonySystem />} />
        <Route path="/services/call-center" element={<CallCenter />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
