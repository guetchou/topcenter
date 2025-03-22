
import React from 'react';
import { cn } from '@/lib/utils';

type AnimationType = 
  | 'fade-in' 
  | 'fade-in-top' 
  | 'fade-in-bottom' 
  | 'slide-in-left' 
  | 'slide-in-right'
  | 'scale-in'
  | 'none';

interface AnimationWrapperProps {
  children: React.ReactNode;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  type = 'fade-in',
  delay = 0,
  duration = 500,
  className,
  once = true
}) => {
  if (type === 'none') {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <div 
      className={cn(`animate-${type}`, className)}
      style={{ 
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: once ? 'forwards' : 'none'
      }}
    >
      {children}
    </div>
  );
};

// Utilitaire pour créer facilement une séquence d'animations
export const AnimationSequence: React.FC<{
  children: React.ReactNode[];
  type?: AnimationType;
  delayBetween?: number;
  duration?: number;
  className?: string;
}> = ({ 
  children, 
  type = 'fade-in', 
  delayBetween = 100,
  duration = 500,
  className
}) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <AnimationWrapper
          type={type}
          delay={index * delayBetween}
          duration={duration}
          className={className}
        >
          {child}
        </AnimationWrapper>
      ))}
    </>
  );
};
