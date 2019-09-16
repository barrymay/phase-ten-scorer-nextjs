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
    // @ts-ignore
    cy.findByText('Player Setup').should('exist');
    // @ts-ignore

    cy.findByText('Create a Tournament').should('exist');
    // @ts-ignore

    cy.findByText('No Tournaments Created').should('exist');
    // eslint-disable-next-line no-console
    // @ts-ignore

    cy.findAllByText('Phase 10 Scorer').should('exist');
  });
});
