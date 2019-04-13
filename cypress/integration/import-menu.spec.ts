/// <reference types="cypress"/>
/// <reference types="../support"/>

Cypress.on('window:before:load', win => {
  delete win.fetch
  win.fetch = require('unfetch')
})

describe('Import menu', () => {
  it('should import JSON file', () => {
    cy.visit('/')
      .get('#import-menu-button')
      .click()
      .uploadFile('#import-file [type="file"]', 'import-menu/countries.json', 'application/json')

    cy.get('#sourceAceEditor').contains('"country": "Afghanistan"')
    cy.get('#sourceAceEditor').contains('"population": "22720000"')
  })

  it('should import data from http request', () => {
    // const url = 'http://fake-api/test-http-request/'
    const url = '/test-http-request'
    cy.server()
      .route(url, {})
      .as('cars')

    cy.visit('/')
      .get('#import-menu-button')
      .click()
      .get('#http-request')
      .click()
      .get('#requestMethod')
      .select('POST')
      .get('#requestUrl')
      .clear()
      .type(url)

    cy.get('#HttpRequestSource')
      .contains('Submit')
      .click()
  })
})
