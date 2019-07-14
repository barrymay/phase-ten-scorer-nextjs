/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { IRound } from '../context/TournamentContext';
import PhaseButton, { PhaseState } from './PhaseButton';
import { useState, useMemo } from 'react';
interface IPhase {
  id: number;
  rule: string;
}

const phases: IPhase[] = [
  {
    id: 1,
    rule: '2 sets of 3',
  },
  {
    id: 2,
    rule: '1 set of 3 + 1 run of 4',
  },
  {
    id: 3,
    rule: '1 set of 4 + 1 run of 4',
  },
  {
    id: 4,
    rule: '1 run of 7',
  },
  {
    id: 5,
    rule: '1 run of 8',
  },
  {
    id: 6,
    rule: '1 run of 9',
  },
  {
    id: 7,
    rule: '2 sets of 4',
  },
  {
    id: 8,
    rule: '7 cards of one color',
  },
  {
    id: 9,
    rule: '1 set of 5 + 1 set of 2',
  },
  {
    id: 10,
    rule: '1 set of 5 + 1 set of 2',
  },
];

const phaseScorerStyle = css`
  padding: 4px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 5px;
  grid-template-rows: repeat(5, 1fr);
  grid-template-columns: repeat(2, 1fr);
`;

const PhaseScorer: React.FC<{ playerId: string; rounds: IRound[] }> = ({
  playerId,
  rounds,
}) => {
  const phasesList = useMemo(
    () =>
      rounds.reduce<PhaseState[]>((result, next) => {
        const roundForPlayer = next[playerId];
        if (roundForPlayer) {
          result[roundForPlayer.phaseCompleted] = 'complete';
        }
        return result;
      }, new Array(10).fill('default')),
    [],
  );

  const [phaseStates, setPhaseStates] = useState<PhaseState[]>(phasesList);

  const setPhase = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    phaseId: number,
  ) => {
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
            {phase.id}
          </PhaseButton>
        );
      })}
    </div>
  );
};

export default PhaseScorer;
