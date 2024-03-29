import { css } from '@emotion/react';
import React from 'react';
import ProviderWrapper from '../game/ProviderWrapper';
import TournamentManager from '../game/TournamentManager';
import RouteButton, { RouteDefinitions, RouteKeys } from './RouteButton';

const menuStyle = css`
  padding: 2px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .buttonList {
    padding: 10px 0px;
    display: flex;
    flex-direction: column;
    button {
      margin: 2px;
    }
  }
`;

export const MainMenu: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className} css={menuStyle}>
      <div className="buttonList">
        {Object.entries(RouteDefinitions)
          .filter(([, value]) => !value.hideFromNavBar)
          .map(([key]) => (
            <RouteButton key={key} routeKey={key as RouteKeys} />
          ))}
      </div>
      <ProviderWrapper>
        <TournamentManager
          css={css`
            min-width: 250px;
          `}
        />
      </ProviderWrapper>
    </div>
  );
};
