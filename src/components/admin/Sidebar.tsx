
import { AdminNavLinks } from './AdminNavLinks';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';

export function Sidebar() {
  const { user } = useAuth();
  
  const userRole = user?.role || 'client';
  
  return (
    <div className="flex h-screen border-r">
      <div className="flex w-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Logo className="w-32 h-8" />
          <span className="ml-2 text-sm font-semibold">Admin</span>
        </div>
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-4 py-4">
            <AdminNavLinks />
            <Separator />
            <div className="px-3 py-2">
              <h2 className="mb-2 text-xs font-semibold">Votre compte</h2>
              <div className="space-y-1">
                <p className="text-xs">
                  Connecté en tant que <span className="font-medium">{user?.email}</span>
                </p>
                <p className="text-xs capitalize">
                  Rôle: <span className="font-medium">{userRole.replace('_', ' ')}</span>
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
