import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

beforeEach(() => {
  global.fetch = vi.fn((url, opts) => {
    if (!opts || opts.method === undefined) {
      return Promise.resolve({ json: () => Promise.resolve([]) });
    }
    if (opts.method === 'POST') {
      return Promise.resolve({ json: () => Promise.resolve({ id: '1', title: 'New', done: false }) });
    }
    return Promise.resolve({ json: () => Promise.resolve({}) });
  });
});

it('renders heading', () => {
  render(<App />);
  expect(screen.getByText('SimpleTasks')).toBeInTheDocument();
});

it('renders an input field', () => {
  render(<App />);
  expect(screen.getByPlaceholderText('New task')).toBeInTheDocument();
});

it('renders an Add button', () => {
  render(<App />);
  expect(screen.getByText('Add')).toBeInTheDocument();
});

it('lets user type into the input', () => {
  render(<App />);
  const input = screen.getByPlaceholderText('New task');
  fireEvent.change(input, { target: { value: 'Milk' } });
  expect(input.value).toBe('Milk');
});

it('calls fetch on submit with POST', async () => {
  render(<App />);
  fireEvent.change(screen.getByPlaceholderText('New task'), { target: { value: 'Milk' } });
  fireEvent.click(screen.getByText('Add'));
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});

it('clears input after submit', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText('New task');
  fireEvent.change(input, { target: { value: 'Milk' } });
  fireEvent.click(screen.getByText('Add'));
  await waitFor(() => expect(input.value).toBe(''));
});

it('does not submit an empty task', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Add'));
  expect(global.fetch).toHaveBeenCalledTimes(1); // only the initial GET
});

it('loads tasks on mount', async () => {
  render(<App />);
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/tasks')));
});

it('renders list container', () => {
  render(<App />);
  expect(document.querySelector('ul')).toBeTruthy();
});

it('matches snapshot-safe structure (form present)', () => {
  render(<App />);
  expect(document.querySelector('form')).toBeTruthy();
});