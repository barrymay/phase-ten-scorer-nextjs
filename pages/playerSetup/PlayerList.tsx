/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import PlayerItem from './PlayerItem';
import { IPlayer, IPlayerMap } from '../context/PlayersContext';
import { useCallback } from 'react';

interface IOwnProps {
  players: IPlayer[];
}
interface IStateProps {
  players: IPlayerMap;
}
type Props = IStateProps;

const List = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const PlayerList: React.FC<Props> = ({ players }) => {
  const getPlayerList = useCallback((playerMap: IPlayerMap): IPlayer[] => {
    return Object.values(playerMap).sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }, []);

  return (
    <List>
      {getPlayerList(players).map((item, index) => (
        <PlayerItem key={item.id} index={index} player={item} />
      ))}
    </List>
  );
};

export default PlayerList;
