import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/StatusBadge';

describe('StatusBadge', () => {
  it('renders green for "open" status', () => {
    render(<StatusBadge status="open" />);
    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveClass('bg-green-500');
  });

  it('renders amber for "moderate" status', () => {
    render(<StatusBadge status="moderate" />);
    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveClass('bg-amber-500');
  });

  it('renders red for "crowded" status', () => {
    render(<StatusBadge status="crowded" />);
    const badge = screen.getByTestId('status-badge');
    expect(badge).toHaveClass('bg-red-500');
  });
});
