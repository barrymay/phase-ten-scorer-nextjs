/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { IPlayer } from '../context/PlayersContext';
export interface IWinnerList {
  player: IPlayer;
  score: number;
}

const WinnerDisplay: React.FC<{ winners: IWinnerList[] }> = ({ winners }) => (
  <div
    css={css`
      display: flex;
      flex-direction: column;
      justify-items: column;
      align-items: center;
    `}
  >
    <div>
      {winners.length === 1 ? 'The winner is' : 'The winners are (in order)'}:
    </div>
    {winners
      .sort((a, b) => b.score - a.score)
      .map(item => (
        <div key={item.player.id}>
          {item.player.name} with {item.score} points
        </div>
      ))}
  </div>
);

export default WinnerDisplay;
