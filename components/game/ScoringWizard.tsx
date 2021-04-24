/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { faArrowLeft, faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import React, {
  createRef,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import P10Button from '../common/button/P10Button';
import { focusHiddenInput } from '../common/IosFocusHiddenInput';
import useMeasure, { IRect } from '../common/useMeasure';
import { usePlayersStateAsMap } from '../context/PlayersContext';
import { IRound, IRoundPlayerData } from '../context/TournamentContext';
import { useTournamentCurrentContext } from '../context/TournamentCurrentContext';
import DivAnimator from './DivAnimator';
import { IPlayerPhaseMap } from './GameViewControl';
import SingleScoreForm from './SingleScoreForm';

export interface ISingleScoreFormFuncs {
  performSubmit: () => void;
  setFocus: () => void;
  enableTabIndex: (enable: boolean) => void;
}

const ScoringWizard: React.FC<{
  nextPhaseMap: IPlayerPhaseMap;
  onComplete: (roundScore: IRound) => void;
}> = ({ onComplete, nextPhaseMap }) => {
  const players = usePlayersStateAsMap();
  const { tournament, roundNum } = useTournamentCurrentContext();

  const [playerIndex, setPlayerIndex] = useState(0);
  const playerIndexRef = useRef(playerIndex);

  const roundScoreRef = useRef<IRound>({});
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
      // HACK - ensure focus doesn't get set until form has animated.
      // If react-spring gives callback, use it!
      setTimeout(() => {
        formRef.current && formRef.current.setFocus();
      }, 500);
      playerIndexRef.current = nextPlayer;
      setPlayerIndex(nextPlayer);
      formRefMap.current.forEach((item, i) => {
        item.current && item.current.enableTabIndex(i === nextPlayer);
      });
    },
    [getOrCreateRef],
  );

  const moveNext = useCallback(() => {
    focusHiddenInput();
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
    let catchEvent = false;
    if (event.key === 'Enter') {
      catchEvent = true;
      moveNext();
    } else if (event.ctrlKey && event.key === 'Backspace') {
      catchEvent = true;
      moveBack();
    }

    if (catchEvent) {
      event.preventDefault();
      event.stopPropagation();
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
        ...roundScoreRef.current,
        [playerId]: score,
      };

      if (playerIndexRef.current < tournament.playerIds.length - 1) {
        roundScoreRef.current = updatedValue;
        const nextPageIndex = playerIndexRef.current + 1;
        updatePlayerIndex(nextPageIndex);
      } else {
        onComplete(updatedValue);
      }
    },
    [onComplete, tournament.playerIds.length, updatePlayerIndex],
  );

  const childWrap: React.ReactNode[] = useMemo<React.ReactNode[]>(() => {
    return tournament.playerIds.map((playerId, i) => {
      const player = players[playerId];

      return (
        <div
          data-testid={`scorer-${player.id}`}
          key={player.id}
          ref={refHeightMeasure.ref}
        >
          <div>Player: {player.name}</div>
          <SingleScoreForm
            player={player}
            ref={getOrCreateRef(i)}
            inputPhase={nextPhaseMap[playerId]}
            onSubmitScore={completeScore}
          />
        </div>
      );
    });
  }, [
    completeScore,
    getOrCreateRef,
    nextPhaseMap,
    players,
    refHeightMeasure.ref,
    tournament.playerIds,
  ]);

  return (
    <div onKeyDown={keyHandler}>
      <div>Round #{roundNum}</div>
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
