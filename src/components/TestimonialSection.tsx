import { TestimonialCard } from "./TestimonialCard";

const TESTIMONIALS = [
  {
    name: "Jean Dupont",
    role: "Directeur Commercial",
    content: "Un service client exceptionnel qui a transformé notre relation avec nos clients.",
    rating: 5,
    avatarUrl: "/testimonials/avatar1.jpg"
  },
  {
    name: "Marie Claire",
    role: "Responsable Marketing",
    content: "L'équipe de Top Center a su s'adapter parfaitement à nos besoins spécifiques.",
    rating: 5,
    avatarUrl: "/testimonials/avatar2.jpg"
  },
  {
    name: "Paul Martin",
    role: "CEO",
    content: "Une expertise technique et une qualité de service remarquables.",
    rating: 4,
    avatarUrl: "/testimonials/avatar3.jpg"
  }
];

export const TestimonialSection = () => {
  return (
    <section className="py-20 bg-secondary/5">
      <div className="container">
        <h2 className="mb-12 text-3xl font-bold text-center">Ce que disent nos clients</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};