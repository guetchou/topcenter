
import { DynamicNav } from "./nav/DynamicNav";
import { NewDesignNav } from "./nav/NewDesignNav";
import { shouldUseNewDesign } from "@/lib/designUtils";

/**
 * MainNav est un composant wrapper autour de la navigation
 * pour permettre une intégration progressive du nouveau design
 */
export function MainNav({ useNewDesign = false }) {
  // Option to toggle between old and new design
  const shouldUseNewNav = useNewDesign || shouldUseNewDesign('navigation');
  
  // Return appropriate navigation component
  return shouldUseNewNav ? <NewDesignNav /> : <DynamicNav />;
}
