
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: 'draft' | 'published';
  category: string;
  featured_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const ArticlesPage = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: articles, isLoading, refetch } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Article[];
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Article supprimé avec succès");
      refetch();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'draft' | 'published') => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success("Statut mis à jour avec succès");
      refetch();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Button onClick={() => navigate("/admin/articles/new")}>
          <FileText className="w-4 h-4 mr-2" />
          Nouvel article
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : articles?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Aucun article trouvé
                  </TableCell>
                </TableRow>
              ) : (
                articles?.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      {article.title}
                    </TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>
                      <Select
                        value={article.status}
                        onValueChange={(value: 'draft' | 'published') => 
                          handleStatusChange(article.id, value)
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Brouillon</SelectItem>
                          <SelectItem value="published">Publié</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(article.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link to={`/blog/${article.slug}`} target="_blank">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/articles/${article.id}`)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticlesPage;
