import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const { toast } = useToast();

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  const shareOnLinkedin = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans votre presse-papiers.",
      });
    });
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="icon" onClick={shareOnFacebook} aria-label="Partager sur Facebook">
        <Facebook className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={shareOnTwitter} aria-label="Partager sur Twitter">
        <Twitter className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={shareOnLinkedin} aria-label="Partager sur LinkedIn">
        <Linkedin className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copier le lien">
        <Link className="w-4 h-4" />
      </Button>
    </div>
  );
};