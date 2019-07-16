/** @jsx jsx */
import { jsx } from '@emotion/core';
import { faTimesCircle } from '@fortawesome/pro-regular-svg-icons';
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
    <div className={className}>
      <div>Active Tournaments:</div>
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          '.tournamentName': {
            display: 'flex',
            flex: '1 1 auto',
            cursor: 'pointer',
          },
        }}
      >
        {tournaments.map(item => {
          const playerCount = `${item.playerIds.length} Player${
            item.playerIds.length !== 1 ? 's' : ''
          }`;
          return (
            <div key={item.id} css={{ display: 'flex' }}>
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
    </div>
  );
};

export default TournamentManager;
