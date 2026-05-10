describe('Turvallisuusinfon kuittaamisen pakollisuus', () => {

  // The Continue button must not work if the safety info has not been acknowledged.
  it('passes', () => {
    cy.enterShooters()
    cy.get('.action').contains('Jatka').click()
    cy.get('.action').contains('Jatka').should('be.disabled')
  })
})
