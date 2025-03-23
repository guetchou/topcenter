
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AuthActionsProps {
  isLoading: boolean;
  submitText: string;
  alternativeAction?: {
    text: string;
    onClick: () => void;
  };
}

export const AuthActions = ({ isLoading, submitText, alternativeAction }: AuthActionsProps) => {
  return (
    <CardFooter className="flex flex-col space-y-2">
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitText}
      </Button>
      
      {alternativeAction && (
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={alternativeAction.onClick}
        >
          {alternativeAction.text}
        </Button>
      )}
    </CardFooter>
  );
};
