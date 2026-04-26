import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the user form', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /user details/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
});
