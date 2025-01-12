import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CallCenter from "./pages/services/CallCenter";
import OnlineSales from "./pages/services/OnlineSales";
import TelephonySystem from "./pages/services/TelephonySystem";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/services/call-center" element={<CallCenter />} />
        <Route path="/services/online-sales" element={<OnlineSales />} />
        <Route path="/services/telephony" element={<TelephonySystem />} />
      </Routes>
    </Router>
  );
}

export default App;