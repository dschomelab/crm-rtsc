import { LogOut } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import useAuthStore from '@/hooks/useAuth';
import { NotificationDropdown } from '@/components/shared/notification-dropdown';

export function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="ml-auto flex items-center gap-2">
        <NotificationDropdown />
        <ThemeToggle />
        <Separator orientation="vertical" className="h-6" />
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar fallback={user?.name?.charAt(0) ?? 'U'} className="h-8 w-8" />
              <span className="hidden text-sm font-medium lg:block">
                {user?.name ?? 'Usuário'}
              </span>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="w-48">
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              {user?.email}
            </div>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onClick={() => logout().then(() => navigate({ to: '/login' })).catch(() => navigate({ to: '/login' }))}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    </header>
  );
}
