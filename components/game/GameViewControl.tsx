/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import Router from 'next/router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import P10Button from '../common/button/P10Button';
import Modal from '../common/Modal';
import { IPlayer, usePlayerInfo } from '../context/PlayersContext';
import { IRound } from '../context/TournamentContext';
import { useTournamentCurrentContext } from '../context/TournamentCurrentContext';
import GameViewColumn from './GameViewColumn';
import ScoringWizard from './ScoringWizard';
import WinnerDisplay, { IWinnerList } from './WinnerDisplay';
import { focusHiddenInput, HiddenInput } from '../common/IosFocusHiddenInput';
import { useAppTheme } from '../theming/AppThemeProvider';
import { AppTheme } from '../theming/themes';
import ConfirmModal from '../common/ConfirmModal';

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

interface IGameBoardProps {
  players: IPlayer[];
  theme: AppTheme;
}

const GameBoard = styled.div<IGameBoardProps>`
  display: grid;
  grid-template-columns: 50% 50%;
  @media (min-width: 650px) {
    grid-template-columns: ${(props: IGameBoardProps) =>
      new Array(props.players.length)
        .fill(100 / props.players.length + '%')
        .join(' ')};
  }
  .header {
    display: flex;
  }
  .column {
    display: flex;
    flex-direction: column;
    border: 1px solid ${(props: IGameBoardProps) => props.theme.default.border};
    align-content: center;
    > div:not(:last-child) {
      border-bottom: 1px solid
        ${(props: IGameBoardProps) => props.theme.default.border};
    }
    .player-data {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .player-total {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`;

const GameViewControl: React.FC<{ onReady: VoidFunction; divSpring: any }> = ({
  onReady,
  divSpring,
}) => {
  const theme = useAppTheme();
  const [showModal, setShowModal] = useState<'score' | 'remove' | undefined>(
    undefined,
  );
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

  const hideModal = () => {
    setShowModal(undefined);
    mainDivRef.current && mainDivRef.current.focus();
  };

  const winners = useMemo<IWinnerList[]>(() => {
    const playerData = tournament.playerData;
    if (!playerData) {
      return [];
    }
    const winnersList = tournament.playerIds.reduce<
      Array<{ player: IPlayer; score: number }>
    >((result, next) => {
      const nextPlayerData = playerData[next];
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
    return winnersList;
  }, [players, tournament.playerData, tournament.playerIds]);

  const nextPhaseMap = useRef<IPlayerPhaseMap>({});
  const updateMarkedPhase = useCallback(
    (playerId: string, phase: number | undefined) => {
      nextPhaseMap.current[playerId] = phase;
    },
    [],
  );

  const addScore = () => {
    focusHiddenInput();
    if (!winners.length) {
      setShowModal('score');
    }
  };

  const submitScore = (newRoundScore: IRound) => {
    scoreRound(newRoundScore);
    hideModal();
    nextPhaseMap.current = {};
    mainDivRef.current && mainDivRef.current.focus();
  };

  const keyHandlerGame = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      event.stopPropagation();
      addScore();
    }
  };

  const removeGame = () => {
    setShowModal('remove');
  };

  const confirmRemove = () => {
    removeCurrentTournament();
    Router.push('/');
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
      <HiddenInput />

      <Modal
        shown={showModal === 'score'}
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

      <ConfirmModal
        modalTitle="Remove Game?"
        isShown={showModal === 'remove'}
        onCloseModal={hideModal}
        onConfirmModal={confirmRemove}
      >
        Are you sure you want to remove game &lsquo;{tournament.name}&rsquo;?
      </ConfirmModal>

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
          <div className="name">
            Game: {tournament.name} - Round {roundNum}
          </div>
          <P10Button
            minimal
            color="red"
            title="Remove Game"
            onClick={() => {
              removeGame();
            }}
          >
            Remove Game
          </P10Button>
        </div>
        <GameBoard players={players} theme={theme}>
          {players.map((player, index) => (
            <GameViewColumn
              divSpring={divSpring}
              key={player.id}
              player={player}
              isShuffler={(roundNum - 1) % players.length === index}
              onReady={() => {
                playerReady(player.id);
              }}
              updateMarkedPhase={phase => {
                updateMarkedPhase(player.id, phase);
              }}
            ></GameViewColumn>
          ))}
        </GameBoard>
        {winners.length ? (
          <WinnerDisplay winners={winners} />
        ) : (
          <div
            css={css`
              display: flex;
              flex-direction: column;
              padding-top: 4px;
              align-items: center;
            `}
          >
            <P10Button
              css={css`
                display: flex;
                border-radius: 4px;
                &:focus {
                  border-color: #333;
                }
              `}
              minimal
              title="Score Round (Ctrl-S)"
              onClick={() => addScore()}
            >
              Score Round
            </P10Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameViewControl;
