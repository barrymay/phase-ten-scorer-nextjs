import { testPlayerSetupLayout, addPlayers } from './PlayerSetup.common';

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
    const testNames = addPlayers(cy, 4);
    const testName5 = testNames[3] + 'FOO';
    cy.findAllByLabelText(/^Player Name:/).type(testName5);
    cy.findByTitle('Add Player').click();
    cy.findByText(`Player #5: ${testName5} (0-0)`);
  });

  it('remove users', () => {
    const testNames = addPlayers(cy, 2);

    cy.findByText(`Player #2: ${testNames[1]} (0-0)`);

    cy.findAllByTitle('Remove Player').then(removeButtons => {
      removeButtons[1].click();
    });

    cy.findByText(`Player #1: ${testNames[0]} (0-0)`);
    cy.findByText(`Player #2: ${testNames[1]} (0-0)`).should('not.exist');
  });
});
