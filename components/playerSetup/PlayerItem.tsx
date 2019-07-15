/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { faTimesCircle } from '@fortawesome/pro-regular-svg-icons';
import P10Button from '../common/button/P10Button';
import { usePlayersDispatch, IPlayer } from '../context/PlayersContext';

interface IOwnProps {
  players: IPlayer[];
}
interface Props {
  player: IPlayer;
  index: number;
}

const Item = styled.div({
  display: 'flex',
});

const PlayerName = styled.div({
  display: 'flex',
  flex: 1,
});

export const PlayerItem: React.FC<Props> = ({ player, index }) => {
  const playerDispatch = usePlayersDispatch();
  const removeItem = (itemId: string) => {
    playerDispatch({ type: 'REMOVE', playerId: itemId });
  };

  return (
    <Item>
      <PlayerName key={player.id}>
        Player #{index + 1}: {player.name}
      </PlayerName>
      <P10Button
        title="Remove Item"
        faIconDef={faTimesCircle}
        minimal
        onClick={() => {
          removeItem(player.id);
        }}
      />
    </Item>
  );
};

export default PlayerItem;
