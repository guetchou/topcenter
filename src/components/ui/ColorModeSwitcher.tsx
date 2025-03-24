
import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { useDarkMode } from '@/hooks/useDarkMode';

interface ColorModeSwitcherProps {
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  tooltips?: boolean;
  dropdownMenu?: boolean;
  iconOnly?: boolean;
}

export function ColorModeSwitcher({
  size = 'default',
  variant = 'outline',
  tooltips = true,
  dropdownMenu = false,
  iconOnly = false,
}: ColorModeSwitcherProps) {
  const { theme, setTheme, isDarkMode } = useDarkMode();

  const handleToggle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getIcon = () => {
    if (theme === 'dark') return <Moon className="h-[1.2rem] w-[1.2rem]" />;
    if (theme === 'light') return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    return <Laptop className="h-[1.2rem] w-[1.2rem]" />;
  };

  const getLabel = () => {
    if (theme === 'dark') return 'Mode sombre';
    if (theme === 'light') return 'Mode clair';
    return 'Système';
  };

  // Simple toggle button with tooltip
  if (!dropdownMenu) {
    const ButtonComponent = (
      <Button
        variant={variant}
        size={size}
        onClick={handleToggle}
        aria-label="Changer de thème"
      >
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {getIcon()}
        </motion.div>
        {!iconOnly && <span className="ml-2">{getLabel()}</span>}
      </Button>
    );

    if (tooltips) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{ButtonComponent}</TooltipTrigger>
            <TooltipContent>
              <p>
                {theme === 'dark'
                  ? 'Passer au mode système'
                  : theme === 'light'
                  ? 'Passer au mode sombre'
                  : 'Passer au mode clair'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return ButtonComponent;
  }

  // Dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} aria-label="Changer de thème">
          <motion.div
            key={theme}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {getIcon()}
          </motion.div>
          {!iconOnly && <span className="ml-2">{getLabel()}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Mode clair</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Mode sombre</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Laptop className="mr-2 h-4 w-4" />
          <span>Système</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ColorModeSwitcher;
