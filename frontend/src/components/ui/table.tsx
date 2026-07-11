import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from 'lucide-react';

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('rounded-lg border', className)}><table className="w-full text-sm">{children}</table></div>;
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b bg-muted/50">{children}</thead>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function Th({ children, className, sortable, sortDir, onSort }: {
  children: React.ReactNode; className?: string;
  sortable?: boolean; sortDir?: 'asc' | 'desc' | null; onSort?: () => void;
}) {
  return (
    <th className={cn('px-4 py-3 text-left font-medium', sortable && 'cursor-pointer select-none hover:bg-muted/80', className)} onClick={sortable ? onSort : undefined}>
      <div className="flex items-center gap-1">
        {children}
        {sortable && (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : sortDir === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3 text-muted-foreground/50" />)}
      </div>
    </th>
  );
}

export function Tr({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <tr className={cn('border-b last:border-0 hover:bg-muted/30 transition-colors', className)} onClick={onClick}>{children}</tr>;
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn('px-4 py-3', className)}>{children}</td>;
}

export function TableEmpty({ colSpan, message = 'Nenhum registro encontrado' }: { colSpan: number; message?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center text-sm text-muted-foreground">
        {message}
      </td>
    </tr>
  );
}

export function TableLoading({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center">
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
      </td>
    </tr>
  );
}

export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 border-t px-4 py-3">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors',
            page === i + 1 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent',
          )}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
