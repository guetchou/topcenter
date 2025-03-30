
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Logo } from '@/components/Logo';
import { Menu, X, ChevronDown } from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Accueil',
    href: '/',
  },
  {
    label: 'Services',
    href: '/services',
    subItems: [
      { label: 'Centre d\'appels', href: '/services/call-center' },
      { label: 'Téléphonie', href: '/services/telephony-system' },
      { label: 'Vente en ligne', href: '/services/online-sales' },
    ],
  },
  {
    label: 'À propos',
    href: '/about',
  },
  {
    label: 'Déploiement',
    href: '/deploy',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export const MainNav: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold">TopCenter</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.subItems ? (
                  <div className="flex items-center cursor-pointer" onClick={() => toggleDropdown(item.label)}>
                    <span className="text-sm font-medium transition-colors hover:text-primary">
                      {item.label}
                    </span>
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  </div>
                ) : (
                  <Link to={item.href} className="text-sm font-medium transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                )}

                {/* Dropdown menu */}
                {item.subItems && activeDropdown === item.label && (
                  <div className="absolute left-0 mt-2 w-48 p-2 bg-background border rounded-md shadow-lg z-10">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.href}
                        className="block px-4 py-2 text-sm hover:bg-muted rounded-md"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="outline" size="sm">
            <Link to="/auth/login">Connexion</Link>
          </Button>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 z-50 h-screen bg-background border-t">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.subItems ? (
                    <div>
                      <div
                        className="flex items-center justify-between py-2"
                        onClick={() => toggleDropdown(item.label)}
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      </div>
                      
                      {activeDropdown === item.label && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-muted">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.label}
                              to={subItem.href}
                              className="block py-2 text-sm"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="block py-2 text-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
