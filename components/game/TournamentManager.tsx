/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import React from 'react';
import P10Button from '../common/button/P10Button';
import { useTournamentContext } from '../context/TournamentContext';

const TournamentManager: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { tournaments, removeTournament } = useTournamentContext();
  function openGame(gameId: string): void {
    Router.push(`/GameView/${gameId}`);
  }

  return (
    <div
      className={className}
      css={css`
        .header {
          display: flex;
          justify-content: center;
          padding-bottom: 2px;
          font-weight: 700;
        }
        .no-value {
          display: flex;
          justify-content: center;
        }
        .list {
          display: flex;
          flex-direction: column;
          border: 1px solid #cccccc;
          border-radius: 4px;

          .tournament-button {
            display: flex;
            flex-direction: row;
            flex: 1;
            padding: 2px;
            &:first-of-type {
              border-radius: 2px 2px 0px 0px;
            }
            &:last-child {
              border-radius: 0px 0px 2px 2px;
            }
            transition: color 100ms ease-in-out,
              background-color 100ms ease-in-out;
            &:hover {
              background-color: #006699;
              color: white;
            }
            .tournamentName {
              display: flex;
              flex: 1 1 auto;
              cursor: pointer;
            }
          }
        }
      `}
    >
      <div className="header">Active Tournaments:</div>
      {!tournaments.length ? (
        <div className="no-value">No Tournaments Created</div>
      ) : (
        <div className="list">
          {tournaments.map((item, index) => {
            const playerCount = `${item.playerIds.length} Player${
              item.playerIds.length !== 1 ? 's' : ''
            }`;
            return (
              <div
                key={item.id}
                className="tournament-button"
                css={css`
                  background: ${index % 2 ? '#eee' : 'white'};
                `}
              >
                <div
                  className="tournamentName"
                  onClick={() => {
                    openGame(item.id);
                  }}
                >
                  {item.name}: ({playerCount})
                </div>
                <P10Button
                  title="Remove Item"
                  faIconDef={faTimesCircle}
                  minimal
                  onClick={() => {
                    removeTournament(item.id);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TournamentManager;
