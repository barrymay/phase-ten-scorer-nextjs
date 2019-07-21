/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { useTournamentCurrentContext } from '../context/TournamentCurrentContext';
import { useTournamentCurrentRoundContext } from '../context/TournamentCurrentRoundContext';
import PhaseScorer from './PhaseScorer';
import Totaler from './Totaler';

const GameViewColumn: React.FC<{ onReady: VoidFunction }> = ({ onReady }) => {
  const { tournament } = useTournamentCurrentContext();
  const { updateMarkedPhase, player } = useTournamentCurrentRoundContext();

  return (
    <div className="column">
      <div className="player-data">{player.name}</div>
      <div className="player-total">
        <Totaler playerId={player.id} rounds={tournament.rounds} />
      </div>
      <div className="player-data">
        <PhaseScorer
          playerId={player.id}
          rounds={tournament.rounds}
          onMarkedPhaseUpdate={updateMarkedPhase}
          onMeasureUpdate={onReady}
        />
      </div>
    </div>
  );
};

export default GameViewColumn;
