import React from 'react';
import App from '../../../pages/main/App';
import { render } from 'react-testing-library';

it('renders without crashing', () => {
  const { unmount } = render(<App />);
  unmount();
});
