describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Bellum Gens')
    cy.contains('Esports Events')
  })
})
