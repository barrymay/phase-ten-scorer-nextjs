import { cleanup, fireEvent, render } from 'react-testing-library';
import React from 'react';
import { PlayersProvider, PlayerMap } from '../../../pages/context/PlayersContext';
import PlayerSelector from '../../../pages/game/PlayerSelector';

afterEach(cleanup);

test('init PlayerSelector', () => {
  const onChangeHandler = jest.fn();
  const { container } = render(
    <PlayersProvider>
      <PlayerSelector onChange={onChangeHandler} />
    </PlayersProvider>
  );
  expect(container).toBeTruthy();
});

const testPlayers: PlayerMap = {
  '123': { id: '123', name: 'Player 1', wins: 0, losses: 0 },
  '1232': { id: '1232', name: 'Player 3', wins: 0, losses: 0 },
  '1234': { id: '1234', name: 'Player 2', wins: 0, losses: 0 },
};
test('Show Buttons on Selector', () => {
  const onChangeHandler = jest.fn();
  const { getAllByText } = render(
    <PlayersProvider testValue={testPlayers}>
      <PlayerSelector onChange={onChangeHandler} />
    </PlayersProvider>
  );

  const foundButtons = getAllByText(/^Player/);
  expect(foundButtons.map(item => item.textContent)).toEqual([
    'Player 1',
    'Player 2',
    'Player 3',
  ]);
});

test('Trigger PlayerSelector change handler', () => {
  const onChangeHandler = jest.fn();
  const { getAllByText } = render(
    <PlayersProvider testValue={testPlayers}>
      <PlayerSelector onChange={onChangeHandler} />
    </PlayersProvider>
  );

  const foundButtons = getAllByText(/^Player/);

  expect(onChangeHandler).toHaveBeenCalledTimes(0);
  fireEvent.click(foundButtons[0]);
  expect(onChangeHandler).toHaveBeenCalledTimes(1);
  fireEvent.click(foundButtons[1]);
  fireEvent.click(foundButtons[2]);
  fireEvent.click(foundButtons[1]);
  expect(onChangeHandler).toHaveBeenCalledTimes(4);

  fireEvent.click(foundButtons[1], {
    target: {
      value: 'foobar',
    },
  });

  expect(onChangeHandler).toHaveBeenCalledTimes(4);
});
