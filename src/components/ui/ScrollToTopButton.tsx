
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ScrollToTopButtonProps {
  showAtHeight?: number;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary';
  smooth?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

export const ScrollToTopButton = ({
  showAtHeight = 300,
  className,
  size = 'icon',
  variant = 'secondary',
  smooth = true,
  icon = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="m18 15-6-6-6 6"/>
    </svg>
  ),
  label = 'Retour en haut',
}: ScrollToTopButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > showAtHeight);
    };

    window.addEventListener('scroll', toggleVisibility);
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showAtHeight]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <Button
      className={cn(
        'fixed bottom-4 right-4 z-50 rounded-full shadow-lg transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none',
        className
      )}
      size={size}
      variant={variant}
      onClick={scrollToTop}
      aria-label={label}
    >
      {icon}
      {size !== 'icon' && label}
    </Button>
  );
};

export default ScrollToTopButton;
