
/**
 * Utility to handle domain redirection in a Vite/React app
 * Similar to Next.js middleware functionality
 */

export const checkDomainAndRedirect = () => {
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  const hostname = window.location.hostname;
  const targetDomain = 'www.topcenter.cg';
  
  // If not on the main domain, redirect
  if (hostname !== targetDomain && !hostname.includes('localhost') && !hostname.includes('127.0.0.1') && !hostname.includes('lovable.app')) {
    window.location.href = `https://${targetDomain}${window.location.pathname}${window.location.search}`;
  }
};

export default checkDomainAndRedirect;
