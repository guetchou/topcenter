
import { authenticationService } from './authenticationService';
import { userService } from './userService';
import { adminService } from './adminService';

export const authService = {
  // Authentication methods
  login: async (email: string, password: string, devMode = false) => {
    return authenticationService.login(email, password, devMode);
  },
  loginWithGoogle: async () => {
    return authenticationService.loginWithGoogle();
  },
  register: async (email: string, password: string, fullName: string) => {
    return authenticationService.register(email, password, fullName);
  },
  logout: async () => {
    return authenticationService.logout();
  },
  resetPassword: async (email: string) => {
    return authenticationService.resetPassword(email);
  },
  checkUser: async () => {
    return authenticationService.checkUser();
  },
  
  // User methods
  updateUserProfile: async (updates: any) => {
    return authenticationService.updateProfile(updates);
  },
  
  // Admin methods
  getUsers: async () => {
    console.warn('getUsers not fully implemented');
    return Promise.resolve([]);
  },
  createUser: async (userData: any) => {
    console.warn('createUser not fully implemented');
    return Promise.resolve();
  },
  deleteUser: async (userId: string) => {
    console.warn('deleteUser not fully implemented');
    return Promise.resolve();
  },
  impersonateUser: async (userId: string) => {
    return adminService.impersonateUser(userId);
  },
  stopImpersonation: async () => {
    return adminService.stopImpersonation();
  },
  
  // Additional methods required by the AuthActions interface
  updatePassword: async (password: string) => {
    console.warn('updatePassword not fully implemented');
    return Promise.resolve();
  },
  
  promoteToSuperAdmin: async (userId: string) => {
    console.warn('promoteToSuperAdmin not fully implemented');
    return Promise.resolve();
  }
};
