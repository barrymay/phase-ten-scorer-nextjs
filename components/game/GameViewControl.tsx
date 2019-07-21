/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import P10Button from '../common/button/P10Button';
import Modal from '../common/Modal';
import { IPlayer, usePlayerInfo } from '../context/PlayersContext';
import { IRound } from '../context/TournamentContext';
import { useTournamentCurrentContext } from '../context/TournamentCurrentContext';
import GameViewColumn from './GameViewColumn';
import ScoringWizard from './ScoringWizard';

const PhaseScorer = dynamic(() => import('./PhaseScorer'));

function useTrueWhenEmpty<T>(
  arrayToEmpty: T[],
  callWhenEmpty?: VoidFunction,
): [boolean, (checkValue: T) => void] {
  const arrayToEmptyRef = useRef(arrayToEmpty);
  const callWhenEmptyRef = useRef(callWhenEmpty);

  const [valid, setValid] = useState(false);

  const checkCallback = useCallback((checkValue: T) => {
    arrayToEmptyRef.current = arrayToEmptyRef.current.filter(
      item => item !== checkValue,
    );
    if (!arrayToEmptyRef.current.length) {
      setValid(true);
      if (callWhenEmptyRef.current) {
        callWhenEmptyRef.current();
      }
    }
  }, []);

  return [valid, checkCallback];
}

export interface IPlayerPhaseMap {
  [player: string]: number | undefined;
}

const GameViewControl: React.FC<{ onReady: VoidFunction }> = ({ onReady }) => {
  const [showModal, setShowModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(true);
  const [winnerMessage, setWinnerMessage] = useState('');
  const mainDivRef = useRef<HTMLDivElement>(null);

  const {
    tournament,
    scoreRound,
    removeCurrentTournament,
    roundNum,
  } = useTournamentCurrentContext();
  const players = usePlayerInfo(tournament.playerIds);

  const [appear, playerReady] = useTrueWhenEmpty(
    players.map(item => item.id),
    onReady,
  );

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

  const nextPhaseMap = useRef<IPlayerPhaseMap>({});
  const updateMarkedPhase = useCallback(
    (playerId: string, phase: number | undefined) => {
      nextPhaseMap.current[playerId] = phase;
    },
    [],
  );

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

  const [nextPhase, setNextPhase] = useState<number | undefined>(undefined);

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
        <ScoringWizard
          onComplete={submitScore}
          nextPhaseMap={nextPhaseMap.current}
        />
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
            .name {
              flex: 1 1 auto;
            }
          }
          transition: opacity 250ms ease-in-out;

          opacity: ${appear ? 1 : 0};
        `}
      >
        <div className="header">
          <div className="name">Game Id: {tournament.name}</div>
          <P10Button
            minimal
            color="red"
            title="Remove Game"
            onClick={() => {
              removeCurrentTournament();
              Router.push('/');
            }}
          >
            REMOVE GAME
          </P10Button>
        </div>
        <GameBoard>
          {players.map(player => (
            <GameViewColumn
              key={player.id}
              player={player}
              onReady={() => {
                playerReady(player.id);
              }}
              updateMarkedPhase={phase => {
                updateMarkedPhase(player.id, phase);
              }}
            ></GameViewColumn>
          ))}
        </GameBoard>
        <P10Button
          minimal
          title="Score Round (Ctrl-S)"
          onClick={() => addScore()}
        >
          Score Round
        </P10Button>
      </div>
    </div>
  );
};

export default GameViewControl;
