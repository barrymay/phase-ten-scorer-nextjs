import { fireEvent, render } from 'react-testing-library';
import { PlayerSetup } from '../PlayerSetup';
import React from 'react';
import { PlayersProvider } from '../../context/PlayersContext';
test('init GameTotaler', () => {
  const { container } = render(
    <PlayersProvider>
      <PlayerSetup />
    </PlayersProvider>
  );
  expect(container).toBeTruthy();
});

it('Player Setup: don\'t allow invlalid names', async () => {
  const { getByLabelText } = render(
    <PlayersProvider>
      <PlayerSetup />
    </PlayersProvider>
  );

  const testValues: Array<{ test: string; expect: string }> = [
    { test: '*Barry', expect: 'Barry' },
    { test: 'Barry*', expect: 'Barry' },
    { test: '!', expect: '' },
    { test: 'B!!!C123*D', expect: 'BC123D' },
  ];

  const playerName = getByLabelText('Player Name:') as HTMLInputElement;

  testValues.forEach(test => {
    fireEvent.change(playerName, { target: { value: test.test } });
    expect(playerName.value).toMatch(test.expect);
  });
});
