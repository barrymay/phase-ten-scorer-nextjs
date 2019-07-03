import React from 'react';
import { render } from 'react-testing-library';
import { matchers } from 'jest-emotion';
import P10Button from '../../../../pages/common/button/P10Button';

expect.extend(matchers);

test('test P10Button create', () => {
  const { container } = render(<P10Button />);
  expect(container.firstChild).toMatchSnapshot();
  expect(container.firstChild).not.toHaveStyleRule('border-width', '0');
  expect(container.firstChild).not.toHaveStyleRule('margin', '0');
});

test('test P10Button create minimal', () => {
  const { container } = render(<P10Button minimal />);
  expect(container.firstChild).toMatchSnapshot('P10Button minimal');
  expect(container.firstChild).toHaveStyleRule('border-width', '0');
  expect(container.firstChild).toHaveStyleRule('margin', '0');
});
