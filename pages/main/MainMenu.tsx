/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import TournamentManager from '../game/TournamentManager';
import RouteButton, { RouteDefinitions, RouteKeys } from './RouteButton';

const menuStyle = css`
  padding: 2px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .buttonList {
    display: flex;
    flex-direction: column;
    button {
      margin: 2px;
    }
  }
`;

export const MainMenu: React.FC = () => {
  return (
    <div className="page" css={menuStyle}>
      <div className="buttonList">
        {Object.entries(RouteDefinitions)
          .filter(([, value]) => !value.hideFromNavBar)
          .map(([key]) => (
            <RouteButton key={key} routeKey={key as RouteKeys} />
          ))}
      </div>
      <TournamentManager
        css={{
          minWidth: 250,
        }}
      />
    </div>
  );
};
