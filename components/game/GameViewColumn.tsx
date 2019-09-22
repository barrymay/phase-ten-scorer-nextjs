/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from 'react';
import { useTournamentCurrentContext } from '../context/TournamentCurrentContext';
import PhaseScorer from './PhaseScorer';
import Totaler from './Totaler';
import { IPlayer } from '../context/PlayersContext';

const GameViewColumn: React.FC<{
  player: IPlayer;
  onReady: VoidFunction;
  updateMarkedPhase: (phase: number | undefined) => void;
  isShuffler: boolean;
}> = ({ onReady, player, updateMarkedPhase, isShuffler }) => {
  const { tournament, roundNum } = useTournamentCurrentContext();

  return (
    <div className="column">
      <div
        css={css`
          background-color: ${isShuffler ? 'black' : 'white'};
          color: ${isShuffler ? 'white' : 'black'};
        `}
        className="player-data"
      >
        {player.name}{' '}
        <span
          css={css`
            padding-left: 4px;
            font-size: 0.8em;
          `}
        >
          ({player.wins.length}-{player.losses.length})
        </span>
      </div>
      <div className="player-total">
        <Totaler playerId={player.id} rounds={tournament.rounds} />
      </div>
      <div className="player-data">
        <PhaseScorer
          roundNum={roundNum}
          player={player}
          onMarkedPhaseUpdate={updateMarkedPhase}
          onMeasureUpdate={onReady}
        />
      </div>
    </div>
  );
};

export default GameViewColumn;
