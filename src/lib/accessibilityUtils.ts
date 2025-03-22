type ContrastLevel = 'AA' | 'AAA';
type TextSize = 'normal' | 'large';

/**
 * Checks if a color pair has sufficient contrast according to WCAG guidelines
 * @param foreground The foreground color (text) in hex format (#RRGGBB)
 * @param background The background color in hex format (#RRGGBB)
 * @param level WCAG level to check against ('AA' or 'AAA')
 * @param size Text size ('normal' for < 18pt, 'large' for >= 18pt or 14pt bold)
 * @returns boolean indicating if the contrast is sufficient
 */
export function hasGoodContrast(
  foreground: string,
  background: string,
  level: ContrastLevel = 'AA',
  size: TextSize = 'normal'
): boolean {
  const contrastRatio = getContrastRatio(foreground, background);
  
  // WCAG 2.1 contrast requirements
  if (level === 'AA') {
    if (size === 'normal') return contrastRatio >= 4.5;
    return contrastRatio >= 3; // large text
  } else if (level === 'AAA') {
    if (size === 'normal') return contrastRatio >= 7;
    return contrastRatio >= 4.5; // large text
  }
  
  return false;
}

/**
 * Calculates the contrast ratio between two colors
 * @param foreground The foreground color (text) in hex format (#RRGGBB)
 * @param background The background color in hex format (#RRGGBB)
 * @returns The contrast ratio (1-21)
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fgLuminance = getLuminance(foreground);
  const bgLuminance = getLuminance(background);
  
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculates the relative luminance of a color
 * @param color The color in hex format (#RRGGBB)
 * @returns The relative luminance (0-1)
 */
function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(channel => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Converts a hex color to an RGB object
 * @param hex The color in hex format (#RRGGBB)
 * @returns An object with r, g, b properties (0-255)
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace(/^#/, '');
  
  // Parse hex values
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
}

/**
 * Checks if an element meets accessibility standards (keyboard focus, aria attributes)
 * @param element The DOM element to check
 * @returns An object with issues found
 */
export function checkElementAccessibility(element: HTMLElement): {
  missingAria: string[],
  missingAlt: boolean,
  focusIssue: boolean,
  contrastIssue: boolean
} {
  const issues = {
    missingAria: [] as string[],
    missingAlt: false,
    focusIssue: false,
    contrastIssue: false
  };
  
  // Check for missing ARIA attributes on common elements
  if (element.tagName === 'BUTTON' && !element.getAttribute('aria-label') && !element.textContent) {
    issues.missingAria.push('aria-label on button');
  }
  
  if (element.tagName === 'INPUT' && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    issues.missingAria.push('aria-label or aria-labelledby on input');
  }
  
  // Check for missing alt on images
  if (element.tagName === 'IMG' && !element.getAttribute('alt')) {
    issues.missingAlt = true;
  }
  
  // Check for outline: none which may indicate focus visibility issues
  const computedStyle = window.getComputedStyle(element);
  if (
    (computedStyle.outline === 'none' || computedStyle.outline === '0') &&
    computedStyle.outlineOffset === '0px' &&
    !computedStyle.outlineWidth &&
    element.tagName !== 'BODY'
  ) {
    issues.focusIssue = true;
  }
  
  // Return the issues found
  return issues;
}

/**
 * Creates a focus trap for modals and dialogs
 * @param containerRef Reference to the container element
 * @returns Object with functions to activate and deactivate the focus trap
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>) {
  const activate = () => {
    if (!containerRef.current) return;
    
    // Store the element that had focus before activating the trap
    const previouslyFocused = document.activeElement as HTMLElement;
    
    // Find all focusable elements inside the container
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    // Focus the first element
    if (firstElement) {
      firstElement.focus();
    }
    
    // Handle tab navigation to keep focus inside the container
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      } else if (e.key === 'Escape') {
        deactivate();
      }
    };
    
    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    const deactivate = () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused) {
        previouslyFocused.focus();
      }
    };
    
    return deactivate;
  };
  
  return { activate, deactivate: () => {} };
}

/**
 * Adds accessibility attributes to an element
 * @param props The existing props
 * @param label The accessible label
 * @param description The accessible description
 * @returns The enhanced props
 */
export function withAccessibilityProps(
  props: Record<string, any>,
  label?: string,
  description?: string
): Record<string, any> {
  const accessibilityProps: Record<string, any> = { ...props };
  
  if (label) {
    accessibilityProps['aria-label'] = label;
  }
  
  if (description) {
    accessibilityProps['aria-description'] = description;
  }
  
  return accessibilityProps;
}
