import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageProvider, useLanguage, SUPPORTED_LANGUAGES } from '@/lib/i18n';
import React from 'react';

const TestComponent = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="current-lang">{language}</span>
      <button onClick={() => setLanguage('hi')}>Switch to Hindi</button>
    </div>
  );
};

describe('i18n', () => {
  it('LanguageProvider provides default language "en"', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
  });

  it('setLanguage updates context value', async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    fireEvent.click(screen.getByText('Switch to Hindi'));
    
    await waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('hi');
    });
  });

  it('SUPPORTED_LANGUAGES has exactly 8 entries', () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(8);
  });

  it('all language objects have code, label, nativeName fields', () => {
    SUPPORTED_LANGUAGES.forEach(lang => {
      expect(lang).toHaveProperty('code');
      expect(lang).toHaveProperty('label');
      expect(lang).toHaveProperty('nativeName');
    });
  });
});
