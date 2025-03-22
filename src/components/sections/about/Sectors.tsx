
import { Card, CardContent } from "@/components/ui/card";
import { Building, ShoppingCart, Heart, Radio, Truck, Building2, PlaneLanding, Scale } from "lucide-react";

export const Sectors = () => {
  const sectors = [
    { icon: Building, title: "Banques & Assurances" },
    { icon: ShoppingCart, title: "Commerce & Distribution" },
    { icon: Heart, title: "Santé & Pharmacie" },
    { icon: Radio, title: "Télécommunications & IT" },
    { icon: Truck, title: "Transport & Logistique" },
    { icon: Building2, title: "Secteur Public & Administrations" },
    { icon: PlaneLanding, title: "Tourisme & Hôtellerie" },
    { icon: Scale, title: "Cabinets juridiques & professions libérales" }
  ];

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-center mb-8">Secteurs Cibles</h3>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {sectors.map((sector, index) => {
          const Icon = sector.icon;
          return (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className="w-6 h-6 text-primary" />
                <span className="font-medium">{sector.title}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
