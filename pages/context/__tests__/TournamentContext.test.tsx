import faker from 'faker';
import React from 'react';
import { cleanup, fireEvent, getByTitle, wait } from 'react-testing-library';
import uuid from 'uuid';
import {
  renderWithRouterAndRedux,
  resetLocalStorage,
} from '../../common/router.utils';
import { AppBase } from '../../main/App';

const fakePlayerName1 = faker.name.firstName();
const fakePlayerId1 = uuid();
const fakePlayerName2 = faker.name.firstName();
const fakePlayerId2 = uuid();
const fakeGameId = uuid();
const fakeGameName = faker.company.catchPhrase();

const fakeTournament = {
  players: {
    [fakePlayerId1]: {
      id: fakePlayerId1,
      name: fakePlayerName1,
      losses: 0,
      wins: 0,
    },
    [fakePlayerId2]: {
      id: fakePlayerId2,
      name: fakePlayerName2,
      losses: 0,
      wins: 0,
    },
  },
  tournament: [
    {
      id: fakeGameId,
      name: fakeGameName,
      playerIds: [fakePlayerId1, fakePlayerId2],
      rounds: [],
    },
  ],
};

afterEach(() => {
  cleanup();
  resetLocalStorage();
});

it('TournamentContext: remove tournament', async () => {
  const { findByText, getByText } = renderWithRouterAndRedux(
    <AppBase />,
    undefined,
    fakeTournament
  );
  await wait();

  const gameName = await findByText(
    new RegExp(`${fakeGameName}: \\(2 Players\\)`),
    {}
  );
  const leftClick = { button: 0 };
  const removeButton = getByTitle(gameName.parentElement!, 'Remove Item');
  fireEvent.click(removeButton, leftClick);
  await wait();
  expect(() =>
    getByText(new RegExp(`${fakeGameName}: \\(2 Players\\)`), {})
  ).toThrow();
});
