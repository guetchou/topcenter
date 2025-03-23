
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
    return userService.updateProfile(updates);
  },
  
  // Admin methods
  getUsers: async () => {
    return adminService.getUsers();
  },
  createUser: async (userData: any) => {
    return adminService.createUser(userData);
  },
  deleteUser: async (userId: string) => {
    return adminService.deleteUser(userId);
  },
  impersonateUser: async (userId: string) => {
    return adminService.impersonateUser(userId);
  },
  stopImpersonation: async () => {
    return adminService.stopImpersonation();
  }
};
