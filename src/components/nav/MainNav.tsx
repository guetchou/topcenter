
import React from 'react';
import { Link } from 'react-router-dom';

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  return (
    <nav className={className}>
      <Link to="/" className="flex items-center space-x-2">
        <img src="/lovable-uploads/logo-topcenter.png" alt="TopCenter" className="h-8 w-auto" />
      </Link>
    </nav>
  );
}
