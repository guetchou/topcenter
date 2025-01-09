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
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-12 h-12">
            <img
              src={avatarUrl || "/placeholder.svg"}
              alt={name}
              className="object-cover"
            />
          </Avatar>
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? "text-accent fill-accent" : "text-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
  );
};