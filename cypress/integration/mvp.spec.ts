/// <reference types="cypress"/>

describe('Minimum valuable product', () => {
  it('should be a simple JSON object', () => {
    cy.visit('/')

    cy.contains('Clear').click()

    cy.get('#sourceAceEditor .ace_text-input')
      .dblclick()
      .type('{ "myField": "HULK_IS_GREEN", "foo": "superman"', { force: true })
      .type('}', { force: true })
      .wait(1000)

    cy.get('#queryAceEditor .ace_text-input')
      .dblclick()
      .type('data', { force: true })
      .wait(1000)

    cy.get('#badgeSize').contains('44 B')

    cy.get('#jsonView').contains('myField')
    cy.get('#jsonView').contains('foo')
    cy.get('#jsonView').contains('HULK_IS_GREEN')
    cy.get('#jsonView').contains('superman')

    cy.screenshot()
  })
})
