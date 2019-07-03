/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';
import ProviderWrapper from '../game/ProviderWrapper';
import { AppRouter, RouteContainer } from './AppRouter';
import { MainMenu } from './MainMenu';
import NavBar from './NavBar';
import { RouteDefinitions, RouteKeys } from './RouteButton';

const AppBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

const App: React.FC = () => (
  <ProviderWrapper>
    <AppBase />
  </ProviderWrapper>
);

export const AppBase: React.FC = ({ children }) => {
  let routes: JSX.Element[] = [<MainMenu key="main" path="/" />];
  routes = routes.concat(
    Object.keys(RouteDefinitions).map(item => {
      const { component: PageComponent, route } = RouteDefinitions[
        item as RouteKeys
      ];
      return (
        <RouteContainer
          key={route}
          path={route}
          component={<PageComponent />}
        />
      );
    }),
  );
  return (
    <AppBody>
      <NavBar>
        <div>ff</div>
      </NavBar>
      <AppRouter>{routes}</AppRouter>
    </AppBody>
  );
};

export default App;
