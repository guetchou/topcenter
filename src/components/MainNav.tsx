
import { DynamicNav } from "./nav/DynamicNav";

/**
 * MainNav is a wrapper around DynamicNav to maintain backward compatibility
 * This avoids duplicating navigation logic and keeps the codebase clean
 */
export function MainNav() {
  return <DynamicNav />;
}
