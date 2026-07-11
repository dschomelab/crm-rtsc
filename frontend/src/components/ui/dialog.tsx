import * as React from 'react';
import { cn } from '@/lib/utils';

const DialogContext = React.createContext<{ open: boolean; onClose: () => void }>({ open: false, onClose: () => {} });

export function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <DialogContext.Provider value={{ open, onClose }}>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg animate-in fade-in zoom-in-95">
            {children}
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn('text-lg font-semibold', className)}>{children}</h2>;
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex justify-end gap-2 pt-2', className)}>{children}</div>;
}

export { DialogContext };
