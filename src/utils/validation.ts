
/**
 * Validation utilities for forms and input fields
 */

// Email validation with regex
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une lettre majuscule");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une lettre minuscule");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un caractère spécial");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Phone number validation (International format)
export const isValidPhoneNumber = (phone: string): boolean => {
  // Basic validation for international phone numbers
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ''));
};

// URL validation
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Form field validation with common rules
export const validateField = (
  name: string,
  value: string,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => boolean;
  }
): { valid: boolean; message: string } => {
  
  if (rules.required && !value.trim()) {
    return { valid: false, message: `Le champ ${name} est requis` };
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    return { 
      valid: false, 
      message: `Le champ ${name} doit contenir au moins ${rules.minLength} caractères` 
    };
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    return { 
      valid: false, 
      message: `Le champ ${name} doit contenir au maximum ${rules.maxLength} caractères` 
    };
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    return { valid: false, message: `Le format du champ ${name} est invalide` };
  }
  
  if (rules.custom && !rules.custom(value)) {
    return { valid: false, message: `Le champ ${name} est invalide` };
  }
  
  return { valid: true, message: '' };
};
