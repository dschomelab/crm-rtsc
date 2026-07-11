import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { ThemeProvider } from '@/hooks/useTheme';
import { Toaster, toast } from 'sonner';
import { router } from '@/routes/index';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      onError: (error: any) => {
        toast.error(error?.message ?? 'Erro inesperado');
      },
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster
          richColors
          position="top-right"
          closeButton
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
