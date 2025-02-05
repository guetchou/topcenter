
export const TeamSection = () => {
  const teamMembers = [
    {
      image: "/lovable-uploads/8f79fc2c-326f-4a1e-8d24-361d456f2622.png",
      name: "Sarah",
      role: "Service Client"
    },
    {
      image: "/lovable-uploads/a47263a1-9408-45cf-945e-7c66674c3f41.png",
      name: "Michael",
      role: "Support Technique"
    },
    {
      image: "/lovable-uploads/0c9c13e2-5f32-45f1-bac4-3efc1c102488.png",
      name: "Emma",
      role: "Service Commercial"
    },
    {
      image: "/lovable-uploads/4ea5620b-c02b-4e92-93bc-d33a1c739a24.png",
      name: "John",
      role: "Support Client"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Notre Équipe</h2>
          <p className="text-muted-foreground">
            Des professionnels expérimentés à votre service 24h/24 et 7j/7
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
