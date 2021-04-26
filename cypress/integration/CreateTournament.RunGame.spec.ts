import * as faker from 'faker';
import { testGameViewLayout } from './GameView.common';
import { addPlayers } from './PlayerSetup.common';

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

describe('Create Tournament - Run Game', () => {
  /*
   * Visits the page before each test
   */
  beforeEach(() => {
    cy.log(`Visiting http://localhost:3000`);
    cy.visit('/CreateTournament');
  });

  it('Normal expected process', () => {
    cy.visit('/PlayerSetup');

    const testNames = addPlayers(cy, 8);
    const gameName = faker.hacker.noun().slice(0, 20);

    cy.visit('/CreateTournament');

    cy.findByLabelText('Tournament Name:').type(gameName);
    cy.findByText('Submit').click();

    cy.findByText('At least one player must be selected');

    const players = [testNames[0], testNames[1], testNames[6]];
    players.forEach((item) => {
      cy.findByText(`${item} (0-0)`).click();
    });

    cy.findByText('Submit').click();

    testGameViewLayout(cy, gameName);

    cy.findByText('Score Round').click();
    cy.wait(500);

    players.forEach((item, index) => {
      cy.findByTestId(`playerForm-${item}`).within(() => {
        cy.findByLabelText('Score:').type('123');
        cy.findByTestId(`phaseButton-1`).click();
        cy.wait(100);
        cy.findByTestId(`phaseButton-4`).click();
        cy.wait(100);
        cy.findByTestId(`phaseButton-1`).click();
        cy.wait(100);
      });
      cy.findByText(index < players.length - 1 ? `Next` : 'Done').click();
      cy.wait(250);
    });
  });
});
