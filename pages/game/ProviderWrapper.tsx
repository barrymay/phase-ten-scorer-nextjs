import React from 'react';
import { PlayersProvider, PlayersState } from '../context/PlayersContext';
import { TournamentProvider, ITournament } from '../context/TournamentContext';

export interface IProviderWrapperState {
  players: PlayersState;
  tournament: ITournament[];
}

const ProviderWrapper: React.FC<{
  testValue?: IProviderWrapperState;
}> = ({ children, testValue }) => {
  return (
    <PlayersProvider testValue={testValue && testValue.players}>
      <TournamentProvider testValue={testValue && testValue.tournament}>
        {children}
      </TournamentProvider>
    </PlayersProvider>
  );
};

export default ProviderWrapper;
