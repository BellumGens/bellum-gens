describe('Bellum Gens E2E Tests', () => {
  it('Visits the initial project page', () => {
    cy.visit('/en/')
    cy.contains('Bellum Gens')
    cy.contains('Esports Events')
  })

  it('Renders the English home page', () => {
    cy.visit('/en/')
    cy.get('html').should('have.attr', 'lang', 'en')
    cy.title().should('contain', 'Bellum Gens')
    cy.get('igx-navbar').should('be.visible')
    cy.get('igx-carousel').should('be.visible')
    cy.contains('h2', 'About Bellum Gens').should('be.visible')
  })

  it('Renders the Bulgarian home page', () => {
    cy.visit('/bg/')
    cy.get('html').should('have.attr', 'lang', 'bg')
    cy.contains('h2', 'За Bellum Gens').should('be.visible')
  })

  it('Clicks Learn More about Bellum Gens Elite and navigates to BGE page', () => {
    cy.visit('/en/')
    // Click the "Learn More about Bellum Gens Elite" link/button
    cy.contains('button, a', /Learn More/i).click()
    // Verify the URL changed to the BGE page
    cy.url().should('include', '/bellumgenselite')
    // Verify the page title
    cy.contains('h1', /Bellum Gens Elite/i)
  })

  it('Navigates to /bge-stara-zagora-2026 and verifies inputs are disabled when not logged in', () => {
    cy.visit('/en/bge-stara-zagora-2026')
    // Verify the page rendered
    cy.contains('h1', /Bellum Gens Elite Stara Zagora 2026/i)
    // Verify the email input is disabled
    cy.get('input#email').should('be.disabled')
    // Verify the form shows a message that the signup deadline has passed
    cy.contains(/Signup deadline has passed/i)
  })

  // A first load without a locale in the URL goes to the visitor's language; locale URLs are never redirected.
  describe('Locale detection', () => {
    const redirectOf = (url: string, headers: Record<string, string> = {}) =>
      cy.request({ url, headers, followRedirect: false })

    it('Redirects to the best supported browser language, keeping the path and query', () => {
      redirectOf('/', { 'Accept-Language': 'de-CH,de;q=0.9,en;q=0.8' }).then(response => {
        expect(response.status).to.eq(302)
        expect(response.headers['location']).to.eq('/de/')
        expect(response.headers['vary']).to.include('Accept-Language')
      })
      redirectOf('/shop/terms?ref=mail', { 'Accept-Language': 'ja,nb-NO;q=0.7' }).then(response => {
        expect(response.headers['location']).to.eq('/nb/shop/terms?ref=mail')
      })
      redirectOf('/players', { 'Accept-Language': 'ja,zh;q=0.5' }).then(response => {
        expect(response.headers['location']).to.eq('/en/players')
      })
    })

    it('Prefers the language the visitor picked over the browser language', () => {
      redirectOf('/', { 'Accept-Language': 'fr-FR', 'Cookie': 'locale=pl' }).then(response => {
        expect(response.headers['location']).to.eq('/pl/')
      })
    })

    it('Does not redirect pages under a locale or unprefixed files', () => {
      redirectOf('/fr/', { 'Accept-Language': 'de' }).its('status').should('eq', 200)
      redirectOf('/favicon.ico', { 'Accept-Language': 'de' }).its('status').should('eq', 200)
    })

    it('Renders each new locale', () => {
      cy.visit('/', { headers: { 'Accept-Language': 'ro-RO' } })
      cy.location('pathname').should('eq', '/ro/')
      cy.get('html').should('have.attr', 'lang', 'ro')
    })
  })
})
