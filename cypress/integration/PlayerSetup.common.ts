import * as faker from 'faker';

export const testPlayerSetupLayout = (cy: Cypress.cy) => {
  cy.findByText(/^Players: \d*/).should('exist');
  cy.findAllByLabelText(/^Player Name:/).should('exist');
  cy.findByText(/^Players:$/).should('exist');
  cy.findByText(/Clear All/).should('exist');
  cy.findByTitle('Add Player').should('exist');
};

export const addPlayers = (cy: Cypress.cy, count: number) => {
  let resultArray = new Array(count).fill(null);
  resultArray = resultArray.map(item => {
    return faker.name.firstName();
  });
  resultArray.forEach((name, index) => {
    cy.findAllByLabelText(/^Player Name:/).type(name);
    cy.findByText(`Player #${index + 1}: ${name} (0-0)`).should('not.exist');
    cy.findByTitle('Add Player').click();
  });

  return resultArray;
  // cy.findAllByLabelText(/^Player Name:/).type(testName2);
  // cy.findByTitle('Add Player').click();

  // cy.findAllByLabelText(/^Player Name:/).type(testName3);
  // cy.findByTitle('Add Player').click();

  // cy.findAllByLabelText(/^Player Name:/).type(testName4);
  // cy.findByTitle('Add Player').click();

  // cy.findByText(`Player #1: ${testName1} (0-0)`);
  // cy.findByText(`Player #2: ${testName2} (0-0)`);
  // cy.findByText(`Player #3: ${testName3} (0-0)`);
  // cy.findByText(`Player #4: ${testName4} (0-0)`);
};
