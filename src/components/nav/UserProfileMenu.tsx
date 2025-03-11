
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { UserWithProfile } from "@/types/auth";

interface UserProfileMenuProps {
  activeUser: UserWithProfile | null;
  handleLogout: () => Promise<void>;
}

export function UserProfileMenu({ activeUser, handleLogout }: UserProfileMenuProps) {
  const { impersonatedUser } = useAuth();
  
  const getAdminRoute = () => {
    if (!activeUser) return "/login";
    
    if (activeUser.role === "super_admin") {
      return "/super-admin/users";
    } else if (activeUser.role === "admin") {
      return "/admin";
    } else if (activeUser.role?.includes("agent")) {
      return "/agent";
    } else {
      return "/client";
    }
  };

  const getProfileRoute = () => {
    if (!activeUser) return "/login";
    
    if (activeUser.role === "super_admin" || activeUser.role === "admin") {
      return "/admin/settings";
    } else if (activeUser.role?.includes("agent")) {
      return "/agent/settings";
    } else {
      return "/client/settings";
    }
  };

  if (!activeUser) {
    return (
      <Button
        variant="default"
        size="sm"
        asChild
      >
        <Link to="/login">Se connecter</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full"
          aria-label="Menu utilisateur"
        >
          {activeUser.role === "super_admin" && !impersonatedUser ? (
            <Shield className="h-5 w-5 text-destructive" />
          ) : (
            <User className="h-5 w-5" />
          )}
          {impersonatedUser && (
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-destructive" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {activeUser.profile?.full_name || activeUser.email}
          {impersonatedUser && (
            <span className="ml-2 text-xs text-destructive">(Impersonnifié)</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to={getAdminRoute()}>
            {activeUser.role === "super_admin" 
              ? "Panneau Super Admin" 
              : activeUser.role === "admin" 
                ? "Panneau Admin" 
                : activeUser.role?.includes("agent") 
                  ? "Portail Agent" 
                  : "Portail Client"}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to={getProfileRoute()}>Mon profil</Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {impersonatedUser ? "Arrêter l'impersonnification" : "Déconnexion"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
