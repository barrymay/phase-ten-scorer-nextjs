/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useCallback, useEffect, useRef, useState, MouseEvent } from 'react';
import useMeasure, { IRect, RefContainer } from '../common/useMeasure';
import { IRound } from '../context/TournamentContext';
import PhaseButton, { PhaseState } from './PhaseButton';
import styled from '@emotion/styled';
import { useTournamentCurrentContext } from '../context/TournamentCurrentContext';
import { IPlayer } from '../context/PlayersContext';
interface IPhase {
  id: number;
  shortRule: string;
  rule: string;
}

const phases: IPhase[] = [
  {
    id: 1,
    shortRule: 'S3/S3',
    rule: '2 sets of 3',
  },
  {
    id: 2,
    shortRule: 'S3/R4',
    rule: '1 set of 3 + 1 run of 4',
  },
  {
    id: 3,
    shortRule: 'S4/R4',
    rule: '1 set of 4 + 1 run of 4',
  },
  {
    id: 4,
    shortRule: 'R7',
    rule: '1 run of 7',
  },
  {
    id: 5,
    shortRule: 'R8',
    rule: '1 run of 8',
  },
  {
    id: 6,
    shortRule: 'R9',
    rule: '1 run of 9',
  },
  {
    id: 7,
    shortRule: 'S4/S4',
    rule: '2 sets of 4',
  },
  {
    id: 8,
    shortRule: 'C7',
    rule: '7 cards of one coGAMEr',
  },
  {
    id: 9,
    shortRule: 'S5/S2',
    rule: '1 set of 5 + 1 set of 2',
  },
  {
    id: 10,
    shortRule: 'S5/S3',
    rule: '1 set of 5 + 1 set of 3',
  },
];

const getPhaseState = (
  rounds: IRound[],
  playerId: string,
  startingPhase?: number,
) => {
  const result = rounds.reduce<PhaseState[]>((result, next) => {
    const roundForPlayer = next[playerId];
    if (roundForPlayer) {
      result[roundForPlayer.phaseCompleted - 1] = 'complete';
    }
    return result;
  }, new Array(10).fill('default'));
  if (startingPhase) {
    result[startingPhase - 1] = 'new-complete';
  }
  return result;
};

const Container = styled.div`
  padding: 4px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 2px;
  grid-template-rows: repeat(5, 1fr);
  grid-template-columns: repeat(2, 1fr);
`;

const useMeasureAndUpdate = (
  onMeasureUpdate?: VoidFunction,
): [RefContainer<HTMLElement>, IRect] => {
  const height = useRef(0);
  const [measureRef, boundsUpdate] = useMeasure();
  const measureUpdateCallback = useCallback(() => {
    onMeasureUpdate && onMeasureUpdate();
  }, [onMeasureUpdate]);

  useEffect(() => {
    if (boundsUpdate.height !== height.current) {
      height.current = boundsUpdate.height;
      measureUpdateCallback();
    }
  }, [boundsUpdate, measureUpdateCallback]);

  return [measureRef, boundsUpdate];
};

const PhaseScorer: React.FC<{
  roundNum?: number | undefined;
  player: IPlayer;
  startingPhase?: number | undefined;
  onMeasureUpdate?: VoidFunction;
  onMarkedPhaseUpdate?: (phaseMarked: number) => void;
}> = ({
  onMeasureUpdate,
  onMarkedPhaseUpdate,
  player,
  startingPhase,
  roundNum,
}) => {
  const lastRounds = useRef<PhaseState[] | null>(null);
  const { tournament } = useTournamentCurrentContext();
  const [phaseStates, setPhaseStates] = useState<PhaseState[]>(
    getPhaseState(tournament.rounds, player.id, startingPhase),
  );
  useEffect(() => {
    if (roundNum) {
      setPhaseStates(getPhaseState(tournament.rounds, player.id));
    }
  }, [player.id, roundNum, tournament.rounds]);
  const [measureRef, sizer] = useMeasureAndUpdate(onMeasureUpdate);

  const setPhase = useCallback(
    (e: MouseEvent<HTMLElement>, phaseId: number) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const phaseSelected = phaseId + 1;
      if (phaseStates[phaseId] === 'complete') {
        return;
      }
      const newStates = phaseStates.map<PhaseState>((item, index) =>
        index !== phaseId && item === 'new-complete' ? 'default' : item,
      );
      newStates[phaseId] =
        newStates[phaseId] === 'default' ? 'new-complete' : 'default';

      onMarkedPhaseUpdate &&
        onMarkedPhaseUpdate(
          newStates[phaseId] === 'new-complete' ? phaseSelected : -1,
        );

      setPhaseStates(newStates);
    },
    [onMarkedPhaseUpdate, phaseStates],
  );

  return (
    <Container>
      {phases.map((phase, index) => {
        return (
          <PhaseButton
            key={`phase-${phase.id}`}
            completedState={phaseStates[index]}
            title={phase.rule}
            onClick={e => {
              setPhase(e, index);
            }}
            buttonHeight={sizer.height}
            measureRef={index === 0 ? measureRef.ref : undefined}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
                padding: 0px 4px;
                .id {
                  flex: 1 1 auto;
                  text-align: left;
                }
                .rule {
                  font-size: 0.8em;
                  justify-content: flex-end;
                }
              `}
            >
              <div className="id">{phase.id}</div>
              <div className="rule">{phase.shortRule}</div>
            </div>
          </PhaseButton>
        );
      })}
    </Container>
  );
};

export default PhaseScorer;
