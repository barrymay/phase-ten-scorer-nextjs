/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { IRound } from '../context/TournamentContext';
import PhaseButton from './PhaseButton';
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

const generateRowPhases = (inputArray: IPhase[]): IPhase[][] => {
  const result: IPhase[][] = [];
  for (let i = 0; i < inputArray.length; i += 5) {
    result.push(inputArray.slice(i, i + 5));
  }
  return result;
};
const rowPhases = generateRowPhases(phases);

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
  const phasesList = rounds.reduce<number[]>((result, next) => {
    const roundForPlayer = next[playerId];
    if (roundForPlayer) {
      result.push(roundForPlayer.phaseCompleted);
    }
    return result;
  }, []);
  return (
    <div css={phaseScorerStyle}>
      {rowPhases.map((innerList, index) =>
        innerList.map((phase, index) => (
          <PhaseButton
            key={`phase-${phase.id}`}
            isCompleted={phasesList.includes(phase.id)}
            title={phase.rule}
          >
            {phase.id}
          </PhaseButton>
        )),
      )}
    </div>
  );
};

export default PhaseScorer;
