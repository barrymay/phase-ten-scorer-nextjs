/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import React, {
  createRef,
  RefObject,
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from 'react';
import P10Button from '../common/button/P10Button';
import useMeasure, { IRect } from '../common/useMeasure';
import { usePlayersState } from '../context/PlayersContext';
import { IRound, IRoundPlayerData } from '../context/TournamentContext';
import { useTournamentCurrentContext } from '../context/TournamentCurrentContext';
import SingleScoreForm from './SingleScoreForm';
import DivAnimator from './DivAnimator';

export interface ISingleScoreFormFuncs {
  performSubmit: () => void;
  setFocus: () => void;
  enableTabIndex: (enable: boolean) => void;
}

const ScoringWizard: React.FC<{
  onComplete: (roundScore: IRound) => void;
}> = ({ onComplete }) => {
  const players = usePlayersState();
  const { tournament } = useTournamentCurrentContext();
  const roundCount = useRef(tournament.rounds.length + 1).current;
  const [playerIndex, setPlayerIndex] = useState(0);
  const [roundScore, setRoundScore] = useState<IRound>({});
  const formRefMap = useRef<Array<RefObject<ISingleScoreFormFuncs>>>([]);
  const [refWidthMeasure, boundsWidth] = useMeasure<HTMLDivElement>();
  const [refHeightMeasure, boundsHeight] = useMeasure<HTMLDivElement>();

  const [
    { left: maxLeft, top: maxTop, width: maxWidth, height: maxHeight },
    setMaxBounds,
  ] = useState<IRect>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const getOrCreateRef = useCallback((playerIndex: number): React.RefObject<
    ISingleScoreFormFuncs
  > => {
    if (!formRefMap.current[playerIndex]) {
      formRefMap.current[playerIndex] = createRef();
    }
    return formRefMap.current[playerIndex];
  }, []);

  const updatePlayerIndex = useCallback(
    (nextPlayer: number) => {
      const formRef = getOrCreateRef(nextPlayer);
      formRef.current && formRef.current.setFocus();
      setPlayerIndex(nextPlayer);
      formRefMap.current.forEach((item, i) => {
        item.current && item.current.enableTabIndex(i === nextPlayer);
      });
    },
    [getOrCreateRef],
  );

  const moveNext = useCallback(() => {
    const formRef = getOrCreateRef(playerIndex);
    formRef.current && formRef.current.performSubmit();
  }, [getOrCreateRef, playerIndex]);

  const moveBack = () => {
    if (playerIndex > 0) {
      const nextPageIndex = playerIndex - 1;
      updatePlayerIndex(nextPageIndex);
    }
  };

  const keyHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      moveNext();
    } else if (event.ctrlKey && event.key === 'Backspace') {
      moveBack();
    }
  };

  useEffect(() => {
    setMaxBounds({
      top: maxTop,
      left: maxLeft,
      height: boundsHeight.height ? boundsHeight.height : maxHeight,
      width: boundsWidth.width || maxWidth,
    });
  }, [boundsHeight, boundsWidth.width, maxHeight, maxLeft, maxTop, maxWidth]);

  // initialize focus on first element
  useEffect(() => {
    const formRef = getOrCreateRef(0);
    formRef.current && formRef.current.setFocus();
    formRefMap.current.forEach((item, i) => {
      item.current && item.current.enableTabIndex(i === 0);
    });
  }, [getOrCreateRef]);

  const completeScore = useCallback(
    (playerId: string, score: IRoundPlayerData) => {
      const updatedValue = {
        ...roundScore,
        [playerId]: score,
      };

      if (playerIndex < tournament.playerIds.length - 1) {
        setRoundScore(updatedValue);
        const nextPageIndex = playerIndex + 1;
        updatePlayerIndex(nextPageIndex);
      } else {
        onComplete(updatedValue);
      }
    },
    [
      onComplete,
      playerIndex,
      roundScore,
      tournament.playerIds.length,
      updatePlayerIndex,
    ],
  );

  const childWrap: React.ReactNode[] = useMemo<React.ReactNode[]>(() => {
    return tournament.playerIds.map((playerId, i) => {
      const { name: playerName } = players[playerId];

      return (
        <div
          data-testid={`scorer-${playerId}`}
          key={playerId}
          ref={refHeightMeasure.ref}
        >
          <div>Player: {playerName}</div>
          <SingleScoreForm
            ref={getOrCreateRef(i)}
            round={roundScore[playerId]}
            onSubmitScore={(score: IRoundPlayerData) =>
              completeScore(playerId, score)
            }
          />
        </div>
      );
    });
  }, [
    completeScore,
    getOrCreateRef,
    players,
    refHeightMeasure.ref,
    roundScore,
    tournament.playerIds,
  ]);

  return (
    <div onKeyDown={keyHandler}>
      <div>Round #{roundCount}</div>
      <div
        ref={refWidthMeasure.ref}
        css={css`
          position: relative;
          height: ${maxHeight}px;
        `}
      >
        <div>
          <DivAnimator
            currentIndex={playerIndex}
            boundsHeight={boundsHeight.height}
            boundsWidth={boundsWidth.width}
          >
            {childWrap}
          </DivAnimator>
        </div>
      </div>

      <div
        css={css`
          padding-top: 4px;
          display: flex;
        `}
      >
        {playerIndex !== 0 && (
          <P10Button faIconDef={faArrowLeft} minimal onClick={moveBack}>
            Back
          </P10Button>
        )}
        <div
          css={css`
            display: flex;
            flex: 1 1 auto;
          `}
        />
        <P10Button
          faIconDef={faArrowRight}
          minimal
          iconRight
          onClick={moveNext}
        >
          {playerIndex !== tournament.playerIds.length - 1 ? 'Next' : 'Done'}
        </P10Button>
      </div>
    </div>
  );
};

export default ScoringWizard;
