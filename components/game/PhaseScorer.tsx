/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { IRound } from '../context/TournamentContext';
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
  display: flex;
  flex-direction: column;
  .row {
    display: flex;
    .phase {
      border: 1px solid black;
      vertical-align: middle;
      font-size: 0.8em;
      display: flex;
      border-radius: 16px;
      min-width: 16px;
      min-height: 16px;
      align-items: center;
      justify-content: center;
      margin: 2px;
      padding: 2px;
      cursor: default;
      &.completed {
        color: white;
        background-color: black;
      }
    }
  }
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
      {rowPhases.map((innerList, index) => (
        <div key={`phase-row-${index}`} className="row">
          {innerList.map((phase, index) => (
            <div
              key={`phase-${phase.id}`}
              className={`phase ${
                phasesList.includes(phase.id) ? 'completed' : ''
              }`}
              title={phase.rule}
            >
              {phase.id}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PhaseScorer;
