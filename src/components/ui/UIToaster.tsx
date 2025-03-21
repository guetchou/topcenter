
import React from "react";
import { Toaster } from "sonner";

/**
 * UIToaster - Wrapper component for the Toaster from sonner
 * Provides a consistent interface across the application
 */
export const UIToaster = () => {
  return <Toaster position="bottom-right" richColors closeButton />;
};
