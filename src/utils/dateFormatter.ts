
/**
 * Date formatting utilities with internationalization support
 */

// Format date as a locale string
export const formatDateTime = (
  date: Date | number | string,
  locale: string = 'fr-FR',
  options: Intl.DateTimeFormatOptions = { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  }
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

// Format relative time (e.g., "3 hours ago", "yesterday")
export const formatRelativeTime = (
  date: Date | number | string,
  locale: string = 'fr-FR'
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - dateObj.getTime();
  
  // Convert to seconds
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'À l\'instant';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  }
  
  // Use standard date format for older dates
  return formatDateTime(dateObj, locale, { dateStyle: 'long' });
};

// Format date as ISO string (YYYY-MM-DD)
export const formatISODate = (date: Date | number | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toISOString().split('T')[0];
};

// Format time only (HH:MM)
export const formatTime = (
  date: Date | number | string,
  locale: string = 'fr-FR'
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, { 
    hour: '2-digit', 
    minute: '2-digit' 
  }).format(dateObj);
};

// Get start and end of a period (day, week, month, year)
export const getDateRange = (
  period: 'day' | 'week' | 'month' | 'year',
  date: Date = new Date()
): { start: Date; end: Date } => {
  const start = new Date(date);
  const end = new Date(date);
  
  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      const day = start.getDay() || 7; // Get current day (0-6, Sunday-Saturday)
      start.setDate(start.getDate() - day + 1); // Set to Monday
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6); // Set to Sunday
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
};
