import { testPlayerSetupLayout } from './PlayerSetup.common';
import { testCreateTournamentLayout } from './CreateTournament.common';

describe('Main Menu Layout', () => {
  /*
   * Visits the page before each test
   */
  beforeEach(() => {
    cy.log(`Visiting http://localhost:3000`);
    cy.visit('/');
  });

  const verifyMainMenu = () => {
    cy.findByText('Player Setup').should('exist');
    cy.findByText('Player Setup').should('exist');
    cy.findByText('Create a Tournament').should('exist');
    cy.findByText('No Tournaments Created').should('exist');
    cy.findAllByText('Phase 10 Scorer').should('exist');
  };

  it('navigate to Tournament Manager', () => {
    verifyMainMenu();

    cy.findByText('Create a Tournament').click();

    testCreateTournamentLayout(cy);
  });

  it('navigate to Player Setup', () => {
    verifyMainMenu();

    cy.findByText('Player Setup').click();

    //testPlayerSetupLayout(cy);
  });
});
