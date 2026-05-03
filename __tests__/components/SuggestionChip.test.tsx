import { render, screen, fireEvent } from '@testing-library/react';
import { SuggestionChip } from '@/components/SuggestionChip';

describe('SuggestionChip', () => {
  it('renders with correct label', () => {
    render(<SuggestionChip text="Test Chip" onSelect={() => {}} index={0} />);
    expect(screen.getByText('Test Chip')).toBeInTheDocument();
  });

  it('calls onSelect with correct text on click', () => {
    const onSelectMock = jest.fn();
    render(<SuggestionChip text="Click Me" onSelect={onSelectMock} index={0} />);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(onSelectMock).toHaveBeenCalledWith('Click Me');
  });

  it('applies sm size class when size="sm"', () => {
    render(<SuggestionChip text="Small Chip" onSelect={() => {}} index={0} size="sm" />);
    const chip = screen.getByText('Small Chip');
    expect(chip).toHaveClass('text-xs');
    expect(chip).toHaveClass('px-2');
  });
});
