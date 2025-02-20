
import { ThemeProvider } from "next-themes";
import { IntlProvider } from "react-intl";
import { useState, useEffect } from "react";
import frMessages from "../i18n/fr.json";
import enMessages from "../i18n/en.json";

const messages = {
  fr: frMessages,
  en: enMessages,
};

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState('fr');

  useEffect(() => {
    // Set initial locale based on browser language
    const browserLocale = navigator.language.split(/[-_]/)[0];
    setLocale(browserLocale in messages ? browserLocale : 'fr');
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <IntlProvider
        messages={messages[locale as keyof typeof messages]}
        locale={locale}
        defaultLocale="fr"
      >
        {children}
      </IntlProvider>
    </ThemeProvider>
  );
};
