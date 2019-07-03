import React from 'react';
import { cleanup, fireEvent, render, wait } from 'react-testing-library';
import { PlayerMap, PlayersProvider } from '../../context/PlayersContext';
import { TournamentProvider } from '../../context/TournamentContext';
import CreateTournament from '../CreateTournament';

afterEach(cleanup);

const testPlayers: PlayerMap = {
  '123': { id: '123', name: 'Player 1', wins: 0, losses: 0 },
  '1232': { id: '1232', name: 'Player 3', wins: 0, losses: 0 },
  '1234': { id: '1234', name: 'Player 2', wins: 0, losses: 0 },
  '1235': { id: '1235', name: 'Player 4', wins: 0, losses: 0 },
  '1236': { id: '1236', name: 'Player 5', wins: 0, losses: 0 },
};
test('Test Input With Selector', async () => {
  const { findByText, getByLabelText, getAllByTestId } = render(
    <PlayersProvider testValue={testPlayers}>
      <TournamentProvider>
        <CreateTournament />
      </TournamentProvider>
    </PlayersProvider>
  );

  const getErrorList = () => {
    return getAllByTestId(/^formError-/);
  };

  const nameInput = getByLabelText('Tournament Name:') as HTMLInputElement;
  let submitButton = await findByText('Submit');

  fireEvent.input(nameInput, { target: { value: 'Filled' } });
  fireEvent.click(submitButton);
  await wait();
  expect(getErrorList()).toHaveLength(1);

  fireEvent.input(nameInput, { target: { value: '' } });
  fireEvent.click(submitButton);
  await wait();
  expect(getErrorList()).toHaveLength(2);

  fireEvent.input(nameInput, {
    target: { value: 'Filled totally too much (more than 20 characters)' },
  });
  fireEvent.click(submitButton);
  await wait();
  expect(getErrorList()).toHaveLength(2);

  fireEvent.input(nameInput, { target: { value: 'Filled 2' } });
  fireEvent.click(submitButton);
  await wait();
  expect(getErrorList()).toHaveLength(1);
});

test('Test Input With Selector', async () => {
  const { getAllByText, findByText, getByLabelText, getAllByTestId } = render(
    <PlayersProvider testValue={testPlayers}>
      <TournamentProvider>
        <CreateTournament />
      </TournamentProvider>
    </PlayersProvider>
  );

  const getErrorList = () => {
    try {
      return getAllByTestId(/^formError-/);
    } catch (e) {
      return [];
    }
  };

  const foundButtons = getAllByText(/^Player/);

  const nameInput = getByLabelText('Tournament Name:') as HTMLInputElement;
  let submitButton = await findByText('Submit');

  fireEvent.input(nameInput, { target: { value: 'Filled' } });
  fireEvent.click(submitButton);
  await wait();
  expect(getErrorList()).toHaveLength(1);

  fireEvent.click(foundButtons[0]);
  fireEvent.click(submitButton);
  await wait();
  expect(getErrorList()).toHaveLength(0);

  fireEvent.click(foundButtons[1]);
  fireEvent.click(foundButtons[2]);
  fireEvent.click(foundButtons[3]);
  fireEvent.click(foundButtons[4]);
  fireEvent.click(submitButton);
  await wait();
  expect(getErrorList()).toHaveLength(1);

  fireEvent.click(foundButtons[4]);
  fireEvent.click(submitButton);
  await wait();
  expect(getErrorList()).toHaveLength(0);
});
