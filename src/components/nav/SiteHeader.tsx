
import React from 'react';
import { cn } from '@/lib/utils';

interface SiteHeaderProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export function SiteHeader({ children, className, ...props }: SiteHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)} {...props}>
      {children}
    </header>
  );
}
