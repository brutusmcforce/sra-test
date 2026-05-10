describe('Rasti 3', () => {

  it('passes', () => {

    cy.initTest()

    cy.get('.stage').contains('Rasti 3').click()

     for(let shooter of Array(4)) {
      cy.time1(12, 10)
      cy.shoot(0, 4)
      cy.shoot(1, 2)
      cy.get('.action').contains('Seuraava ampuja').click()
    }
  })
})
