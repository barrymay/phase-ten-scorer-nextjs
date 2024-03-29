import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { v4 as uuid } from 'uuid';
import { usePlayersStateAsMap } from './PlayersContext';

export interface IRoundPlayerData {
  score: number;
  phaseCompleted: number;
}

interface IPlayerData {
  [playerId: string]: {
    phasesLeft: number[];
    score: number;
  };
}

export interface IRound {
  [playerId: string]: IRoundPlayerData;
}

export interface IRoundPartial {
  [playerId: string]: Partial<IRoundPlayerData>;
}

export interface ITournament {
  id: string;
  name: string;
  playerIds: string[];
  playerData?: IPlayerData;
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
  }) => ITournament;
  removeTournament: (tournamentId: string, skipStateUpdate?: boolean) => void;
  updateTournament: (tournamentData: ITournament) => void;
}

interface TournamentContextState extends InternalTournamentContextState {
  tournaments: TournamentState;
}

export const TournamentContext = React.createContext<InternalTournamentContextState | null>(
  null,
);
const INIT_STATE: InternalTournamentState = 'loading';
const TOURNAMENT_STORAGE_KEY = 'tournament_storage_1';
interface IOwnProps {
  testValue?: ITournament[];
}

const initPhasesList = [...Array(10).keys()].map(item => item + 1);

const getRemainingPhases = (tournament: ITournament): IPlayerData => {
  const playersIds = tournament.playerIds;

  const resultPlayerData = playersIds.reduce<IPlayerData>(
    (result, nextPlayer) => {
      const playerDetails = tournament.rounds.reduce<{
        phasesLeft: number[];
        score: number;
      }>(
        (result, nextRound) => {
          const phase = nextRound[nextPlayer];
          result.phasesLeft = result.phasesLeft.filter(
            item => item !== phase.phaseCompleted,
          );
          result.score += phase.score;
          return result;
        },
        { phasesLeft: initPhasesList, score: 0 },
      );
      result[nextPlayer] = {
        phasesLeft: playerDetails.phasesLeft,
        score: playerDetails.score,
      };
      return result;
    },
    {},
  );

  return resultPlayerData;
};

export const TournamentProvider: React.FC<IOwnProps> = ({
  children,
  testValue,
}) => {
  const playersState = usePlayersStateAsMap();
  const playerIds = useMemo(() => Object.keys(playersState), [playersState]);

  const [tournaments, setTournaments] = useState<InternalTournamentState>(
    INIT_STATE,
  );

  const resolveTournament = useCallback(
    (tournamentData: ITournament): ITournament | null => {
      const tournament = {
        ...tournamentData,
        playerIds: tournamentData.playerIds.filter(item =>
          playerIds.includes(item),
        ),
      };
      if (tournament.playerIds.length) {
        return {
          ...tournament,
          playerData: getRemainingPhases(tournament),
        };
      } else {
        return null;
      }
    },
    [playerIds],
  );

  const updateTournaments = useCallback(
    (tournaments: ITournament[]) => {
      setTournaments(
        tournaments.reduce<ITournament[]>((result, next) => {
          const tournament = resolveTournament(next);
          if (tournament) {
            result.push(tournament);
          }
          return result;
        }, []),
      );
    },
    [resolveTournament],
  );

  const updateTournament = useCallback(
    (tournament: ITournament) => {
      const nextState = tournaments !== 'loading' ? tournaments : [];

      updateTournaments([
        ...nextState.filter(item => item.id !== tournament.id),
        tournament,
      ]);
    },
    [tournaments, updateTournaments],
  );

  useEffect(() => {
    if (testValue) {
      updateTournaments(testValue);
      return;
    }

    let firstValue: ITournament[] = [];
    try {
      const storedValue =
        window.localStorage.getItem(TOURNAMENT_STORAGE_KEY) || '[]';
      firstValue = (JSON.parse(storedValue) || []) as ITournament[];
    } catch (e) {
      console.warn('Could not react tournament data from storage', e);
    }
    updateTournaments(firstValue);
    return () => undefined;
  }, [testValue, updateTournaments]);

  function saveTournamentState(tournaments: InternalTournamentState) {
    if (Array.isArray(tournaments)) {
      window.localStorage.setItem(
        TOURNAMENT_STORAGE_KEY,
        JSON.stringify(tournaments),
      );
    }
  }

  useEffect((): VoidFunction => {
    saveTournamentState(tournaments);
    return () => undefined;
  }, [tournaments]);

  function addTournament({
    name,
    players,
  }: {
    name: string;
    players: string[];
  }): ITournament {
    const nextState = tournaments !== 'loading' ? tournaments : [];

    const newTournament: ITournament = {
      id: uuid(),
      name: name,
      playerIds: players,
      rounds: [],
    };

    saveTournamentState([...nextState, newTournament]);
    return newTournament;
  }

  function saveTournaments(
    newTournamentState: ITournament[],
    skipStateUpdate?: boolean,
  ) {
    if (skipStateUpdate) {
      saveTournamentState(newTournamentState);
    } else {
      setTournaments(newTournamentState);
    }
  }

  function removeTournament(
    tournamentId: string,
    skipStateUpdate?: boolean,
  ): void {
    const nextState = tournaments !== 'loading' ? tournaments : [];
    const newState = nextState.filter(item => item.id !== tournamentId);
    saveTournaments(newState, skipStateUpdate);
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
      useTournamentContext.name + ' must be used in TournamentProvider',
    );
  }
  if (context.tournaments === 'loading') {
    throw new Error('Player state is not loaded');
  }
  const result = {
    ...context,
    tournaments: context.tournaments,
  };
  return result;
}
