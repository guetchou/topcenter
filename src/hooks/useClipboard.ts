
import { useState, useCallback } from 'react';

interface UseClipboardOptions {
  timeout?: number;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { timeout = 2000 } = options;
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const copy = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setError(null);
      
      const timer = setTimeout(() => {
        setCopied(false);
      }, timeout);
      
      return () => clearTimeout(timer);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to copy'));
      setCopied(false);
    }
  }, [timeout]);
  
  return { copied, error, copy };
}
