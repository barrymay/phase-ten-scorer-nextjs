/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import PlayerItem from './PlayerItem';
import { PlayersState } from '../context/PlayersContext';

interface IStateProps {
  players: PlayersState;
}
type Props = IStateProps;

const List = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const PlayerList: React.FC<Props> = ({ players }) => {
  return (
    <List>
      {players.map((item, index) => (
        <PlayerItem key={item.id} index={index} player={item} />
      ))}
    </List>
  );
};

export default PlayerList;
