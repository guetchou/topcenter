
import React from 'react';
import { FormattedMessage as ReactIntlFormattedMessage, IntlShape } from 'react-intl';

type FormattedMessageProps = Parameters<typeof ReactIntlFormattedMessage>[0];

/**
 * Wrapper autour du composant FormattedMessage de react-intl
 * pour simplifier son utilisation
 */
export const FormattedMessage: React.FC<FormattedMessageProps> = (props) => {
  return <ReactIntlFormattedMessage {...props} />;
};
