/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useCallback, useState } from 'react';
import { IPlayer, usePlayersState } from '../context/PlayersContext';
import { useAppTheme } from '../theming/AppThemeProvider';
const PlayerSelector: React.FC<{
  onChange: (newValue: string[]) => void;
}> = ({ onChange }) => {
  const theme = useAppTheme();
  const [listState, setListState] = useState<string[]>([]);
  const players = usePlayersState();

  const selectPlayer = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const targetValue = e.currentTarget.value;
    const isValueInPlayers = players.find(item => item.id === targetValue);
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

  const getSortedPlayers = useCallback(
    (playerMap: IPlayer[]): IPlayer[] =>
      players.sort((a, b) => {
        return a.name.localeCompare(b.name);
      }),
    [players],
  );

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
              color: isSelected
                ? theme.default.primaryBg
                : theme.default.primary,
              backgroundColor: isSelected
                ? theme.default.primary
                : theme.default.primaryBg,
              ':focus': {
                outline: 'none',
              },
            }}
            value={item.id}
            onClick={selectPlayer}
          >
            {item.name} ({item.wins.length}-{item.losses.length})
          </button>
        );
      })}
    </div>
  );
};

export default PlayerSelector;
