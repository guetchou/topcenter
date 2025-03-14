
import { supabase } from "@/integrations/supabase/client";
import { authenticationService } from "./authenticationService";
import { userService } from "./userService";
import { adminService } from "./adminService";
import { AuthServiceInterface } from "./types";

// Combine all auth services into a single exported service
export const authService: AuthServiceInterface = {
  checkUser: userService.checkUser,
  login: authenticationService.login,
  loginWithGoogle: authenticationService.loginWithGoogle,
  register: authenticationService.register,
  resetPassword: authenticationService.resetPassword,
  updatePassword: authenticationService.updatePassword,
  logout: authenticationService.logout,
  impersonateUser: adminService.impersonateUser,
  stopImpersonation: adminService.stopImpersonation,
  promoteToSuperAdmin: adminService.promoteToSuperAdmin
};

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    userService.checkUser();
  } else {
    // Reset auth store when user logs out
    const { resetAuth } = authStoreService;
    resetAuth();
  }
});

export default authService;
