export const testGameViewLayout = (cy: Cypress.cy, gameName: string) => {
  cy.findByText(new RegExp(`^Game: ${gameName}`));
  cy.findByText('Remove Game');
  cy.findByText('Score Round');
};
