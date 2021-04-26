export const testGameViewLayout = (cy: Cypress.cy, gameName: string): void => {
  cy.wait(1000); // HACK: This should be removed if possible!
  cy.findByText(new RegExp(`^Game: ${gameName}`));
  cy.findByText('Remove Game');
  cy.findByText('Score Round');
};
