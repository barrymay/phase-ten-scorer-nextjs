/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from 'react';
import { useTournamentCurrentContext } from '../context/TournamentCurrentContext';
import PhaseScorer from './PhaseScorer';
import Totaler from './Totaler';
import { IPlayer } from '../context/PlayersContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignLanguage } from '@fortawesome/pro-regular-svg-icons';
import { useSpring, animated } from 'react-spring';
import { useAppTheme } from '../theming/AppThemeProvider';

const GameViewColumn: React.FC<{
  player: IPlayer;
  onReady: VoidFunction;
  updateMarkedPhase: (phase: number | undefined) => void;
  isShuffler: boolean;
  divSpring: any;
}> = ({ onReady, player, updateMarkedPhase, isShuffler, divSpring }) => {
  const theme = useAppTheme();
  const { tournament, roundNum } = useTournamentCurrentContext();
  const nameHighlight = useSpring({
    color: isShuffler ? theme.default.primaryBg : theme.default.primary,
    backgroundColor: isShuffler
      ? theme.default.primary
      : theme.default.primaryBg,
  });

  return (
    <animated.div style={divSpring} className="column">
      <animated.div style={nameHighlight} className="player-data">
        {isShuffler && (
          <FontAwesomeIcon
            css={css`
              padding-right: 2px;
            `}
            icon={faSignLanguage}
          />
        )}
        {player.name}{' '}
        <span
          css={css`
            padding-left: 4px;
            font-size: 0.8em;
          `}
        >
          ({player.wins.length}-{player.losses.length})
        </span>
      </animated.div>
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
    </animated.div>
  );
};

export default GameViewColumn;
