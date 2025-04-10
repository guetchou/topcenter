
// Server status management
let isServerAvailable = true;

/**
 * Check if the server is currently available
 * @returns boolean indicating server availability
 */
export const serverIsAvailable = (): boolean => {
  return isServerAvailable;
};

/**
 * Mark the server as unavailable
 */
export const markServerAsUnavailable = (): void => {
  isServerAvailable = false;
  console.log("Server marked as unavailable");
};

/**
 * Mark the server as available
 */
export const markServerAsAvailable = (): void => {
  isServerAvailable = true;
  console.log("Server marked as available");
};
