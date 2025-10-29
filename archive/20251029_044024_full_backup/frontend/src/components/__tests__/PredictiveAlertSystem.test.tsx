import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PredictiveAlertSystem from '@/app/components/PredictiveAlertSystem';

describe('PredictiveAlertSystem', () => {
  it('renders alert button after mounting', async () => {
    render(<PredictiveAlertSystem />);
    
    await waitFor(() => {
      const button = screen.getByTitle('Predictive Alerts');
      expect(button).toBeInTheDocument();
    });
  });

  it('displays notification badge with correct count', async () => {
    render(<PredictiveAlertSystem />);
    
    await waitFor(() => {
      const badge = screen.getByText('2');
      expect(badge).toBeInTheDocument();
    });
  });
});
