import * as faker from 'faker';
import { testCreateTournamentLayout } from './CreateTournament.common';
import { testGameViewLayout } from './GameView.common';
import { addPlayers } from './PlayerSetup.common';

const testName1 = faker.name.firstName();
const testName2 = faker.name.firstName();
const testName3 = faker.name.firstName();
const testName4 = faker.name.firstName();

describe('Create Tournament', () => {
  /*
   * Visits the page before each test
   */
  beforeEach(() => {
    cy.log(`Visiting http://localhost:3000`);
    cy.visit('/CreateTournament');
  });

  it('navigate to Create Tournament directly', () => {
    testCreateTournamentLayout(cy);
  });

  it('Expect Error if No text is applied and/or too long', () => {
    cy.findByText('Submit').click();

    cy.findByText('Tournament Name is required');
    cy.findByText('Submit').click();

    cy.findByText('Tournament Name is required');

    const longGameName = faker.random.alphaNumeric(22);

    cy.findByLabelText('Tournament Name:').type(longGameName);
    cy.findByText('Submit').click();

    cy.findByText('Tournament Name is required').should('not.exist');
    cy.findByText('Tournament Name must be less than 20 characters');
  });

  it('Expect Error if No text is applied and players applied', () => {
    cy.visit('/PlayerSetup');

    const testNames = addPlayers(cy, 4);

    cy.visit('/CreateTournament');
    cy.findByText('Submit').click();

    cy.findByText('Tournament Name is required');
  });

  it('Expect Error if Creating Tournament with no players', () => {
    cy.findByLabelText('Tournament Name:').type('First Game');
    cy.findByText('Submit').click();

    cy.findByText('At least one player must be selected');
  });

  it('Normal expected process', () => {
    cy.visit('/PlayerSetup');

    const testNames = addPlayers(cy, 8);
    const gameName = faker.hacker.noun().slice(0, 20);

    cy.visit('/CreateTournament');

    cy.findByLabelText('Tournament Name:').type(gameName);
    cy.findByText('Submit').click();

    cy.findByText('At least one player must be selected');

    cy.findByText(`${testNames[0]} (0-0)`).click();
    cy.findByText(`${testNames[4]} (0-0)`).click();

    cy.findByText('Submit').click();

    testGameViewLayout(cy, gameName);
  });
});
