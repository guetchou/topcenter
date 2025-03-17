
/**
 * Utilitaires pour les animations
 */

// Génère un délai aléatoire pour les animations
export const randomDelay = (min = 0, max = 1) => {
  return Math.random() * (max - min) + min;
};

// Préréglages pour framer-motion
export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  },
  bounce: {
    animate: { 
      y: [0, -10, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  },
  pulse: {
    animate: { 
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  }
};

// Génère un effet de décalage pour les listes d'éléments
export const staggerChildren = (delay = 0.1) => ({
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      staggerChildren: delay
    }
  }
});

// Effet d'écriture de texte
export const typewriterEffect = (text: string, speed = 50) => {
  let i = 0;
  return new Promise<void>((resolve) => {
    const element = document.getElementById('typewriter');
    if (!element) {
      resolve();
      return;
    }
    
    element.textContent = '';
    
    const typeNextChar = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeNextChar, speed);
      } else {
        resolve();
      }
    };
    
    typeNextChar();
  });
};
