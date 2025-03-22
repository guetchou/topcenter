
import React from 'react';
import { FormattedMessage as ReactIntlFormattedMessage } from 'react-intl';

type FormattedMessageProps = React.ComponentProps<typeof ReactIntlFormattedMessage>;

/**
 * Wrapper autour du composant FormattedMessage de react-intl
 * pour simplifier son utilisation
 */
export const FormattedMessage: React.FC<FormattedMessageProps> = (props) => {
  return <ReactIntlFormattedMessage {...props} />;
};
