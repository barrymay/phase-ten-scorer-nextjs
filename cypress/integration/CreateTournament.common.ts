export const testCreateTournamentLayout = (cy: Cypress.cy) => {
  cy.findByText('Tournament Manager').should('exist');
  cy.findByText('Tournament Name:').should('exist');
  cy.findByText('Selected Players:').should('exist');
};
