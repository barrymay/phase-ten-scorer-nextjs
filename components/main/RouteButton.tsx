import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faFlask,
  faTrophy,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import LinkButton from '../common/button/LinkButton';
import { ExtraP10ButtonProps } from '../common/button/P10Button';

export type RouteKeys = 'playerSetup' | 'createTournament' | 'testGame';

interface IRouteDefinition {
  icon: IconDefinition;
  text: string;
  route: string;
  hideFromNavBar?: boolean;
}

type RouteDefinitions = { [P in RouteKeys]: IRouteDefinition };

export const RouteDefinitions: RouteDefinitions = {
  playerSetup: {
    icon: faUserFriends,
    text: 'Player Setup',
    route: '/PlayerSetup',
  },
  createTournament: {
    icon: faTrophy,
    text: 'Create a Tournament',
    route: '/CreateTournament',
  },
  testGame: {
    icon: faFlask,
    text: 'Test Game',
    route: '/GameView/:gameId',
    hideFromNavBar: true,
  },
};

interface OwnProps extends ExtraP10ButtonProps {
  routeKey: RouteKeys;
}

const RouteButton: React.FC<OwnProps> = props => {
  const { routeKey, ...passedProps } = props;
  const { icon, text, route } = RouteDefinitions[routeKey];
  const { minimal } = props;
  return (
    <LinkButton
      href={route}
      faIconDef={icon}
      title={minimal ? text : undefined}
      {...passedProps}
    >
      {minimal ? undefined : text}
    </LinkButton>
  );
};

export default RouteButton;
