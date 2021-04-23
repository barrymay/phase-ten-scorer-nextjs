/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { faTimesCircle } from '@fortawesome/pro-regular-svg-icons';
import Router from 'next/router';
import React from 'react';
import P10Button from '../common/button/P10Button';
import { useTournamentContext } from '../context/TournamentContext';
import { useAppTheme } from '../theming/AppThemeProvider';
import { darken } from 'polished';

const TournamentManager: React.FC = () => {
  const theme = useAppTheme();
  const { tournaments, removeTournament } = useTournamentContext();
  function openGame(gameId: string): void {
    Router.push(`/GameView/${gameId}`);
  }

  return (
    <div
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
          border: 1px solid ${theme.default.border};
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
            .tournamentName {
              display: flex;
              flex: 1 1 auto;
              cursor: pointer;
            }
          }
        }
      `}
    >
      <div className="header">Active Tournaments ({tournaments.length}):</div>
      {!tournaments.length ? (
        <div className="no-value">No Tournaments Created</div>
      ) : (
        <div className="list">
          {tournaments.map((item, index) => {
            const playerCount = `${item.playerIds.length} Player${
              item.playerIds.length !== 1 ? 's' : ''
            }`;
            const bgColor: string =
              index % 2 ? theme.default.primaryBgAlt : theme.default.primaryBg;
            const bgColorHover = darken(0.1, bgColor);
            return (
              <div
                key={item.id}
                className="tournament-button"
                css={css`
                  background-color: ${bgColor};
                  &:hover {
                    background-color: ${bgColorHover};
                  }
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
                  title="Remove Game"
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
