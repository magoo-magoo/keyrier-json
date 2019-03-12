describe('Table', () => {
  it('should display data as a table', () => {
    cy.visit('/')

    cy.contains('Clear').click()

    cy.get('#sourceAceEditor .ace_text-input')
      .dblclick()
      .type('[{ "myField": "HULK_IS_GREEN", "foo": "superman"', { force: true })
      .type('},{ "myField": "Batman", "foo": "wonder woman"', { force: true })
      .type('}]', { force: true })
      .wait(1000)

    cy.get('#queryAceEditor .ace_text-input')
      .dblclick()
      .type('data', { force: true })
      .wait(1000)

    cy.get('.data-test-id-output-table .data-test-id-column-name').contains('foo')
    cy.get('.data-test-id-output-table .data-test-id-column-name').contains('myField')

    cy.get('.data-test-id-output-table .data-test-id-cell-data').contains('superman')
    cy.get('.data-test-id-output-table .data-test-id-cell-data').contains('HULK_IS_GREEN')
    cy.get('.data-test-id-output-table .data-test-id-cell-data').contains('Batman')
    cy.get('.data-test-id-output-table .data-test-id-cell-data').contains('wonder woman')

    cy.get('#data-test-id-output-table-length').contains('Number of elements: 2')

    cy.screenshot()
  })
  it('should display filtered data in table', () => {
    cy.visit('/')

    cy.contains('Clear').click()

    cy.get('#sourceAceEditor .ace_text-input')
      .dblclick()
      .type('[{ "myField": "HULK_IS_GREEN", "foo": "superman"', { force: true })
      .type('},{ "myField": "Batman", "foo": "wonder woman"', { force: true })
      .type('}]', { force: true })
      .wait(1000)

    cy.get('#queryAceEditor .ace_text-input')
      .dblclick()
      .type('data.filter(x => x.foo !== "superman")', { force: true })
      .wait(1000)

    cy.get('.data-test-id-output-table .data-test-id-column-name').contains('foo')
    cy.get('.data-test-id-output-table .data-test-id-column-name').contains('myField')

    cy.get('.data-test-id-output-table .data-test-id-cell-data').contains('wonder woman')
    cy.get('.data-test-id-output-table .data-test-id-cell-data').contains('Batman')

    cy.get('#data-test-id-output-table-length').contains('Number of elements: 1')

    cy.screenshot()
  })
})
