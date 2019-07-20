/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { IPlayer } from '../context/PlayersContext';
import Totaler from './Totaler';
import { useTournamentCurrentContext } from '../context/TournamentCurrentContext';
import { useTournamentCurrentRoundContext } from '../context/TournamentCurrentRoundContext';
import PhaseScorer from './PhaseScorer';

const GameViewColumn: React.FC<{ onReady: VoidFunction }> = ({ onReady }) => {
  const { tournament } = useTournamentCurrentContext();
  const { updateMarkedPhase, player } = useTournamentCurrentRoundContext();

  return (
    <React.Fragment key={player.id}>
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
    </React.Fragment>
  );
};

export default GameViewColumn;
