import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainNav } from "./components/MainNav";
import { Breadcrumbs } from "./components/Breadcrumbs";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import CallCenter from "./pages/services/CallCenter";
import OnlineSales from "./pages/services/OnlineSales";
import TelephonySystem from "./pages/services/TelephonySystem";

function App() {
  return (
    <Router>
      <MainNav />
      <div className="pt-20 container mx-auto px-4">
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services/call-center" element={<CallCenter />} />
          <Route path="/services/online-sales" element={<OnlineSales />} />
          <Route path="/services/telephony" element={<TelephonySystem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;