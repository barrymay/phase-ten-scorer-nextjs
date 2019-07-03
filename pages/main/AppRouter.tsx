/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Location, RouteComponentProps, Router } from '@reach/router';
import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { getFadeCss } from '../common/transition.utils';

const transitionTimeMs = 150;
const transition = getFadeCss('.router', transitionTimeMs);

export const RouteContainer: React.FC<
  RouteComponentProps & { component: JSX.Element }
> = ({ component, children, ...otherProps }) => {
  return (
    <div className="page">{React.cloneElement(component, otherProps)}</div>
  );
};

export const AppRouter: React.FC = ({ children }) => {
  return (
    <Location>
      {({ location }) => (
        <TransitionGroup css={transition}>
          <CSSTransition
            key={location.key}
            classNames="fade"
            timeout={transitionTimeMs}
          >
            <Router location={location} className="router">
              {children}
            </Router>
          </CSSTransition>
        </TransitionGroup>
      )}
    </Location>
  );
};
