/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import TournamentManager from '../game/TournamentManager';
import RouteButton, { RouteDefinitions, RouteKeys } from './RouteButton';
import { RouteComponentProps } from '@reach/router';

const menuStyle = css({
  padding: '2px 0px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '.buttonList': {
    display: 'flex',
    flexDirection: 'column',
    button: {
      margin: '2px',
    },
  },
});

export const MainMenu: React.FC<RouteComponentProps> = ({ navigate }) => {
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
        navigate={navigate}
        css={{
          minWidth: 250,
        }}
      />
    </div>
  );
};
