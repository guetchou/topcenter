
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { AnimationWrapper } from './AnimationWrapper';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { directusService } from '@/services/directus';
import { supabase } from '@/integrations/supabase/client';

type SearchResult = {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'page' | 'blog' | 'service' | 'team' | 'faq';
  icon?: string;
};

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Sections statiques qui seront toujours recherchables même hors ligne
  const staticPages: SearchResult[] = [
    { id: 'home', title: 'Accueil', description: 'Page d\'accueil de TopCenter', url: '/', type: 'page', icon: 'home' },
    { id: 'services', title: 'Nos Services', description: 'Découvrez nos services de centre d\'appels', url: '/services', type: 'page', icon: 'phone' },
    { id: 'call-center', title: 'Centre d\'appels', description: 'Services de centre d\'appels professionnels', url: '/services/call-center', type: 'service', icon: 'headset' },
    { id: 'online-sales', title: 'Vente en ligne', description: 'Services de vente en ligne et télémarketing', url: '/services/online-sales', type: 'service', icon: 'shopping-cart' },
    { id: 'telephony', title: 'Téléphonie', description: 'Solutions de téléphonie avancées', url: '/services/telephony-system', type: 'service', icon: 'phone-call' },
    { id: 'contact', title: 'Contact', description: 'Contactez notre équipe', url: '/contact', type: 'page', icon: 'mail' },
    { id: 'about', title: 'À propos', description: 'Découvrez TopCenter', url: '/about', type: 'page', icon: 'info' },
    { id: 'faq', title: 'FAQ', description: 'Questions fréquemment posées', url: '/faq', type: 'page', icon: 'help-circle' },
  ];

  // Recherche dynamique des blogs, membres de l'équipe et FAQ via Supabase
  const { data: dynamicResults, isLoading } = useQuery({
    queryKey: ['global-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      try {
        // Recherche de blogs
        const blogsPromise = supabase
          .from('blog_posts')
          .select('id, title, excerpt, slug')
          .eq('status', 'published')
          .ilike('title', `%${searchTerm}%`)
          .limit(5);
        
        // Recherche de membres d'équipe
        const teamPromise = supabase
          .from('team_members')
          .select('id, name, role, slug')
          .ilike('name', `%${searchTerm}%`)
          .limit(5);
        
        // Recherche de FAQ
        const faqPromise = supabase
          .from('faq')
          .select('id, question, answer')
          .ilike('question', `%${searchTerm}%`)
          .limit(5);
        
        const [blogs, team, faq] = await Promise.all([
          blogsPromise,
          teamPromise,
          faqPromise
        ]);
        
        const results: SearchResult[] = [];
        
        // Traitement des blogs
        if (!blogs.error && blogs.data) {
          results.push(...blogs.data.map(blog => ({
            id: `blog-${blog.id}`,
            title: blog.title,
            description: blog.excerpt || 'Article de blog',
            url: `/blog/${blog.slug || blog.id}`,
            type: 'blog' as const,
            icon: 'file-text'
          })));
        }
        
        // Traitement des membres d'équipe
        if (!team.error && team.data) {
          results.push(...team.data.map(member => ({
            id: `team-${member.id}`,
            title: member.name,
            description: member.role || 'Membre de l\'équipe',
            url: `/about#team-${member.slug || member.id}`,
            type: 'team' as const,
            icon: 'user'
          })));
        }
        
        // Traitement des FAQ
        if (!faq.error && faq.data) {
          results.push(...faq.data.map(item => ({
            id: `faq-${item.id}`,
            title: item.question,
            description: item.answer.substring(0, 100) + '...',
            url: `/faq#question-${item.id}`,
            type: 'faq' as const,
            icon: 'help-circle'
          })));
        }
        
        return results;
      } catch (error) {
        console.error("Erreur de recherche:", error);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: searchTerm.length >= 2,
  });

  // Focus automatique sur l'input quand la modal s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Combinaison des résultats statiques et dynamiques
  const filteredStaticResults = searchTerm.length >= 2 
    ? staticPages.filter(page => 
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        page.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const allResults = [...filteredStaticResults, ...(dynamicResults || [])];

  // Navigation et fermeture du dialogue
  const handleResultClick = (url: string) => {
    setIsOpen(false);
    navigate(url);
    setSearchTerm('');
  };

  // Raccourci clavier pour ouvrir la recherche (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Rechercher</span>
          <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs text-muted-foreground ml-2">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px] p-0">
        <div className="flex items-center border-b p-4">
          <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher sur TopCenter..."
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none focus-visible:ring-0"
          />
          {searchTerm && (
            <X 
              className="h-5 w-5 cursor-pointer opacity-70 hover:opacity-100 ml-2" 
              onClick={() => setSearchTerm('')}
            />
          )}
        </div>
        
        <div className="max-h-[50vh] overflow-y-auto px-4 py-2">
          {!searchTerm && (
            <div className="text-center p-4 text-sm text-muted-foreground">
              Tapez au moins 2 caractères pour rechercher
            </div>
          )}
          
          {searchTerm.length >= 2 && isLoading && (
            <div className="text-center p-4 text-sm text-muted-foreground">
              Recherche en cours...
            </div>
          )}
          
          {searchTerm.length >= 2 && !isLoading && allResults.length === 0 && (
            <div className="text-center p-4 text-sm text-muted-foreground">
              Aucun résultat trouvé pour "{searchTerm}"
            </div>
          )}
          
          {allResults.length > 0 && (
            <div className="space-y-4">
              <AnimationWrapper type="fade-in" duration={400}>
                {allResults.map((result, index) => (
                  <div
                    key={result.id}
                    className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleResultClick(result.url)}
                    tabIndex={0}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Search className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {result.description}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground/70">
                        {result.type === 'page' && "Page"}
                        {result.type === 'blog' && "Article de blog"}
                        {result.type === 'service' && "Service"}
                        {result.type === 'team' && "Membre de l'équipe"}
                        {result.type === 'faq' && "FAQ"}
                      </div>
                    </div>
                  </div>
                ))}
              </AnimationWrapper>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between p-4 border-t text-xs text-muted-foreground">
          <div>
            <span className="hidden md:inline">Naviguez avec</span> ↑↓, 
            <span className="hidden md:inline">sélectionnez avec</span> Enter
          </div>
          <DialogClose asChild>
            <Button variant="outline" size="sm">Fermer</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
