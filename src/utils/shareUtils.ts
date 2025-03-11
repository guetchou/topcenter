
/**
 * Utilitaire pour partager du contenu via l'API Web Share ou copier dans le presse-papier
 */
import { toast } from "sonner";

interface ShareOptions {
  title: string;
  text?: string;
  url: string;
  hashtags?: string[];
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

/**
 * Partage du contenu en utilisant l'API Web Share quand disponible,
 * sinon copie l'URL dans le presse-papier
 */
export const shareContent = async (options: ShareOptions): Promise<boolean> => {
  const { title, text, url, hashtags = [], onSuccess, onError } = options;
  
  try {
    // Vérifier si l'API Web Share est disponible
    if (navigator.share) {
      await navigator.share({
        title,
        text: text || title,
        url,
      });
      
      if (onSuccess) onSuccess();
      return true;
    } else {
      // Fallback: copier l'URL dans le presse-papier
      await navigator.clipboard.writeText(url);
      toast.success("Le lien a été copié dans le presse-papier.");
      
      if (onSuccess) onSuccess();
      return true;
    }
  } catch (error) {
    console.error("Erreur lors du partage:", error);
    
    // Si l'utilisateur a annulé le partage, ne pas afficher d'erreur
    if (error instanceof Error && error.name === "AbortError") {
      return false;
    }
    
    // Tentative de fallback en cas d'échec
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Le lien a été copié dans le presse-papier.");
      if (onSuccess) onSuccess();
      return true;
    } catch (clipboardError) {
      toast.error("Impossible de partager le contenu.");
      if (onError) onError(error);
      return false;
    }
  }
};

/**
 * Partage spécifique pour les réseaux sociaux
 */
export const shareSocial = (platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp', options: ShareOptions): void => {
  const { title, text, url, hashtags = [] } = options;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = text ? encodeURIComponent(text) : '';
  const encodedHashtags = hashtags.join(',');
  
  let shareUrl = '';
  
  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      break;
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
      break;
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};

export default {
  shareContent,
  shareSocial
};
