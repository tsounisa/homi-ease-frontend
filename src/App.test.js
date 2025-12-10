import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders HomiEase Smart Home header', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const headerElement = screen.getByText(/HomiEase Smart Home/i);
  expect(headerElement).toBeInTheDocument();
});
