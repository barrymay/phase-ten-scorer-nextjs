import React from 'react';
import { cleanup, render } from 'react-testing-library';
import { ITournament, TournamentProvider } from '../../../pages/context/TournamentContext';
import { PlayersProvider } from '../../../pages/context/PlayersContext';
import GameView from '../../../pages/game/GameView';


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
