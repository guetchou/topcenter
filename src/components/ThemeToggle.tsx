
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { FormattedMessage } from "react-intl";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="w-8 h-8"
          >
            {theme === "dark" ? (
              <Sun className="h-[1rem] w-[1rem]" />
            ) : (
              <Moon className="h-[1rem] w-[1rem]" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {theme === "dark" ? (
            <FormattedMessage id="nav.lightMode" defaultMessage="Light Mode" />
          ) : (
            <FormattedMessage id="nav.darkMode" defaultMessage="Dark Mode" />
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
