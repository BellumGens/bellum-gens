// The eb-league SSR server listens on 4001 (see projects/ebleague/server.ts and scripts/e2e.js).
describe('EB League E2E Tests', { baseUrl: 'http://localhost:4001' }, () => {
  it('Renders the English home page', () => {
    cy.visit('/en/')
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
    cy.visit('/en/')
    cy.contains('a', 'Counter-Strike League').click()
    // /format redirects to /tournaments/format inside the app
    cy.location('pathname').should('include', '/tournaments/format')
    cy.contains('h1', 'EB-League Counter-Strike').should('be.visible')
  })

  // The shop moved to bellumgens.com; the production server answers old links with a permanent redirect.
  it('Redirects shop links to the bellumgens.com shop, keeping the language and query', () => {
    cy.request({ url: '/en/shop/product/eb-league-umbrella?ref=mail', followRedirect: false }).then(response => {
      expect(response.status).to.eq(301)
      expect(response.headers['location']).to.eq('https://bellumgens.com/en/shop/product/eb-league-umbrella?ref=mail')
    })
    cy.request({ url: '/bg/shop/cart', followRedirect: false }).then(response => {
      expect(response.status).to.eq(301)
      expect(response.headers['location']).to.eq('https://bellumgens.com/bg/shop/cart')
    })
    // Without a locale the visitor's language is picked first.
    cy.request({ url: '/shop/cart', headers: { 'Accept-Language': 'sv-SE' }, followRedirect: false }).then(response => {
      expect(response.status).to.eq(302)
      expect(response.headers['location']).to.eq('/sv/shop/cart')
    })
  })

  it('Redirects a first load without a locale to the browser language', () => {
    cy.request({ url: '/', headers: { 'Accept-Language': 'nl-BE,nl;q=0.9' }, followRedirect: false }).then(response => {
      expect(response.status).to.eq(302)
      expect(response.headers['location']).to.eq('/nl/')
    })
  })
})
