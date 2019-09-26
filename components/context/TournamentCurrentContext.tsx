/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useState } from 'react';
import { IRound, ITournament, useTournamentContext } from './TournamentContext';

interface ITournamentCurrentContext {
  tournament: ITournament;
  scoreRound: (roundScore: IRound) => void;
  removeCurrentTournament: () => void;
  roundNum: number;
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
  const {
    tournaments,
    updateTournament,
    removeTournament,
  } = useTournamentContext();
  const currentTournament = tournaments.find(item => item.id === tournamentId);
  if (!currentTournament) {
    throw new Error('Invalid Tournament Id');
  }
  const [roundNum, setRoundNum] = useState(() => {
    return currentTournament.rounds.length + 1;
  });

  function scoreRound(roundScore: IRound): void {
    if (!currentTournament) {
      throw new Error('Invalid current tourname state');
    }
    const newValue = {
      ...currentTournament,
      rounds: currentTournament.rounds.concat(roundScore),
    };
    updateTournament(newValue);
    setRoundNum(newValue.rounds.length + 1);
  }

  function removeCurrentTournament(): void {
    if (!currentTournament) {
      throw new Error('Invalid current tourname state');
    }
    removeTournament(tournamentId, true);
  }

  return (
    <TournamentCurrentContext.Provider
      value={{
        tournament: currentTournament,
        scoreRound,
        removeCurrentTournament,
        roundNum,
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
