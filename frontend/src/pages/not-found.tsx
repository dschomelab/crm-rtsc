import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <h2 className="text-xl font-semibold">Página não encontrada</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link to="/">
          <Button>Voltar ao Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
