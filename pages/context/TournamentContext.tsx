import React, { useContext, useEffect, useState, useCallback } from 'react';
import uuid from 'uuid';

export interface IRoundPlayerData {
  score: number;
  phaseCompleted: number;
}

type PlayerData = {
  [playerId: string]: {
    phasesLeft: number[];
    score: number;
  };
};

export interface IRound {
  [playerId: string]: IRoundPlayerData;
}

export interface ITournament {
  id: string;
  name: string;
  playerIds: string[];
  playerData?: PlayerData;
  rounds: IRound[];
}

export type InternalTournamentState = 'loading' | ITournament[];
export type TournamentState = Exclude<InternalTournamentState, 'loading'>;

interface InternalTournamentContextState {
  tournaments: InternalTournamentState;
  addTournament: ({
    name,
    players,
  }: {
    name: string;
    players: string[];
  }) => void;
  removeTournament: ({ tournamentId }: { tournamentId: string }) => void;
  updateTournament: (tournamentData: ITournament) => void;
}

interface TournamentContextState extends InternalTournamentContextState {
  tournaments: TournamentState;
}

export const TournamentContext = React.createContext<InternalTournamentContextState | null>(
  null
);
const INIT_STATE: InternalTournamentState = 'loading';
const TOURNAMENT_STORAGE_KEY = 'tournament_storage_1';
interface IOwnProps {
  testValue?: ITournament[];
}

const initPhasesList = [...Array(10).keys()].map(item => item + 1);

const getRemainingPhases = (tournament: ITournament): PlayerData => {
  const playersIds = tournament.playerIds;

  const resultPlayerData = playersIds.reduce<PlayerData>(
    (result, nextPlayer) => {
      const playerDetails = tournament.rounds.reduce<{
        phasesLeft: number[];
        score: number;
      }>(
        (result, nextRound) => {
          const phase = nextRound[nextPlayer];
          result.phasesLeft = result.phasesLeft.filter(
            item => item !== phase.phaseCompleted
          );
          result.score += phase.score;
          return result;
        },
        { phasesLeft: initPhasesList, score: 0 }
      );
      result[nextPlayer] = {
        phasesLeft: playerDetails.phasesLeft,
        score: playerDetails.score,
      };
      return result;
    },
    {}
  );

  return resultPlayerData;
};

export const TournamentProvider: React.FC<IOwnProps> = ({
  children,
  testValue,
}) => {
  const [tournaments, setTournaments] = useState<InternalTournamentState>(
    INIT_STATE
  );
  const resolveTournament = useCallback(
    (tournamentData: ITournament): ITournament => {
      return {
        ...tournamentData,
        playerData: getRemainingPhases(tournamentData),
      };
    },
    []
  );

  const updateTournaments = useCallback(
    (tournaments: ITournament[]) => {
      setTournaments(tournaments.map(item => resolveTournament(item)));
    },
    [resolveTournament]
  );

  const updateTournament = useCallback(
    (tournament: ITournament) => {
      const nextState = tournaments !== 'loading' ? tournaments : [];

      updateTournaments([
        ...nextState.filter(item => item.id !== tournament.id),
        tournament,
      ]);
    },
    [tournaments, updateTournaments]
  );

  useEffect(() => {
    if (testValue) {
      updateTournaments(testValue);
      return;
    }

    let firstValue: ITournament[] = [];
    try {
      let storedValue =
        window.localStorage.getItem(TOURNAMENT_STORAGE_KEY) || '[]';
      firstValue = (JSON.parse(storedValue) || []) as ITournament[];
    } catch (e) {}
    updateTournaments(firstValue);
    return () => undefined;
  }, [testValue, updateTournaments]);

  useEffect((): VoidFunction => {
    if (Array.isArray(tournaments)) {
      window.localStorage.setItem(
        TOURNAMENT_STORAGE_KEY,
        JSON.stringify(tournaments)
      );
    }
    return () => undefined;
  }, [tournaments]);

  function addTournament({
    name,
    players,
  }: {
    name: string;
    players: string[];
  }): void {
    let nextState = tournaments !== 'loading' ? tournaments : [];

    const newTournament: ITournament = {
      id: uuid(),
      name: name,
      playerIds: players,
      rounds: [],
    };

    setTournaments([...nextState, newTournament]);
  }

  function removeTournament({ tournamentId }: { tournamentId: string }): void {
    let nextState = tournaments !== 'loading' ? tournaments : [];
    setTournaments(nextState.filter(item => item.id !== tournamentId));
  }

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        addTournament,
        removeTournament,
        updateTournament,
      }}
    >
      {tournaments === 'loading' || children}
    </TournamentContext.Provider>
  );
};

export function useTournamentContext(): TournamentContextState {
  const context = useContext(TournamentContext);
  if (context === undefined || context === null) {
    throw new Error(
      useTournamentContext.name + ' must be used in TournamentProvider'
    );
  }
  if (context.tournaments === 'loading') {
    throw new Error('Player state is not loaded');
  }
  let result = {
    ...context,
    tournaments: context.tournaments,
  };
  return result;
}
