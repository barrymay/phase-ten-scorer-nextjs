import faker from 'faker';
import { cleanup, render, fireEvent } from 'react-testing-library';
import uuid from 'uuid';
import ProviderWrapper from '../ProviderWrapper';
import ScoringWizard from '../ScoringWizard';
import React from 'react';
import { TournamentCurrentProvider } from '../../context/TournamentCurrentContext';

afterEach(cleanup);

const fakePlayerName1 = faker.name.firstName();
const fakePlayerId1 = uuid();
const fakePlayerName2 = faker.name.firstName();
const fakePlayerId2 = uuid();
const fakeGameId = uuid();
const fakeGameName = faker.company.catchPhrase();

const fakeTournament = {
  players: {
    [fakePlayerId1]: {
      id: fakePlayerId1,
      name: fakePlayerName1,
      losses: 0,
      wins: 0,
    },
    [fakePlayerId2]: {
      id: fakePlayerId2,
      name: fakePlayerName2,
      losses: 0,
      wins: 0,
    },
  },
  tournament: [
    {
      id: fakeGameId,
      name: fakeGameName,
      playerIds: [fakePlayerId1, fakePlayerId2],
      rounds: [],
    },
  ],
};

test('init ScoringWizard', async () => {
  const onChangeHandler = jest.fn();
  const { container, findByLabelText } = render(
    <ProviderWrapper testValue={fakeTournament}>
      <TournamentCurrentProvider tournamentId={fakeGameId}>
        <ScoringWizard onComplete={onChangeHandler} />
      </TournamentCurrentProvider>
    </ProviderWrapper>
  );

  const scoreText = await findByLabelText(/Score:/);
  fireEvent.input(scoreText, {
    target: { value: 'abc' },
  });

  const completedPhase = await findByLabelText(/Completed Phase/);
  fireEvent.input(completedPhase, {
    target: { value: 'b' },
  });
  fireEvent.input(completedPhase, {
    target: { value: '1' },
  });
  expect(container).toBeTruthy();
});
