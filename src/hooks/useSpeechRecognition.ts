
import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionHookProps {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export const useSpeechRecognition = ({
  continuous = true,
  interimResults = true,
  lang = 'fr-FR',
  onResult,
  onEnd,
  onError,
}: SpeechRecognitionHookProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if browser supports speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setError('Speech recognition not supported in this browser');
        return;
      }
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = continuous;
      recognitionInstance.interimResults = interimResults;
      recognitionInstance.lang = lang;
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          }
        }
        
        setTranscript(finalTranscript);
        if (onResult) onResult(finalTranscript);
      };
      
      recognitionInstance.onerror = (event) => {
        setError(event.error);
        if (onError) onError(event.error);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        if (onEnd) onEnd();
      };
      
      setRecognition(recognitionInstance);
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [continuous, interimResults, lang, onEnd, onError, onResult]);
  
  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
        setError(null);
      } catch (err) {
        setError('Failed to start speech recognition');
      }
    }
  }, [recognition]);
  
  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);
  
  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    isSupported: !!recognition,
  };
};

export default useSpeechRecognition;
