/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext } from 'react';
import { IRound, ITournament, useTournamentContext } from './TournamentContext';

interface ITournamentCurrentContext {
  tournament: ITournament;
  scoreRound: (roundScore: IRound) => void;
}
export const TournamentCurrentContext = React.createContext<ITournamentCurrentContext | null>(
  null,
);

interface IOwnProps {
  tournamentId: string;
}

export const TournamentCurrentProvider: React.FC<IOwnProps> = ({
  tournamentId,
  children,
}) => {
  const { tournaments, updateTournament } = useTournamentContext();
  const currentTournament = tournaments.find(item => item.id === tournamentId);
  if (!currentTournament) {
    throw new Error('Invalid Tournament Id');
  }

  function scoreRound(roundScore: IRound): void {
    if (!currentTournament) {
      throw new Error('Invalid current tourname state');
    }
    const newValue = {
      ...currentTournament,
      rounds: currentTournament.rounds.concat(roundScore),
    };
    updateTournament(newValue);
  }

  return (
    <TournamentCurrentContext.Provider
      value={{
        tournament: currentTournament,
        scoreRound,
      }}
    >
      {currentTournament ? children : null}
    </TournamentCurrentContext.Provider>
  );
};

export function useTournamentCurrentContext(): ITournamentCurrentContext {
  const context = useContext(TournamentCurrentContext);
  if (context === undefined || context === null) {
    throw new Error(
      useTournamentCurrentContext.name +
        ' must be used in TournamentCurrentProvider',
    );
  }
  return context;
}
