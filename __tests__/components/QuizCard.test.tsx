import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuizCard } from '@/components/QuizCard';

const mockQuestion = {
  question: "What is VVPAT?",
  options: ["Option A", "Option B", "Correct Option", "Option D"],
  correctIndex: 2,
  explanation: "VVPAT is important."
};

describe('QuizCard', () => {
  it('renders question text', () => {
    render(<QuizCard question={mockQuestion} questionNumber={1} totalQuestions={5} onNext={() => {}} />);
    expect(screen.getByText('What is VVPAT?')).toBeInTheDocument();
  });

  it('renders 4 option buttons', () => {
    render(<QuizCard question={mockQuestion} questionNumber={1} totalQuestions={5} onNext={() => {}} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Correct Option')).toBeInTheDocument();
    expect(screen.getByText('Option D')).toBeInTheDocument();
  });

  it('disables all options after one is selected', async () => {
    render(<QuizCard question={mockQuestion} questionNumber={1} totalQuestions={5} onNext={() => {}} />);
    
    const optionButton = screen.getByText('Option A').closest('button');
    fireEvent.click(optionButton!);

    const allButtons = screen.getAllByRole('radio');
    // Options buttons
    expect(allButtons[0]).toBeDisabled();
    expect(allButtons[1]).toBeDisabled();
    expect(allButtons[2]).toBeDisabled();
    expect(allButtons[3]).toBeDisabled();
  });

  it('applies correct green class on correct answer', async () => {
    render(<QuizCard question={mockQuestion} questionNumber={1} totalQuestions={5} onNext={() => {}} />);
    
    const correctOption = screen.getByText('Correct Option').closest('button');
    fireEvent.click(correctOption!);

    await waitFor(() => {
      expect(correctOption).toHaveClass('bg-green-500/20');
      expect(correctOption).toHaveClass('border-green-500');
      expect(screen.getByText('✓ Correct!')).toBeInTheDocument();
    });
  });

  it('applies red class on wrong answer', async () => {
    render(<QuizCard question={mockQuestion} questionNumber={1} totalQuestions={5} onNext={() => {}} />);
    
    const wrongOption = screen.getByText('Option A').closest('button');
    fireEvent.click(wrongOption!);

    await waitFor(() => {
      expect(wrongOption).toHaveClass('bg-red-500/20');
      expect(wrongOption).toHaveClass('border-red-500');
      expect(screen.getByText('✗ Incorrect')).toBeInTheDocument();
    });
  });
});
