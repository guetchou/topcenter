
import React, { createContext, useState, useEffect, useContext } from 'react';
import { IntlProvider as ReactIntlProvider, IntlConfig } from 'react-intl';
import frMessages from '@/i18n/fr.json';
import enMessages from '@/i18n/en.json';

interface IntlContextType {
  locale: string;
  setLocale: (locale: string) => void;
  messages: Record<string, string>;
}

const messages: Record<string, Record<string, string>> = {
  'fr': frMessages,
  'en': enMessages,
};

const IntlContext = createContext<IntlContextType>({
  locale: 'fr',
  setLocale: () => {},
  messages: frMessages,
});

export const useIntl = () => useContext(IntlContext);

export const IntlProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>(() => {
    const savedLocale = localStorage.getItem('app-locale');
    return savedLocale || navigator.language.split('-')[0] || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('app-locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const contextValue = {
    locale,
    setLocale,
    messages: messages[locale] || messages['fr']
  };

  return (
    <IntlContext.Provider value={contextValue}>
      <ReactIntlProvider 
        messages={messages[locale] || messages['fr']}
        defaultLocale="fr"
        locale={locale}
      >
        {children}
      </ReactIntlProvider>
    </IntlContext.Provider>
  );
};

export default IntlProviderWrapper;
