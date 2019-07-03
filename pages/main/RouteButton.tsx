import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faTrophyAlt,
  faUserFriends,
  faFlask,
} from '@fortawesome/pro-regular-svg-icons';
import React from 'react';
import LinkButton from '../common/button/LinkButton';
import PlayerSetup from '../playerSetup/PlayerSetup';
import CreateTournament from '../game/CreateTournament';
import GameView from '../game/GameView';

export type RouteKeys = 'playerSetup' | 'createTournament' | 'testGame';

interface IRouteDefinition {
  icon: IconDefinition;
  text: string;
  route: string;
  component: React.FC<any>;
  hideFromNavBar?: boolean;
}

type RouteDefinitions = { [P in RouteKeys]: IRouteDefinition };

export const RouteDefinitions: RouteDefinitions = {
  playerSetup: {
    icon: faUserFriends,
    text: 'Player Setup',
    route: '/playerSetup',
    component: PlayerSetup,
  },
  createTournament: {
    icon: faTrophyAlt,
    text: 'Create a Tournament',
    route: '/createTournament',
    component: CreateTournament,
  },
  testGame: {
    icon: faFlask,
    text: 'Test Game',
    route: '/gameView/:gameId',
    component: GameView,
    hideFromNavBar: true,
  },
};

interface OwnProps {
  routeKey: RouteKeys;
  minimal?: boolean;
}

const RouteButton: React.FC<OwnProps> = props => {
  const { routeKey, ...passedProps } = props;
  const { icon, text, route } = RouteDefinitions[routeKey];
  const { minimal } = props;
  return (
    <LinkButton
      to={route}
      faIconDef={icon}
      title={minimal ? text : undefined}
      {...passedProps}
    >
      {minimal ? undefined : text}
    </LinkButton>
  );
};

export default RouteButton;
