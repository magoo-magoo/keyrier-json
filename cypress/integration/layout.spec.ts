describe('Style and layout', () => {
  it('should be have a dark theme', () => {
    cy.visit('/')
    cy.contains('Theme').click()
    cy.contains('darkly').click()
    cy.screenshot()
  })

  it('successfully loads', () => {
    cy.visit('/')
    cy.screenshot()
  })
})
