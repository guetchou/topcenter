import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Jean Dupont",
      role: "Directeur Commercial",
      company: "Tech Solutions Congo",
      content: "Top Center a révolutionné notre service client. Leur équipe est professionnelle et efficace.",
      rating: 5
    },
    {
      name: "Marie Kodia",
      role: "CEO",
      company: "Digital Africa",
      content: "Un partenaire fiable pour notre centre d'appels. Je recommande vivement leurs services.",
      rating: 5
    },
    {
      name: "Paul Mbemba",
      role: "Responsable Support",
      company: "Telecom Plus",
      content: "L'expertise de Top Center en matière de relation client est impressionnante.",
      rating: 4
    }
  ];

  return (
    <section className="py-20 bg-secondary/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos clients</h2>
          <p className="text-muted-foreground">
            Découvrez les témoignages de nos clients satisfaits
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role} - {testimonial.company}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};