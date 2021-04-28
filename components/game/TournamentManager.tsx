import { css } from '@emotion/react';
import { faTimesCircle } from '@fortawesome/pro-regular-svg-icons';
import Router from 'next/router';
import { darken } from 'polished';
import React from 'react';
import 'twin.macro';
import tw from 'twin.macro';
import P10Button from '../common/button/P10Button';
import { useTournamentContext } from '../context/TournamentContext';
import { useAppTheme } from '../theming/AppThemeProvider';

const TournamentManager: React.FC<{ className?: string }> = ({ className }) => {
  const theme = useAppTheme();
  const { tournaments, removeTournament } = useTournamentContext();
  function openGame(gameId: string): void {
    Router.push(`/GameView/${gameId}`);
  }

  return (
    <div
      className={className}
      css={css`
        .header {
          ${tw`flex justify-center pb-0.5 font-weight[700]`}
        }
        .no-value {
          ${tw`flex justify-center`}
        }
        .list {
          ${tw`flex flex-col rounded`}
          border: 1px solid ${theme.default.border};
          .tournament-button {
            ${tw`flex flex-row flex-1 p-0.5 `}
            &:first-of-type {
              border-radius: 2px 2px 0px 0px;
            }
            &:last-child {
              border-radius: 0px 0px 2px 2px;
            }
            transition: color 100ms ease-in-out,
              background-color 100ms ease-in-out;
            .tournamentName {
              ${tw`flex flex-auto cursor-pointer`}
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
