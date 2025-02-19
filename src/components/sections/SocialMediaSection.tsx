
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

const socialPosts = [
  {
    id: 1,
    type: "story",
    image: "https://images.unsplash.com/photo-1487528278747-ba99ed528ebc",
    caption: "Notre équipe en action! 💪 #ServiceClient #Innovation",
    likes: 234,
    comments: 45,
    author: "TechCall Solutions",
    tag: "Story"
  },
  {
    id: 2,
    type: "post",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902",
    caption: "Formation continue de nos agents avec les dernières technologies! 🎓 #Formation #Excellence",
    likes: 567,
    comments: 89,
    author: "TechCall Academy",
    tag: "Formation"
  },
  {
    id: 3,
    type: "story",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    caption: "Découvrez notre nouveau centre d'appels intelligent! ✨ #Innovation #IA",
    likes: 789,
    comments: 123,
    author: "TechCall Innovation",
    tag: "Nouveauté"
  },
  {
    id: 4,
    type: "post",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    caption: "Célébration de notre 1000ème client satisfait! 🎉 #Réussite #ServiceClient",
    likes: 432,
    comments: 67,
    author: "TechCall Success",
    tag: "Succès"
  }
];

export const SocialMediaSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Suivez Notre Actualité</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre quotidien et nos succès sur les réseaux sociaux
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {socialPosts.map((post) => (
              <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full hover-lift">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                          {post.tag}
                        </Badge>
                      </div>
                      <div className="aspect-[4/5] overflow-hidden rounded-t-lg">
                        <img
                          src={post.image}
                          alt={post.caption}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-sm">{post.author}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{post.caption}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-muted-foreground hover:text-primary transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="text-muted-foreground hover:text-primary transition-colors">
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
