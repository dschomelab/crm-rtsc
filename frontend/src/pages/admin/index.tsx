import { Link } from '@tanstack/react-router';
import { Users, Shield, Group, Settings, ClipboardList } from 'lucide-react';

export function AdminPage() {
  const cards = [
    { href: '/admin/users', label: 'Usuários', icon: Users, desc: 'Gerenciar usuários do sistema' },
    { href: '/admin/profiles', label: 'Perfis de Acesso', icon: Shield, desc: 'Gerenciar perfis e permissões' },
    { href: '/admin/teams', label: 'Equipes', icon: Group, desc: 'Gerenciar equipes' },
    { href: '/admin/settings', label: 'Configurações', icon: Settings, desc: 'Configurações do sistema' },
    { href: '/admin/audit', label: 'Auditoria', icon: ClipboardList, desc: 'Log de auditoria' },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Administração</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(c => (
          <Link key={c.href} to={c.href} className="rounded-lg border p-4 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3 mb-2"><c.icon className="h-5 w-5 text-primary" /><h3 className="font-medium">{c.label}</h3></div>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
