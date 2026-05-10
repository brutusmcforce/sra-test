describe('Rasti 2', () => {

  it('passes', () => {

    cy.initTest()

    cy.get('.stage').contains('Rasti 2').click()

    for(let shooter of Array(4)) {
      cy.time1(6, 7)
      cy.time2(6, 7)
      cy.time3(6, 7)
      cy.shoot(0, 6)
      cy.shoot(1, 6)
      cy.get('.action').contains('Seuraava ampuja').click()
    }
  })
})
