import { supabase } from "@/integrations/supabase/client";

export const seedTestimonials = async () => {
  const { error } = await supabase.from('testimonials').insert([
    {
      name: "Jean Dupont",
      role: "Directeur Commercial",
      company: "TechCorp",
      content: "Top Center a révolutionné notre service client. Leur équipe est professionnelle et réactive.",
      rating: 5
    },
    {
      name: "Marie Martin",
      role: "CEO",
      company: "InnovSolutions",
      content: "Un partenaire fiable qui comprend nos besoins et s'adapte à notre croissance.",
      rating: 5
    },
    {
      name: "Pierre Dubois",
      role: "Responsable Service Client",
      company: "E-Commerce Plus",
      content: "La qualité du service est exceptionnelle. Nos clients sont ravis du support fourni.",
      rating: 4
    }
  ]);

  if (error) {
    console.error("Error seeding testimonials:", error);
  }
};

export const seedBlogPosts = async () => {
  const { error } = await supabase.from('blog_posts').insert([
    {
      title: "L'avenir des centres d'appels au Congo",
      slug: "avenir-centres-appels-congo",
      content: "Le secteur des centres d'appels connaît une croissance explosive au Congo...",
      excerpt: "Découvrez les dernières tendances et innovations dans le secteur des centres d'appels au Congo.",
      status: "published",
      category: "Industrie",
      published_at: new Date().toISOString(),
      author_id: "00000000-0000-0000-0000-000000000000" // À remplacer par un vrai ID d'administrateur
    },
    {
      title: "Comment améliorer votre service client",
      slug: "ameliorer-service-client",
      content: "Un excellent service client est la clé du succès de toute entreprise...",
      excerpt: "Guide pratique pour optimiser votre relation client et fidéliser votre clientèle.",
      status: "published",
      category: "Conseils",
      published_at: new Date().toISOString(),
      author_id: "00000000-0000-0000-0000-000000000000" // À remplacer par un vrai ID d'administrateur
    },
    {
      title: "Top Center : Notre vision pour 2024",
      slug: "vision-2024",
      content: "Découvrez nos projets et ambitions pour l'année à venir...",
      excerpt: "Top Center dévoile sa stratégie et ses objectifs pour 2024.",
      status: "published",
      category: "Entreprise",
      published_at: new Date().toISOString(),
      author_id: "00000000-0000-0000-0000-000000000000" // À remplacer par un vrai ID d'administrateur
    }
  ]);

  if (error) {
    console.error("Error seeding blog posts:", error);
  }
};