describe('Bellum Gens E2E Tests', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Bellum Gens')
    cy.contains('Esports Events')
  })

  it('Clicks Learn More about Bellum Gens Elite and navigates to BGE page', () => {
    cy.visit('/')
    // Click the "Learn More about Bellum Gens Elite" link/button
    cy.contains('button, a', /Learn More/i).click()
    // Verify the URL changed to the BGE page
    cy.url().should('include', '/bellumgenselite')
    // Verify the page title
    cy.contains('h1', /Bellum Gens Elite/i)
  })

  it('Navigates to /bge-stara-zagora-2026 and verifies inputs are disabled when not logged in', () => {
    cy.visit('/bge-stara-zagora-2026')
    // Verify the page rendered
    cy.contains('h1', /Bellum Gens Elite Stara Zagora 2026/i)
    // Verify the email input is disabled
    cy.get('input#email').should('be.disabled')
    // Verify the form shows a message that user needs to be logged in
    cy.contains(/You need to be logged in/i)
  })
})
