
import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useBeforeUnload } from 'react-router-dom';

interface UseConfirmNavigationOptions {
  when: boolean;
  message?: string;
}

export const useConfirmNavigation = ({
  when,
  message = 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter cette page ?'
}: UseConfirmNavigationOptions) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle browser's beforeunload event (page refresh, close tab, etc.)
  useBeforeUnload(
    useCallback(
      (event) => {
        if (when) {
          event.preventDefault();
          return message;
        }
      },
      [when, message]
    )
  );
  
  // Handle navigation within the app
  useEffect(() => {
    if (!when) return;
    
    const confirmTransition = (nextLocation: any) => {
      if (
        nextLocation.pathname !== location.pathname &&
        !window.confirm(message)
      ) {
        // User cancelled navigation, prevent it
        navigate(location.pathname);
      }
    };
    
    // Clean up on unmount or when dependency changes
    return () => {
      // Nothing to clean up in this implementation
    };
  }, [when, message, navigate, location.pathname]);
};

export default useConfirmNavigation;
