import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsSearch } from "@/components/NewsSearch";
import { NewsGrid } from "@/components/NewsGrid";

const BlogIndex = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="container py-8">
      <Breadcrumbs />
      <h1 className="text-3xl font-bold mb-8">Blog & Actualités</h1>

      <div className="max-w-xl mb-8">
        <NewsSearch onSearch={setSearchTerm} />
      </div>

      <NewsGrid />
    </div>
  );
};

export default BlogIndex;