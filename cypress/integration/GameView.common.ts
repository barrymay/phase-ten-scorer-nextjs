export const testGameViewLayout = (cy: Cypress.cy, gameName: string) => {
  cy.wait(4000); // HACK: This should be removed if possible!
  cy.findByText(new RegExp(`^Game: ${gameName}`));
  cy.findByText('Remove Game');
  cy.findByText('Score Round');
};
