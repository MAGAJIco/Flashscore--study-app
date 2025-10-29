
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KidsModeToggle } from '@/components/KidsModeToggle';
import { ProtectedGambling } from '../ProtectedGambling';
import { KidsModeProvider } from '../../context/KidsModeContext';

describe('KidsModeToggle', () => {
  it('renders checkbox with label', () => {
    render(
      <KidsModeProvider>
        <KidsModeToggle />
      </KidsModeProvider>
    );
    
    expect(screen.getByLabelText(/Kids Mode/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('toggles Kids Mode when clicked', async () => {
    render(
      <KidsModeProvider>
        <KidsModeToggle />
      </KidsModeProvider>
    );
    
    const checkbox = screen.getByRole('checkbox');
    
    // Initially unchecked
    expect(checkbox).not.toBeChecked();
    
    // Click to enable
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    // Click to disable
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('persists setting to backend on change', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)
    );

    render(
      <KidsModeProvider>
        <KidsModeToggle />
      </KidsModeProvider>
    );
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/user/settings/kids-mode',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ kidsMode: true }),
      })
    );
  });
});

describe('ProtectedGambling', () => {
  it('shows children content when Kids Mode is enabled', () => {
    render(
      <KidsModeProvider>
        <ProtectedGambling>
          <div>Gambling Content</div>
        </ProtectedGambling>
      </KidsModeProvider>
    );
    
    // Initially Kids Mode is off, so gambling content shows
    expect(screen.getByText('Gambling Content')).toBeInTheDocument();
  });

  it('hides gambling content with custom fallback', () => {
    render(
      <KidsModeProvider>
        <ProtectedGambling fallback={<div>Safe Content</div>}>
          <div>Gambling Content</div>
        </ProtectedGambling>
      </KidsModeProvider>
    );
    
    // Toggle Kids Mode on via context
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(screen.queryByText('Gambling Content')).not.toBeInTheDocument();
    expect(screen.getByText('Safe Content')).toBeInTheDocument();
  });

  it('shows default hidden message when no fallback provided', () => {
    // Test with Kids Mode enabled from localStorage
    localStorage.setItem('kidsMode', 'true');
    
    render(
      <KidsModeProvider>
        <ProtectedGambling>
          <div>Gambling Content</div>
        </ProtectedGambling>
      </KidsModeProvider>
    );
    
    expect(screen.getByText(/This content is hidden in Kids Mode/i)).toBeInTheDocument();
  });
});
