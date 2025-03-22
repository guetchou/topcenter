
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatarUrl?: string;
}

export const TestimonialCard = ({
  name,
  role,
  content,
  rating,
  avatarUrl,
}: TestimonialCardProps) => {
  return (
    <Card className="overflow-hidden card-hover border border-border/40">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
            <img
              src={avatarUrl || "/placeholder.svg"}
              alt={name}
              className="object-cover"
            />
          </Avatar>
          <div>
            <h4 className="font-semibold text-gradient">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
        <div className="flex mb-4 animate-fade-in">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? "text-primary fill-primary" : "text-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-muted-foreground hover:text-foreground transition-colors">
          "{content}"
        </p>
      </CardContent>
    </Card>
  );
};
