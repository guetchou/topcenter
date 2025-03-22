
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { AnimationWrapper } from '@/components/AnimationWrapper';

export const NavbarContent: React.FC = () => {
  return (
    <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 mr-4" aria-label="Navigation principale">
      <AnimationWrapper type="fade-in" duration={300}>
        <Link 
          to="/" 
          className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent transition-colors"
        >
          <FormattedMessage id="nav.home" defaultMessage="Accueil" />
        </Link>
        <Link 
          to="/services" 
          className="text-sm font-medium text-muted-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
        >
          <FormattedMessage id="nav.services" defaultMessage="Services" />
        </Link>
        <Link 
          to="/news" 
          className="text-sm font-medium text-muted-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
        >
          <FormattedMessage id="nav.news" defaultMessage="Actualités" />
        </Link>
        <Link 
          to="/blog" 
          className="text-sm font-medium text-muted-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
        >
          <FormattedMessage id="nav.blog" defaultMessage="Blog" />
        </Link>
        <Link 
          to="/about" 
          className="text-sm font-medium text-muted-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
        >
          <FormattedMessage id="nav.about" defaultMessage="À propos" />
        </Link>
        <Link 
          to="/contact" 
          className="text-sm font-medium text-muted-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
        >
          <FormattedMessage id="nav.contact" defaultMessage="Contact" />
        </Link>
      </AnimationWrapper>
    </nav>
  );
};
