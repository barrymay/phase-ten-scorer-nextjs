describe('Index page', () => {
  /*
   * Visits the page before each test
   */
  beforeEach(() => {
    cy.log(`Visiting http://localhost:3000`);
    cy.visit('/');
  });

  /**
   * Header section
   */
  it('should have a logo', () => {
    cy.getByText('Player Setup').should('exist');
    cy.getByText('Player Setup').should('exist');
    cy.getByText('Create a Tournament').should('exist');
    cy.getByText('No Tournaments Created').should('exist');
    cy.getAllByText('Phase 10 Scorer').should('exist');

    cy.getByText('Create a Tournament').click();

    cy.getByText('Tournament Manager').should('exist');
    cy.getByText('Tournament Name:').should('exist');
    cy.getByText('Selected Players:').should('exist');
  });
});
