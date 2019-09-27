import React, { Dispatch, useContext, useEffect, useReducer } from 'react';
import uuid from 'uuid';
import { to } from 'react-spring';

interface IPlayerMapFormat<T> {
  [key: string]: T;
}

export type IPlayerMap = IPlayerMapFormat<IPlayer>;

export interface IPlayerLegacy2 {
  id: string;
  name: string;
  wins: number;
  losses: number;
}

export interface IPlayer {
  id: string;
  name: string;
  wins: string[];
  losses: string[];
}

interface PlayersContextState {
  players: InternalPlayersState;
  dispatchPlayers: React.Dispatch<PlayerAction>;
}

interface IPlayerAddAction {
  type: 'ADD';
  playerName: string;
}

interface IPlayerRemoveAction {
  type: 'REMOVE';
  playerId: string;
}

interface IPlayerSetAction {
  type: 'SET';
  players: IPlayerMap;
}

interface IPlayerWinLossAction {
  type: 'ADD_WIN' | 'ADD_LOSS';
  playerId: string;
  gameId: string;
}

type PlayerAction =
  | IPlayerAddAction
  | IPlayerRemoveAction
  | IPlayerSetAction
  | IPlayerWinLossAction;
export type InternalPlayersState = 'loading' | { [key: string]: IPlayer };
export type PlayersState = Exclude<InternalPlayersState, 'loading'>;

export const PlayersContext = React.createContext<PlayersContextState | null>(
  null,
);
const INIT_STATE: InternalPlayersState = 'loading';
const PLAYER_STORAGE_KEY = 'player_storage_4';
const PLAYER_STORAGE_KEY_3 = 'player_storage_3';
const PLAYER_STORAGE_KEY_2 = 'player_storage_2';

export function isPlayerNameValid(
  map: IPlayerMap,
  playerName: string,
): boolean {
  return (
    !!playerName.length &&
    !Object.values(map).some(
      item =>
        !item.name.localeCompare(playerName, undefined, {
          sensitivity: 'base',
        }),
    )
  );
}

const playerCache = new Map<string, IPlayer[]>();

function playerReducer(
  state: InternalPlayersState,
  action: PlayerAction,
): InternalPlayersState {
  const resultState = typeof state === 'string' ? {} : state;
  const newState = { ...resultState };
  switch (action.type) {
    case 'ADD':
      if (isPlayerNameValid(resultState, action.playerName)) {
        const newKey = uuid();
        playerCache.clear();
        return {
          ...newState,
          [newKey]: {
            id: newKey,
            name: action.playerName,
            losses: [],
            wins: [],
          },
        };
      } else {
        return state;
      }
    case 'REMOVE':
      delete newState[action.playerId];
      playerCache.clear();
      return newState;
    case 'ADD_WIN':
    case 'ADD_LOSS': {
      const isWin = action.type === 'ADD_WIN';
      const gameId = action.gameId;
      const player = { ...newState[action.playerId] };
      const toAdd = isWin ? player.wins : player.losses;
      const toRemove = isWin ? player.losses : player.wins;
      if (toAdd.includes(gameId) && !toRemove.includes(gameId)) {
        return state;
      } else {
        player.wins = isWin
          ? player.wins.concat(gameId)
          : player.wins.filter(item => item !== gameId);
        player.losses = !isWin
          ? player.losses.concat(gameId)
          : player.losses.filter(item => item !== gameId);

        return {
          ...newState,
          [action.playerId]: player,
        };
      }
    }
    case 'SET':
      playerCache.clear();
      return { ...action.players };
    default:
      return state;
  }
}

interface IOwnProps {
  testValue?: InternalPlayersState;
}

const getPlayerStorage = (): InternalPlayersState => {
  let result: IPlayer[] = [];
  const latestStoredValue = window.localStorage.getItem(PLAYER_STORAGE_KEY);
  if (!latestStoredValue) {
    const storedValue_3 = window.localStorage.getItem(PLAYER_STORAGE_KEY_3);
    const storedValue_2 = window.localStorage.getItem(PLAYER_STORAGE_KEY_2);
    if (storedValue_2 && !storedValue_3) {
      const value_2 = JSON.parse(storedValue_2) as IPlayerMapFormat<
        IPlayerLegacy2
      >;
      result = Object.values(value_2).map<IPlayer>(item => ({
        ...item,
        wins: [],
        losses: [],
      }));
    } else if (storedValue_3) {
      const value_3 = JSON.parse(storedValue_3) as IPlayerMapFormat<IPlayer>;
      result = Object.values(value_3).map<IPlayer>(item => ({
        ...item,
      }));
    }
  } else {
    result = JSON.parse(latestStoredValue) as IPlayer[];
  }
  window.localStorage.removeItem(PLAYER_STORAGE_KEY_2);
  window.localStorage.removeItem(PLAYER_STORAGE_KEY_3);

  return result.reduce<PlayersState>((reduceResult, next) => {
    reduceResult = {
      ...reduceResult,
      [next.id]: next,
    };
    return reduceResult;
  }, {});
};

export const PlayersProvider: React.FC<IOwnProps> = ({
  children,
  testValue,
}) => {
  const usePlayerWithUpdate = (): [
    InternalPlayersState,
    Dispatch<PlayerAction>,
  ] => {
    const [internalPlayers, playerDispatch] = useReducer(
      playerReducer,
      INIT_STATE,
      () => {
        try {
          return getPlayerStorage();
        } catch (e) {
          return {};
        }
      },
    );

    useEffect((): VoidFunction => {
      window.localStorage.setItem(
        PLAYER_STORAGE_KEY,
        JSON.stringify(Object.values(internalPlayers)),
      );
      return () => undefined;
    }, [internalPlayers]);

    return [internalPlayers, playerDispatch];
  };

  const [players, playerDispatch] = usePlayerWithUpdate();
  return (
    <PlayersContext.Provider
      value={{
        players: testValue ? testValue : players,
        dispatchPlayers: playerDispatch,
      }}
    >
      {players === 'loading' || children}
    </PlayersContext.Provider>
  );
};

export function usePlayersState(): PlayersState {
  const players = useContext(PlayersContext);
  if (players === undefined || players === null) {
    throw new Error(usePlayersState.name + ' must be used in PlayerProvider');
  }
  if (players.players === 'loading') {
    throw new Error('Player state is not loaded');
  }
  return players.players;
}

export function usePlayersDispatch(): React.Dispatch<PlayerAction> {
  const players = useContext(PlayersContext);
  if (players === undefined || players === null) {
    throw new Error(
      usePlayersDispatch.name + ' must be used in PlayerProvider',
    );
  }
  return players.dispatchPlayers;
}

export function usePlayerInfo(playerIds: string[]): IPlayer[] {
  const playerCacheKey = JSON.stringify(playerIds);
  const playersList = Object.values(usePlayersState());

  const potentialValue = playerCache.get(playerCacheKey);
  if (potentialValue) {
    return potentialValue;
  } else {
    const newValue = playerIds.reduce<IPlayer[]>((result, next) => {
      const foundPlayer = playersList.find(player => player.id === next);
      if (foundPlayer) {
        result.push(foundPlayer);
      }
      return result;
    }, []);
    playerCache.set(playerCacheKey, newValue);
    return newValue;
  }
}
