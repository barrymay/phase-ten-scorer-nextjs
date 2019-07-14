/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import React, { useMemo, useRef, useState } from 'react';
import P10Button from '../common/button/P10Button';
import Modal from '../common/Modal';
import { IPlayer, usePlayerInfo } from '../context/PlayersContext';
import { IRound } from '../context/TournamentContext';
import { useTournamentCurrentContext } from '../context/TournamentCurrentContext';
import ScoringWizard from './ScoringWizard';
import Totaler from './Totaler';

const PhaseScorer = dynamic(() => import('./PhaseScorer'));

interface IOwnProps {
  gameId: string;
}

const GameViewControl: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(true);
  const [winnerMessage, setWinnerMessage] = useState('');
  const mainDivRef = useRef<HTMLDivElement>(null);

  const { tournament, scoreRound } = useTournamentCurrentContext();
  const players = usePlayerInfo(tournament.playerIds);

  const winnersResult = useMemo(() => {
    const playerData = tournament.playerData;
    if (!playerData) {
      return '';
    }
    const winners = tournament.playerIds.reduce<
      Array<{ player: IPlayer; score: number }>
    >((result, next) => {
      let nextPlayerData = playerData[next];
      if (nextPlayerData && !nextPlayerData.phasesLeft.length) {
        const player = players.find(item => item.id === next);
        if (player) {
          result.push({
            player,
            score: nextPlayerData.score,
          });
        }
      }
      return result;
    }, []);

    let resultString = '';
    if (winners.length > 0) {
      if (winners.length === 1) {
        resultString += 'The winner is  ';
      } else {
        resultString += 'The winners are ';
      }
    }
    resultString += winners.reduce((result, next) => {
      if (result) {
        result += ', and ';
      }
      result += `${next.player.name} with ${next.score}`;
      return result;
    }, '');
    if (resultString !== winnerMessage) {
      setWinnerMessage(resultString);
      setShowWinnerModal(true);
    }
    return resultString;
  }, [players, tournament.playerData, tournament.playerIds, winnerMessage]);
  const addScore = () => {
    setShowModal(true);
  };

  const submitScore = (newRoundScore: IRound) => {
    scoreRound(newRoundScore);
    setShowModal(false);
    mainDivRef.current && mainDivRef.current.focus();
  };

  const GameBoard = useMemo(
    () =>
      styled.div(css`
        display: flex;
        .header {
          display: flex;
        }
        .column {
          display: flex;
          flex-direction: column;
          width: ${100 / players.length}%;
          border: 1px solid black;
          align-content: center;
          > div:not(:last-child) {
            border-bottom: 1px solid black;
          }
          .player-data {
            display: flex;
            justify-content: center;
            // padding here is temporary unless measuring is set
            padding-bottom: 10px;
          }
          .player-total {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
      `),

    [players.length],
  );

  const hideModal = () => {
    setShowModal(false);
    mainDivRef.current && mainDivRef.current.focus();
  };

  const keyHandlerGame = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      event.stopPropagation();
      addScore();
    }
  };

  return (
    <div
      css={css`
        height: 100%;
      `}
      ref={mainDivRef}
      onKeyDown={keyHandlerGame}
      tabIndex={0}
    >
      <Modal
        shown={showModal}
        title="Score Round"
        onClick={hideModal}
        onCancel={hideModal}
        width={300}
      >
        <ScoringWizard onComplete={submitScore} />
      </Modal>
      <Modal
        shown={!!winnersResult && showWinnerModal}
        title="Winner"
        onClick={() => {
          setShowWinnerModal(false);
        }}
        onCancel={() => {
          setShowWinnerModal(false);
        }}
        width={300}
      >
        <div>{winnersResult}</div>
      </Modal>

      <div
        css={css`
          padding: 4px;
          display: flex;
          flex-direction: column;
          .header {
            display: flex;
            align-items: center;
            button {
              margin-left: 10px;
            }
          }
        `}
      >
        <div className="header">
          Game Id: {tournament.name}{' '}
          <P10Button
            minimal
            title="Score Round (Ctrl-S)"
            onClick={() => addScore()}
          >
            Score Round
          </P10Button>
        </div>
        <GameBoard>
          {players.map(player => (
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
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
        </GameBoard>
      </div>
    </div>
  );
};

export default GameViewControl;
