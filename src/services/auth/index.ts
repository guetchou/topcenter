
import { authenticationService } from "./authenticationService";
import { userService } from "./userService";
import { adminService } from "./adminService";
import { AuthServiceInterface } from "./types";
import { authStoreService } from "./authStore";

// Combiner tous les services d'authentification en un seul service exporté
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

// Vérifier l'état d'authentification au chargement
window.addEventListener('load', () => {
  userService.checkUser();
});

export default authService;
