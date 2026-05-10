/// <reference types="cypress" />

export {}

Cypress.Commands.add("enterShooter", (name: string) => {
    cy.get('input[id="new-name"]').type(name).type('{enter}')
});

Cypress.Commands.add("enterShooters", () => {
    cy.visit('/')
    cy.enterShooter("Kaarlo Kaskela")
    cy.enterShooter("Helena Himanen")
    cy.enterShooter("Timo Nieminen")
    cy.enterShooter("Gisella Glock")
});

Cypress.Commands.add("initTest", () => {
    cy.enterShooters()
    cy.get('.action').contains('Jatka').click()
    cy.get('input[id="safety-acknowledgment"]').click()
    cy.get('.action').contains('Jatka').click()
    cy.get('.action').contains('Aloita ampumakoe').click()
});

function randomTime(guideTime: number, guideTimeMaxOverrun: number) {
    const value = String(Math.round(100*(guideTime + guideTimeMaxOverrun*Math.random()))).replace(/0/g,'1')
    return value[0] + '{moveToEnd}' + value.substring(1)
}

Cypress.Commands.add("time1", (guideTime: number, maxOverrun: number) => {
    cy.get('input[id="time1"]').type(randomTime(guideTime, maxOverrun))
});
Cypress.Commands.add("time2", (guideTime: number, maxOverrun: number) => {
    cy.get('input[id="time2"]').type(randomTime(guideTime, maxOverrun))
});
Cypress.Commands.add("time3", (guideTime: number, maxOverrun: number) => {
    cy.get('input[id="time3"]').type(randomTime(guideTime, maxOverrun))
});

// 60 % Alpha
// 20 % Charlie
// 15 % Delta
//  5 % Mike
function randomHit() {
    const r = Math.random()
    if (r > .4) {
        return 'A'
    } else if (r > .2) {
        return 'C'
    } else if (r > .05) {
        return 'D'
    } else {
        return 'Ohi'
    }
}

Cypress.Commands.add("shoot", (target: number, shots: number) => {
    for (let shot of Array(shots))
        cy.get('button[id=T' + target + randomHit() + 'plus]').click()
});
