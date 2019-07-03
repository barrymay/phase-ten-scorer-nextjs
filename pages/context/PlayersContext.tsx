import React, { Dispatch, useContext, useEffect, useReducer } from 'react';
import uuid from 'uuid';

export type PlayerMap = { [key: string]: IPlayer };

export interface IPlayer {
  id: string;
  name: string;
  wins: number;
  losses: number;
}

export interface ILegacyPlayer {
  id: string;
  name: string;
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
  players: PlayerMap;
}
type PlayerAction = IPlayerAddAction | IPlayerRemoveAction | IPlayerSetAction;
export type InternalPlayersState = 'loading' | { [key: string]: IPlayer };
export type PlayersState = Exclude<InternalPlayersState, 'loading'>;

export const PlayersContext = React.createContext<PlayersContextState | null>(
  null
);
const INIT_STATE: InternalPlayersState = 'loading';
const PLAYER_STORAGE_KEY = 'player_storage_2';

export function isPlayerNameValid(map: PlayerMap, playerName: string): boolean {
  return (
    !!playerName.length &&
    !Object.values(map).some(
      item =>
        !item.name.localeCompare(playerName, undefined, {
          sensitivity: 'base',
        })
    )
  );
}

function playerReducer(
  state: InternalPlayersState,
  action: PlayerAction
): InternalPlayersState {
  let resultState = typeof state === 'string' ? {} : state;
  switch (action.type) {
    case 'ADD':
      if (isPlayerNameValid(resultState, action.playerName)) {
        let newKey = uuid();
        return {
          ...resultState,
          [newKey]: { id: newKey, name: action.playerName, losses: 0, wins: 0 },
        };
      } else {
        return state;
      }
    case 'REMOVE':
      let copy = { ...resultState };
      delete copy[action.playerId];
      return copy;
    case 'SET':
      return { ...action.players };
    default:
      return state;
  }
}

interface IOwnProps {
  testValue?: InternalPlayersState;
}

const getPlayerStorage = (): PlayerMap => {
  const latestStoredValue = window.localStorage.getItem(PLAYER_STORAGE_KEY);
  return latestStoredValue ? (JSON.parse(latestStoredValue) as PlayerMap) : {};
};
export const PlayersProvider: React.FC<IOwnProps> = ({
  children,
  testValue,
}) => {
  const usePlayerWithUpdate = (): [
    InternalPlayersState,
    Dispatch<PlayerAction>
  ] => {
    const [internalPlayers, playerDispatch] = useReducer(
      playerReducer,
      INIT_STATE,
      () => {
        try {
          const resultPlayers = getPlayerStorage();
          return resultPlayers;
        } catch (e) {
          return {};
        }
      }
    );

    useEffect((): VoidFunction => {
      window.localStorage.setItem(
        PLAYER_STORAGE_KEY,
        JSON.stringify(internalPlayers)
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
      usePlayersDispatch.name + ' must be used in PlayerProvider'
    );
  }
  return players.dispatchPlayers;
}

export function usePlayerInfo(playerIds: string[]): IPlayer[] {
  const playersList = Object.values(usePlayersState());
  return playerIds.reduce<IPlayer[]>((result, next) => {
    let foundPlayer = playersList.find(player => player.id === next);
    if (foundPlayer) {
      result.push(foundPlayer);
    }
    return result;
  }, []);
}
