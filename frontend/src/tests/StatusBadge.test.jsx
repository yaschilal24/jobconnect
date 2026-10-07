import { render, screen } from '@testing-library/react';
import StatusBadge from '../components/applications/StatusBadge';

test('renders APPLIED status', () => {
  render(<StatusBadge status="APPLIED" />);
  expect(screen.getByText(/APPLIED/i)).toBeInTheDocument();
});