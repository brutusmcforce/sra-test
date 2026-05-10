describe('Rasti 5', () => {

  it('passes', () => {

    cy.initTest()

    cy.get('.stage').contains('Rasti 5').click()

    for(let shooter of Array(4)) {
      cy.time1(12, 12)
      cy.shoot(0, 4)
      cy.shoot(1, 4)
      cy.get('.action').contains('Seuraava ampuja').click()
    }

  })
})
