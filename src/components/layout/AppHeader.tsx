import { SidebarTrigger } from '@/components/ui/sidebar';
import { CompanySwitcher } from './CompanySwitcher';
import { NotificationCenter } from './NotificationCenter';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export function AppHeader() {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-6" />
        <CompanySwitcher />
      </div>

      <div className="flex items-center gap-2">
        <NotificationCenter />
        <Separator orientation="vertical" className="h-6 mx-2" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">João Silva</p>
            <p className="text-xs text-muted-foreground">Contador</p>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              JS
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
