import React from 'react';
import { cleanup, render } from 'react-testing-library';
import {
  ITournament,
  TournamentProvider,
} from '../../context/TournamentContext';
import GameView from '../GameView';
import { PlayersProvider } from '../../context/PlayersContext';

afterEach(cleanup);

test('init GameView', () => {
  const tournamentTest: ITournament[] = [
    {
      id: 'test',
      name: 'Test Tourney',
      playerIds: [],
      rounds: [],
    },
  ];
  const { container } = render(
    <PlayersProvider>
      <TournamentProvider testValue={tournamentTest}>
        <GameView gameId={'test'} />
      </TournamentProvider>
    </PlayersProvider>
  );
  expect(container).toBeTruthy();
});
