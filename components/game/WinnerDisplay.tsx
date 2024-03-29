import 'twin.macro';
import {
  IPlayer,
  usePlayersDispatch,
  usePlayersStateAsMap,
} from '../context/PlayersContext';
import { useTournamentCurrentContext } from '../context/TournamentCurrentContext';

export interface IWinnerList {
  player: IPlayer;
  score: number;
}

const WinnerDisplay: React.FC<{ winners: IWinnerList[] }> = ({ winners }) => {
  const { tournament } = useTournamentCurrentContext();

  const useWinnersForUpdate = (winners: IWinnerList[]) => {
    const winnerIds = winners.map((item) => item.player.id);
    const gameId = tournament.id;
    const allPlayers = usePlayersStateAsMap();
    const playerDispatch = usePlayersDispatch();

    tournament.playerIds.forEach((playerId) => {
      const playerUpdate = allPlayers[playerId];
      if (winnerIds.includes(playerUpdate.id)) {
        playerDispatch({
          type: 'ADD_WIN',
          playerId: playerUpdate.id,
          gameId,
        });
      } else {
        playerDispatch({
          type: 'ADD_LOSS',
          playerId: playerUpdate.id,
          gameId,
        });
      }
    });
  };

  useWinnersForUpdate(winners);

  return (
    <div tw="flex flex-col justify-center items-center">
      <div>
        {winners.length === 1 ? 'The winner is' : 'The winners are (in order)'}:
      </div>
      {winners
        .sort((a, b) => b.score - a.score)
        .map((item) => (
          <div key={item.player.id}>
            🍾 {item.player.name} with {item.score} points 🎉
          </div>
        ))}
    </div>
  );
};

export default WinnerDisplay;
