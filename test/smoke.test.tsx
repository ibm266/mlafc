import { render, screen } from '@testing-library/react';

test('test harness renders JSX', () => {
  render(<p>midnight atlas</p>);
  expect(screen.getByText('midnight atlas')).toBeInTheDocument();
});
