import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Users, Building2, FileText, Wrench, LayoutDashboard, GitBranch, Calendar, Plus, Loader2 } from 'lucide-react';
import { apiClient } from '@/services/api';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CommandItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    { id: 'new-lead', label: 'Novo Lead', description: 'Criar um novo lead', icon: Plus, onClick: () => { navigate({ to: '/leads' }); close(); } },
    { id: 'new-customer', label: 'Novo Cliente', description: 'Cadastrar novo cliente', icon: Building2, onClick: () => { navigate({ to: '/clientes' }); close(); } },
    { id: 'new-proposal', label: 'Nova Proposta', description: 'Criar nova proposta', icon: FileText, onClick: () => { navigate({ to: '/propostas' }); close(); } },
    { id: 'go-dashboard', label: 'Abrir Dashboard', icon: LayoutDashboard, onClick: () => { navigate({ to: '/' }); close(); } },
    { id: 'go-leads', label: 'Abrir Leads', icon: Users, onClick: () => { navigate({ to: '/leads' }); close(); } },
    { id: 'go-pipeline', label: 'Abrir Pipeline', icon: GitBranch, onClick: () => { navigate({ to: '/pipeline' }); close(); } },
    { id: 'go-customers', label: 'Abrir Clientes', icon: Building2, onClick: () => { navigate({ to: '/clientes' }); close(); } },
    { id: 'go-proposals', label: 'Abrir Propostas', icon: FileText, onClick: () => { navigate({ to: '/propostas' }); close(); } },
    { id: 'go-agenda', label: 'Abrir Agenda', icon: Calendar, onClick: () => { navigate({ to: '/agenda' }); close(); } },
    { id: 'go-os', label: 'Abrir Ordens de Serviço', icon: Wrench, onClick: () => { navigate({ to: '/service-orders' }); close(); } },
  ];

  const close = useCallback(() => { setOpen(false); setQuery(''); setResults([]); }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && open) close();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(commands);
      setLoading(false);
      return;
    }
    const q = query.toLowerCase();
    const filtered = commands.filter((c) => c.label.toLowerCase().includes(q) || (c.description?.toLowerCase().includes(q)));
    setResults(filtered);
    setSelectedIdx(0);

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const promises: Promise<any>[] = [];
        const searchParams = new URLSearchParams({ search: query, limit: '5' });

        promises.push(
          apiClient.get(`/leads?${searchParams}`).then((r: any) =>
            (r.data ?? []).map((item: any) => ({
              id: `lead-${item.id}`,
              label: item.name,
              description: `Lead — ${item.stage?.name ?? item.status ?? ''}`,
              icon: Users,
              onClick: () => { navigate({ to: '/leads' }); close(); },
            }))
          )
        );
        promises.push(
          apiClient.get(`/customers?${searchParams}`).then((r: any) =>
            (r.data ?? []).map((item: any) => ({
              id: `customer-${item.id}`,
              label: item.name,
              description: `Cliente — ${item.email ?? item.phone ?? ''}`,
              icon: Building2,
              onClick: () => { navigate({ to: '/clientes' }); close(); },
            }))
          )
        );
        promises.push(
          apiClient.get(`/proposals?${searchParams}`).then((r: any) =>
            (r.data ?? []).slice(0, 5).map((item: any) => ({
              id: `proposal-${item.id}`,
              label: item.title,
              description: `Proposta — R$ ${Number(item.value).toLocaleString('pt-BR')}`,
              icon: FileText,
              onClick: () => { navigate({ to: '/propostas' }); close(); },
            }))
          )
        );

        const [leads, customers, proposals] = await Promise.all(promises);
        const searchResults = [...leads, ...customers, ...proposals];
        setResults([...filtered, ...searchResults]);
      } catch { /* ignore */ }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, navigate, close]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[selectedIdx]) { results[selectedIdx].onClick(); }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      <div className="relative z-10 w-full max-w-lg rounded-xl border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pesquisar leads, clientes, propostas..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <kbd className="hidden rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground sm:inline-block">ESC</kbd>
        </div>
        {results.length > 0 ? (
          <div className="max-h-72 overflow-y-auto p-2">
            {results.map((item, i) => (
              <button
                key={item.id}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${i === selectedIdx ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
                onClick={item.onClick}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex-1 truncate">
                  <p className="font-medium">{item.label}</p>
                  {item.description && <p className="truncate text-xs text-muted-foreground">{item.description}</p>}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhum resultado encontrado</div>
        )}
      </div>
    </div>
  );
}
