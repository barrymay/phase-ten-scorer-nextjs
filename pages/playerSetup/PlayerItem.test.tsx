import { render } from 'react-testing-library';
import { PlayerItem } from './PlayerItem';
import { IPlayer, PlayersProvider } from '../context/PlayersContext';
import React from 'react';

const fakePlayer: IPlayer = {
  name: 'Barry',
  id: '1234',
};

it('renders basic setup and text displays properly', () => {
  const { findByText } = render(
    <PlayersProvider>
      <PlayerItem player={fakePlayer} index={1} />
    </PlayersProvider>
  );
  expect(findByText('2: Barry')).toBeDefined();
});

it('calls remove when clicked', async () => {
  const { findByTitle } = render(
    <PlayersProvider>
      <PlayerItem player={fakePlayer} index={1} />
    </PlayersProvider>
  );
  const button = await findByTitle('Remove Item');
  expect(button).toBeDefined();

  button.click();
});
