/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { IRound } from '../context/TournamentContext';
import PhaseButton, { PhaseState } from './PhaseButton';
import { useState, useMemo, useRef, useEffect } from 'react';
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
    rule: '7 cards of one color',
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

const getPhaseState = (rounds: IRound[], playerId: string) => {
  return rounds.reduce<PhaseState[]>((result, next) => {
    const roundForPlayer = next[playerId];
    if (roundForPlayer) {
      result[roundForPlayer.phaseCompleted] = 'complete';
    }
    return result;
  }, new Array(10).fill('default'));
};

const phaseScorerStyle = css`
  padding: 4px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 2px;
  grid-template-rows: repeat(5, 1fr);
  grid-template-columns: repeat(2, 1fr);
`;

const PhaseScorer: React.FC<{ playerId: string; rounds: IRound[] }> = ({
  playerId,
  rounds,
}) => {
  const lastRounds = useRef<PhaseState[] | null>(null);
  const [phaseStates, setPhaseStates] = useState<PhaseState[]>(
    getPhaseState(rounds, playerId),
  );

  useEffect(() => {
    if (!lastRounds.current || rounds.length !== lastRounds.current.length) {
      setPhaseStates(getPhaseState(rounds, playerId));
    }
  }, [rounds]);

  const setPhase = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    phaseId: number,
  ) => {
    if (phaseStates[phaseId] === 'complete') {
      return;
    }
    const newStates = phaseStates.map<PhaseState>((item, index) =>
      index !== phaseId && item === 'new-complete' ? 'default' : item,
    );
    newStates[phaseId] =
      newStates[phaseId] === 'default' ? 'new-complete' : 'default';
    setPhaseStates(newStates);
  };

  return (
    <div css={phaseScorerStyle}>
      {phases.map((phase, index) => {
        return (
          <PhaseButton
            key={`phase-${phase.id}`}
            completedState={phaseStates[index]}
            title={phase.rule}
            onClick={e => {
              setPhase(e, index);
            }}
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
    </div>
  );
};

export default PhaseScorer;
