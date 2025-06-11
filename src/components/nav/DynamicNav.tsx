
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainNav } from "@/components/nav/MainNav"
import { SiteHeader } from "@/components/nav/SiteHeader"
import { UserProfileMenu } from "@/components/nav/UserProfileMenu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UserWithProfile } from '@/types/auth';

interface Props extends React.HTMLAttributes<HTMLElement> {
  className?: string
}

export function DynamicNav({ className }: Props) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Mock user data for development
  const mockUser: UserWithProfile = {
    id: '1',
    email: 'admin@topcenter.app',
    fullName: 'Admin User',
    role: 'admin'
  };

  const currentUser = user || mockUser;

  // Always show the header - remove the conditional return
  return (
    <SiteHeader className={cn("bg-background border-b", className)}>
      <div className="container flex items-center space-x-2">
        <MainNav className="mx-6" />
        <div className="flex-1 w-0" />
        {isLoading ? (
          <Button variant="ghost" disabled>
            Loading...
          </Button>
        ) : isAuthenticated ? (
          <UserProfileMenu user={currentUser} logout={logout} />
        ) : (
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </div>
    </SiteHeader>
  )
}
