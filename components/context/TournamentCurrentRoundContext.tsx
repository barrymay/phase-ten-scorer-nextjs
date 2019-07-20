/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useMemo, useCallback, useState } from 'react';
import { IRound, ITournament, useTournamentContext } from './TournamentContext';
import { PhaseState } from '../game/PhaseButton';
import { useTournamentCurrentContext } from './TournamentCurrentContext';
import { IPlayer } from './PlayersContext';

interface ITournamentCurrentRoundContext {
  player: IPlayer;
  roundNum: number;
  currentRound: IRound;
  nextPhase: number | undefined;
  updateMarkedPhase: (phaseId: number | undefined) => void;
}
export const TournamentCurrentRoundContext = React.createContext<ITournamentCurrentRoundContext | null>(
  null,
);

export const TournamentCurrentRoundProvider: React.FC<{ player: IPlayer }> = ({
  player,
  children,
}) => {
  const currentTournament = useTournamentCurrentContext();
  if (!currentTournament) {
    throw new Error('Invalid Tournament for Round');
  }
  const [nextPhase, setNextPhase] = useState<number | undefined>(undefined);
  const updateMarkedPhase = useCallback((phase: number | undefined) => {
    setNextPhase(phase);
  }, []);

  const nextContextValue: ITournamentCurrentRoundContext = useMemo(() => {
    const roundNum: number = currentTournament.tournament.rounds.length;
    const currentRound: IRound =
      currentTournament.tournament.rounds[roundNum - 1];

    return {
      player,
      roundNum,
      currentRound,
      updateMarkedPhase,
      nextPhase: undefined,
    };
  }, [currentTournament.tournament.rounds, player, updateMarkedPhase]);

  return (
    <TournamentCurrentRoundContext.Provider
      value={{ ...nextContextValue, nextPhase }}
    >
      {children}
    </TournamentCurrentRoundContext.Provider>
  );
};

export function useTournamentCurrentRoundContext(): ITournamentCurrentRoundContext {
  const context = useContext(TournamentCurrentRoundContext);
  if (context === undefined || context === null) {
    throw new Error(
      useTournamentCurrentRoundContext.name +
        ' must be used in TournamentProvider and TournamentCurrentProvider',
    );
  }
  return context;
}
