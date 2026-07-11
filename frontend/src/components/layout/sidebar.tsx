import { Link } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Users,
  Building2,
  GitBranch,
  FileText,
  Calendar,
  Sun,
  Wrench,
  MessageSquare,
  Megaphone,
  DollarSign,
  Sparkles,
  Contact,
  Cpu,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/clientes', label: 'Clientes', icon: Building2 },
  { href: '/pipeline', label: 'Pipeline', icon: GitBranch },
  { href: '/propostas', label: 'Propostas', icon: FileText },
  { href: '/agenda', label: 'Agenda', icon: Calendar },
  { href: '/solar', label: 'Energia Solar', icon: Sun },
  { href: '/service-orders', label: 'Instalação', icon: Wrench },
  { href: '/communications', label: 'Comunicação', icon: MessageSquare },
  { href: '/campaigns', label: 'Marketing', icon: Megaphone },
  { href: '/commissions', label: 'Financeiro', icon: DollarSign },
  { href: '/ai-suggestions', label: 'IA', icon: Sparkles },
  { href: '/companies', label: 'Empresas', icon: Building2 },
  { href: '/contacts', label: 'Contatos', icon: Contact },
  { href: '/equipment', label: 'Equipamentos', icon: Cpu },
  { href: '/admin', label: 'Administração', icon: Settings },
] as const;

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onOpen: () => void;
  onToggleCollapse: () => void;
}

export function Sidebar({ open, collapsed, onClose, onOpen, onToggleCollapse }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={open ? onClose : onOpen}
        className="fixed left-3 top-3 z-50 lg:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        )}
      >
        <div className={cn('flex h-14 items-center gap-2 px-3', collapsed && 'justify-center')}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="shrink-0 hidden lg:inline-flex"
            title={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
          {!collapsed && <span className="text-lg font-bold whitespace-nowrap">CRM RTSC</span>}
        </div>
        <Separator />
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                collapsed && 'justify-center px-2',
              )}
              activeProps={{ className: 'bg-primary text-primary-foreground hover:bg-primary' }}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>
        <Separator />
        <div className="p-2 text-center text-xs text-muted-foreground">
          {!collapsed && 'CRM RTSC v1.0.0'}
        </div>
      </aside>
    </>
  );
}
