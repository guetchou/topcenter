
import { Button } from "@/components/ui/button";
import { useIntl } from "react-intl";

interface LanguageSelectorProps {
  onLanguageChange: (locale: string) => void;
  currentLocale: string;
}

export const LanguageSelector = ({ onLanguageChange, currentLocale }: LanguageSelectorProps) => {
  return (
    <div className="flex items-center gap-2" role="region" aria-label="Language selection">
      <Button
        variant={currentLocale === 'fr' ? 'default' : 'outline'}
        onClick={() => onLanguageChange('fr')}
        aria-label="Switch to French"
        className="w-12"
      >
        FR
      </Button>
      <Button
        variant={currentLocale === 'en' ? 'default' : 'outline'}
        onClick={() => onLanguageChange('en')}
        aria-label="Switch to English"
        className="w-12"
      >
        EN
      </Button>
    </div>
  );
};
