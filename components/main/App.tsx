/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';
import ProviderWrapper from '../game/ProviderWrapper';
import { MainMenu } from './MainMenu';

const AppBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

const App: React.FC = () => {
  return (
    <ProviderWrapper>
      <AppBase />
    </ProviderWrapper>
  );
};

export const AppBase: React.FC = ({ children }) => {
  return (
    <AppBody>
      <MainMenu />
    </AppBody>
  );
};

export default App;
