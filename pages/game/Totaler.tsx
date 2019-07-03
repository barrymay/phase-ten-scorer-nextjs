/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { IRound } from '../context/TournamentContext';
import css from '@emotion/css';

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
const Totaler: React.FC<{ playerId: string; rounds: IRound[] }> = ({
  playerId,
  rounds,
}) => {
  let total = 0;
  return (
    <div css={totalerStyle}>
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
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default Totaler;
