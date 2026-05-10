describe('SRA ampumakoe', () => {

  it('passes', () => {

    cy.initTest()

    // Stage 1
    for(let shooter of Array(4)) {
      cy.time1(6, 7)
      cy.time2(6, 7)
      cy.time3(6, 7)
      cy.shoot(0, 6)
      cy.shoot(1, 6)
      cy.get('.action').contains('Seuraava ampuja').click()
    }

    // Stage 2
    for(let shooter of Array(4)) {
      cy.time1(6, 7)
      cy.time2(6, 7)
      cy.time3(6, 7)
      cy.shoot(0, 6)
      cy.shoot(1, 6)
      cy.get('.action').contains('Seuraava ampuja').click()
    }

    // Stage 3
    for(let shooter of Array(4)) {
      cy.time1(12, 10)
      cy.shoot(0, 4)
      cy.shoot(1, 2)
      cy.get('.action').contains('Seuraava ampuja').click()
    }

    // Stage 4
    for(let shooter of Array(4)) {
      cy.time1(22, 10)
      cy.shoot(0, 6)
      cy.shoot(1, 6)
      cy.get('.action').contains('Seuraava ampuja').click()
    }

    // Stage 5
    for(let shooter of Array(4)) {
      cy.time1(12, 12)
      cy.shoot(0, 4)
      cy.shoot(1, 4)
      cy.get('.action').contains('Seuraava ampuja').click()
    }

  })
})
