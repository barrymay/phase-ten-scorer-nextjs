export const testPlayerSetupLayout = (cy: Cypress.cy) => {
  cy.findByText(/^Players: \d*/).should('exist');
  cy.findAllByLabelText(/^Player Name:/).should('exist');
  cy.findByText(/^Players:$/).should('exist');
  cy.findByText(/Clear All/).should('exist');
  cy.findByTitle('Add Player').should('exist');
};
