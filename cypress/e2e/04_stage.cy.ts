describe('Rasti 4', () => {

  it('passes', () => {

    cy.initTest()

    cy.get('.stage').contains('Rasti 4').click()

    for(let shooter of Array(4)) {
      cy.time1(22, 10)
      cy.shoot(0, 6)
      cy.shoot(1, 6)
      cy.get('.action').contains('Seuraava ampuja').click()
    }
  })
})
