/** @jsx jsx */
import { jsx } from '@emotion/core';
import css from '@emotion/css';
import React, { useMemo } from 'react';
import { IRound } from '../context/TournamentContext';

const totalerStyle = css`
  display: flex;
  justify-content: center;
  background-color: white;
  flex-direction: column;
  align-items: flex-end;
  padding: 0px 2px;
  min-width: 150px;
  div {
    color: green;
  }
  div.total {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid black;
  }
`;
const Totaler: React.FC<{
  expanded?: boolean;
  playerId: string;
  rounds: IRound[];
}> = ({ expanded = false, playerId, rounds }) => {
  let total = 0;

  const totalOutput = useMemo(() => {
    if (expanded) {
      return (
        <React.Fragment>
          <div key="total-top">{total}</div>
          {rounds.map((item, index) => {
            if (item[playerId]) {
              total += item[playerId].score;
              return (
                <React.Fragment key={`total-${index}`}>
                  <div>{item[playerId].score}</div>
                  <div className="total">{total}</div>
                </React.Fragment>
              );
            }
          })}
        </React.Fragment>
      );
    } else {
      const sum = rounds.reduce((result, next) => {
        if (next[playerId]) {
          result += next[playerId].score;
        }
        return result;
      }, total);
      return <div key="total-top">{sum}</div>;
    }
  }, []);

  return <div css={totalerStyle}>{totalOutput}</div>;
};

export default Totaler;
