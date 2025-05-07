
import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Afficher le bouton uniquement lorsque la page est défilée
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Défiler vers le haut en douceur
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-16 right-4 z-40 p-2 rounded-full shadow-lg"
          size="icon"
          aria-label="Retour en haut"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}

export default ScrollToTop;
