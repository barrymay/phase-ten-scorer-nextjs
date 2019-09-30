import { testPlayerSetupLayout } from './PlayerSetup.common';
import * as faker from 'faker';

const testName1 = faker.name.firstName();
const testName2 = faker.name.firstName();
const testName3 = faker.name.firstName();
const testName4 = faker.name.firstName();

describe('Player Setup', () => {
  /*
   * Visits the page before each test
   */
  beforeEach(() => {
    cy.log(`Visiting http://localhost:3000`);
    cy.visit('/PlayerSetup');
  });

  it('navigate to Player Setup directly', () => {
    testPlayerSetupLayout(cy);
  });

  it('add users', () => {
    cy.findAllByLabelText(/^Player Name:/).type(testName1);
    cy.findByText(`Player #1: ${testName1} (0-0)`).should('not.exist');
    cy.findByTitle('Add Player').click();

    cy.findAllByLabelText(/^Player Name:/).type(testName2);
    cy.findByTitle('Add Player').click();

    cy.findAllByLabelText(/^Player Name:/).type(testName3);
    cy.findByTitle('Add Player').click();

    cy.findAllByLabelText(/^Player Name:/).type(testName4);
    cy.findByTitle('Add Player').click();

    cy.findByText(`Player #1: ${testName1} (0-0)`);
    cy.findByText(`Player #2: ${testName2} (0-0)`);
    cy.findByText(`Player #3: ${testName3} (0-0)`);
    cy.findByText(`Player #4: ${testName4} (0-0)`);

    // Try repeat entry
    cy.findAllByLabelText(/^Player Name:/).type(testName4);
    cy.findByTitle('Add Player').click();
    cy.findByText(/Player #5: .*/).should('not.exist');

    const testName5 = testName4 + 'FOO';
    cy.findAllByLabelText(/^Player Name:/).type(testName5);
    cy.findByTitle('Add Player').click();
    cy.findByText(`Player #5: ${testName5} (0-0)`);
  });

  it('remove users', () => {
    cy.findAllByLabelText(/^Player Name:/).type(testName1);
    cy.findByTitle('Add Player').click();
    cy.findByText(`Player #1: ${testName1} (0-0)`);

    cy.findAllByLabelText(/^Player Name:/).type(testName2);
    cy.findByTitle('Add Player').click();
    cy.findByText(`Player #2: ${testName2} (0-0)`);

    cy.findAllByTitle('Remove Player').then(removeButtons => {
      removeButtons[1].click();
    });

    cy.findByText(`Player #1: ${testName1} (0-0)`);
    cy.findByText(`Player #2: ${testName2} (0-0)`).should('not.exist');
  });
});
