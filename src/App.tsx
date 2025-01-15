import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import BlogIndex from "./pages/blog/Index";
import { MainNav } from "./components/MainNav";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MainNav />
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/actualites" element={<News />} />
            <Route path="/actualites/:id" element={<NewsDetail />} />
            <Route path="/blog" element={<BlogIndex />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;