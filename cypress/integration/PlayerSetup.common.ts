import * as faker from 'faker';

export const testPlayerSetupLayout = (cy: Cypress.cy): void => {
  cy.findByText(/^Players: \d*/).should('exist');
  cy.findAllByLabelText(/^Player Name:/).should('exist');
  cy.findByText(/^Players:$/).should('exist');
  cy.findByText(/Clear All/).should('exist');
  cy.findByTitle('Add Player').should('exist');
};

export const addPlayers = (
  cy: Cypress.cy,
  count: number,
): Array<string | null> => {
  let resultArray = new Array(count).fill(null);
  resultArray = resultArray.map(() => {
    return faker.name.firstName();
  });
  resultArray.forEach((name, index) => {
    cy.findAllByLabelText(/^Player Name:/).type(name);
    cy.findByText(`Player #${index + 1}: ${name} (0-0)`).should('not.exist');
    cy.findByTitle('Add Player').click();
  });

  return resultArray;
};
