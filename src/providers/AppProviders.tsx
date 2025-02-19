
import { ThemeProvider } from "next-themes";
import { IntlProvider } from "react-intl";
import { useState } from "react";
import frMessages from "../i18n/fr.json";
import enMessages from "../i18n/en.json";

const messages = {
  fr: frMessages,
  en: enMessages,
};

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState(navigator.language.split(/[-_]/)[0]);

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
