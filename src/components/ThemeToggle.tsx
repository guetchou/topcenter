
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { FormattedMessage } from "react-intl";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center gap-1"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-[1rem] w-[1rem]" />
          <span className="hidden sm:inline">
            <FormattedMessage id="nav.lightMode" defaultMessage="Light Mode" />
          </span>
        </>
      ) : (
        <>
          <Moon className="h-[1rem] w-[1rem]" />
          <span className="hidden sm:inline">
            <FormattedMessage id="nav.darkMode" defaultMessage="Dark Mode" />
          </span>
        </>
      )}
    </Button>
  );
};
