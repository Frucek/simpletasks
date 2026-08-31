import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

beforeEach(() => {
  global.fetch = vi.fn((url, opts) => {
    if (!opts || opts.method === undefined) {
      return Promise.resolve({
        json: () => Promise.resolve([
          { id: '1', title: 'Buy milk', done: false },
          { id: '2', title: 'Pay rent', done: true },
        ]),
      });
    }

    return Promise.resolve({ json: () => Promise.resolve({}) });
  });
});

describe('task filtering', () => {
  it('shows filter options and hides completed tasks when active view is selected', async () => {
    render(<App />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Active' }));

    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toBeInTheDocument();
      expect(screen.queryByText('Pay rent')).not.toBeInTheDocument();
    });
  });
});
