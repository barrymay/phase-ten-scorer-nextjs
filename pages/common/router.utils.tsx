import {
  createHistory,
  createMemorySource,
  LocationProvider,
  History,
} from '@reach/router';
import React from 'react';
import { render, RenderResult } from 'react-testing-library';
import ProviderWrapper, {
  IProviderWrapperState,
} from '../game/ProviderWrapper';

export function resetLocalStorage() {
  localStorage.setItem('player_storage_2', JSON.stringify({}));

  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
}

export interface IRenderResult extends RenderResult {
  history: History;
}

export const createElementWithId = (id: string): HTMLDivElement => {
  const newElement = document.createElement('div');
  newElement.id = id;
  return newElement;
};

// this is a handy function that I would utilize for any component
// that relies on the router being in context
export function renderWithRouterAndRedux(
  ui: React.ReactNode,
  { route = '/', history = createHistory(createMemorySource(route)) } = {},
  testState?: IProviderWrapperState,
  containerDivs: string[] = ['app-root', 'modal-root']
): IRenderResult {
  const base = containerDivs.reduce<HTMLElement>((result, next) => {
    result.appendChild(createElementWithId(next));
    return result;
  }, document.body);
  return {
    ...render(
      <LocationProvider history={history}>
        <ProviderWrapper testValue={testState}>{ui}</ProviderWrapper>
      </LocationProvider>,
      {
        container: base.querySelector('#app-root') as HTMLElement,
        baseElement: base,
      }
    ),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
}
