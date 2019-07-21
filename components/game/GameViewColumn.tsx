/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { useTournamentCurrentContext } from '../context/TournamentCurrentContext';
import PhaseScorer from './PhaseScorer';
import Totaler from './Totaler';
import { IPlayer } from '../context/PlayersContext';

const GameViewColumn: React.FC<{
  player: IPlayer;
  onReady: VoidFunction;
  updateMarkedPhase: (phase: number | undefined) => void;
}> = ({ onReady, player, updateMarkedPhase }) => {
  const { tournament, roundNum } = useTournamentCurrentContext();

  return (
    <div className="column">
      <div className="player-data">{player.name}</div>
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
