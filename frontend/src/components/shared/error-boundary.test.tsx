import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/shared/error-boundary';

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(<ErrorBoundary><div>ok</div></ErrorBoundary>);
    expect(screen.getByText('ok')).toBeInTheDocument();
  });

  it('renders fallback on error', () => {
    const Bomb = () => { throw new Error('exploded'); };
    render(<ErrorBoundary><Bomb /></ErrorBoundary>);
    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
  });
});
