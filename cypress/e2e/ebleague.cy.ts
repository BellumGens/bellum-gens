// The eb-league SSR server listens on 4001 (see projects/ebleague/server.ts and scripts/e2e.js).
describe('EB League E2E Tests', { baseUrl: 'http://localhost:4001' }, () => {
  it('Renders the English home page', () => {
    cy.visit('/')
    cy.get('html').should('have.attr', 'lang', 'en')
    cy.title().should('eq', 'Esports Business League')
    cy.get('igx-navbar').should('be.visible')
    cy.contains('h1', 'The Ultimate Gaming experience for your company').should('be.visible')
    cy.contains('h3', 'Counter-Strike League')
    cy.contains('h3', 'StarCraft II League')
  })

  it('Renders the Bulgarian home page', () => {
    cy.visit('/bg/')
    cy.get('html').should('have.attr', 'lang', 'bg')
    cy.contains('h1', 'Най-доброто гейминг изживяване за вашата компания').should('be.visible')
  })

  it('Navigates from the home page to the tournament format page', () => {
    cy.visit('/')
    cy.contains('a', 'Counter-Strike League').click()
    // /format redirects to /tournaments/format inside the app
    cy.location('pathname').should('include', '/tournaments/format')
    cy.contains('h1', 'EB-League Counter-Strike').should('be.visible')
  })
})
