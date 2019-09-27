import { testPlayerSetupLayout } from './PlayerSetup.common';

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

    cy.findByText('Tournament Manager').should('exist');
    cy.findByText('Tournament Name:').should('exist');
    cy.findByText('Selected Players:').should('exist');
  });

  it('navigate to Player Setup', () => {
    verifyMainMenu();

    cy.findByText('Player Setup').click();

    testPlayerSetupLayout(cy);
  });
});
