
import React from 'react';
import { FormattedMessage as ReactIntlFormattedMessage, FormattedMessageProps } from 'react-intl';

/**
 * Wrapper autour du composant FormattedMessage de react-intl
 * pour simplifier son utilisation
 */
export const FormattedMessage: React.FC<FormattedMessageProps> = (props) => {
  return <ReactIntlFormattedMessage {...props} />;
};
