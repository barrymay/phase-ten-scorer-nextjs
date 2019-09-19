/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useCallback, useState } from 'react';
import {
  IPlayer,
  IPlayerMap,
  usePlayersState,
} from '../context/PlayersContext';
const PlayerSelector: React.FC<{
  onChange: (newValue: string[]) => void;
}> = ({ onChange }) => {
  const [listState, setListState] = useState<string[]>([]);
  const players = usePlayersState();

  const selectPlayer = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const targetValue = e.currentTarget.value;
    const isValueInPlayers = players[targetValue];
    if (!isValueInPlayers) {
      return;
    }

    const isValueInList = listState.includes(targetValue);
    const newValue = isValueInList
      ? listState.filter(item => item !== targetValue)
      : listState.concat(targetValue);
    setListState(newValue);
    onChange(newValue);
  };

  const getSortedPlayers = useCallback((playerMap: IPlayerMap): IPlayer[] => {
    return Object.values(playerMap).sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }, []);

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {getSortedPlayers(players).map(item => {
        const isSelected = listState.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            css={{
              padding: 2,
              border: '1px solid black',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'flex-start',
              color: isSelected ? 'white' : 'black',
              backgroundColor: isSelected ? 'black' : 'white',
              ':focus': {
                outline: 'none',
              },
            }}
            value={item.id}
            onClick={selectPlayer}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
};

export default PlayerSelector;
