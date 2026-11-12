import {
  CART_STORAGE_KEY,
  EN,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  cartItem,
  customer,
  disableServiceWorker,
  fillCheckoutForm,
  jersey,
  orderView,
  pen,
  shopApi,
  stubShopApi,
  umbrella,
  visitWithCart
} from '../support/shop';

/**
 * The bellumgens.com shop: catalog, product page, cart, checkout and order status.
 *
 * Every shop API call is answered by the fake API in cypress/support/shop.ts. The catalog and product pages are
 * rendered on the server, which fetches from the real API and hands the result to the browser, so the tests that
 * need stubbed products enter the shop through a page rendered in the browser (the cart) and navigate from there.
 */
describe('Shop E2E Tests', () => {
  beforeEach(() => {
    disableServiceWorker();
    stubShopApi();
  });

  const savedCart = (win: Window) => JSON.parse(win.localStorage.getItem(CART_STORAGE_KEY) ?? 'null');
  /** Matches an English shop page's path. The server redirects a prerendered page to its folder, with a trailing slash. */
  const shopPath = (path: string) => new RegExp(`^${EN}${path}/?$`);

  describe('Server rendering', () => {
    it('Renders the catalog on the server in both languages', () => {
      cy.request(`${EN}/shop`).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body).to.contain('<bg-product-list');
        expect(response.body).to.contain('Merchandise');
      });
      cy.request('/bg/shop').its('body').should('contain', 'Мърчандайз');
    });

    it('Renders the terms of sale', () => {
      cy.visit(`${EN}/shop/terms`);
      cy.contains('h2', 'Terms of sale').should('be.visible');
    });

    it('Renders the Bulgarian cart', () => {
      cy.visit('/bg/shop/cart');
      cy.get('html').should('have.attr', 'lang', 'bg');
      cy.contains('h2', 'Вашата кошница').should('be.visible');
    });
  });

  describe('Catalog', () => {
    beforeEach(() => {
      cy.visit(`${EN}/shop/cart`);
      cy.contains('Your cart is empty.').should('be.visible');
      cy.contains('a', 'Browse the shop').click();
      cy.wait('@products');
      cy.location('pathname').should('match', shopPath('/shop'));
    });

    it('Lists the products with their prices and availability', () => {
      cy.get('bg-product-card').should('have.length', 3);

      cy.contains('bg-product-card', umbrella.name).within(() => {
        cy.contains('Esports Business League');
        cy.get('del').should('have.text', '€20.00');
        cy.get('.highlight').should('have.text', '€18.00');
        cy.contains('button', 'Add to cart').should('be.enabled');
      });

      cy.contains('bg-product-card', pen.name).within(() => {
        cy.contains('igx-chip', 'Sold out');
        cy.contains('button', 'Add to cart').should('be.disabled');
      });

      // A product with options is added from its own page.
      cy.contains('bg-product-card', jersey.name).within(() => {
        cy.get('.highlight').should('have.text', '€50.00');
        cy.contains('button', 'Add to cart').should('not.exist');
        cy.contains('a', 'View').should('be.visible');
      });
    });

    it('Filters the products by brand and by type', () => {
      cy.contains('igx-chip', 'Esports Business League').click();
      cy.get('bg-product-card').should('have.length', 1).and('contain', umbrella.name);

      cy.contains('igx-chip', 'All brands').click();
      cy.get('bg-product-card').should('have.length', 3);

      cy.contains('igx-chip', 'Jersey').click();
      cy.get('bg-product-card').should('have.length', 1).and('contain', jersey.name);

      cy.contains('igx-chip', 'Bellum Gens').click();
      cy.contains('igx-chip', 'Pen').click();
      cy.get('bg-product-card').should('not.exist');
      cy.contains('Nothing matches this filter yet.').should('be.visible');
    });

    it('Adds a product without options straight from the catalog', () => {
      cy.get('bg-cart-badge igx-badge').should('not.exist');

      cy.contains('bg-product-card', umbrella.name).contains('button', 'Add to cart').click();

      cy.contains('igx-snackbar', `${umbrella.name} added to your cart`).should('be.visible');
      cy.get('bg-cart-badge igx-badge').should('contain', '1');

      cy.get('bg-cart-badge a').click();
      cy.location('pathname').should('match', shopPath('/shop/cart'));
      cy.wait('@quote').its('request.body.lines').should('deep.equal', [{ productId: umbrella.id, quantity: 1 }]);
      cy.contains('li.cart-line', umbrella.name).should('contain', '€18.00');
    });
  });

  describe('Product page', () => {
    beforeEach(() => {
      cy.visit(`${EN}/shop/cart`);
      cy.contains('a', 'Browse the shop').click();
      cy.wait('@products');
      cy.contains('bg-product-card', jersey.name).contains('a', 'View').click();
      cy.wait('@product').its('request.url').should('match', new RegExp(`/${jersey.slug}$`));
    });

    it('Picks the options of a jersey and adds it to the cart', () => {
      cy.location('pathname').should('match', shopPath(`/shop/product/${jersey.slug}`));
      cy.title().should('eq', `${jersey.name} | Bellum Gens Shop`);
      cy.contains('h2', jersey.name).should('be.visible');
      cy.contains(jersey.description!).should('be.visible');

      // The first cut and the first size of it are picked to begin with.
      cy.contains('igx-select', 'Cut').find('input').should('have.value', 'Male');

      // Sold out sizes are listed but cannot be picked.
      cy.contains('igx-select', 'Size').find('input').click();
      cy.contains('igx-select-item', '(sold out)')
        .should('contain', 'L')
        .and('have.attr', 'aria-disabled', 'true');
      cy.contains('igx-select-item', /^\s*M\s*$/).click();

      // Switching the cut offers its own sizes and shows how few are left.
      cy.contains('igx-select', 'Cut').find('input').click();
      cy.contains('igx-select-item', 'Female').click();
      cy.contains('igx-select', 'Cut').find('input').should('have.value', 'Female');
      cy.contains('Only 3 left in stock').should('be.visible');

      // The quantity stops at the stock that is left.
      cy.get('.purchase-row button[title="Increase quantity"]').click().click();
      cy.get('.purchase-row .quantity-value').should('have.text', '3');
      cy.get('.purchase-row button[title="Increase quantity"]').should('be.disabled');

      cy.contains('button', 'Add to cart').click();
      cy.contains('igx-snackbar', `${jersey.name} (Female / S) added to your cart`).should('be.visible');
      cy.get('bg-cart-badge igx-badge').should('contain', '3');

      cy.contains('a', 'Go to cart').click();
      cy.wait('@quote').its('request.body.lines').should('deep.equal', [{ productId: jersey.id, variantId: 'v-female-s', quantity: 3 }]);
      cy.contains('li.cart-line', jersey.name).within(() => {
        cy.contains('Female / S');
        cy.get('.quantity-value').should('have.text', '3');
        cy.get('.line-total').should('have.text', '€150.00');
      });
      cy.get('dd.grand-total').should('have.text', '€150.00');
    });

    it('Goes back to the catalog', () => {
      cy.contains('a', 'All products').click();
      cy.location('pathname').should('match', shopPath('/shop'));
      cy.get('bg-product-card').should('have.length', 3);
    });
  });

  describe('Cart', () => {
    it('Re-prices the cart as it changes', () => {
      visitWithCart(`${EN}/shop/cart`, [cartItem(umbrella, 2), cartItem(jersey, 1, 'v-male-m')]);
      cy.wait('@quote').its('request.body').should('deep.equal', {
        lines: [{ productId: umbrella.id, quantity: 2 }, { productId: jersey.id, variantId: 'v-male-m', quantity: 1 }],
        promoCode: null,
        deliveryMethod: 0
      });
      cy.get('bg-cart-badge igx-badge').should('contain', '3');
      cy.get('dl.totals').should('contain', '€86.00').and('contain', 'Free');
      cy.get('dd.grand-total').should('have.text', '€86.00');

      cy.contains('li.cart-line', umbrella.name).find('button[title="Increase quantity"]').click();
      cy.wait('@quote').its('request.body.lines.0.quantity').should('eq', 3);
      cy.contains('li.cart-line', umbrella.name).find('.line-total').should('have.text', '€54.00');
      cy.get('dd.grand-total').should('have.text', '€104.00');

      // Below the free shipping threshold the delivery is charged.
      cy.contains('li.cart-line', jersey.name).find('button[title="Remove from cart"]').click();
      cy.wait('@quote').its('request.body.lines').should('have.length', 1);
      cy.get('li.cart-line').should('have.length', 1);
      cy.get('dl.totals').should('contain', '€5.00');
      cy.get('dd.grand-total').should('have.text', '€59.00');

      cy.contains('li.cart-line', umbrella.name).find('button[title="Decrease quantity"]').click();
      cy.wait('@quote').its('request.body.lines.0.quantity').should('eq', 2);
      cy.get('dd.grand-total').should('have.text', '€41.00');

      cy.contains('li.cart-line', umbrella.name).find('button[title="Remove from cart"]').click();
      cy.contains('Your cart is empty.').should('be.visible');
      cy.get('bg-cart-badge igx-badge').should('not.exist');
      cy.window().then(win => expect(savedCart(win)).to.be.null);
    });

    it('Applies a promo code and blocks checkout on one that does not apply', () => {
      visitWithCart(`${EN}/shop/cart`, [cartItem(umbrella, 3)]);
      cy.wait('@quote');
      cy.get('dd.grand-total').should('have.text', '€59.00');
      cy.get('a.checkout-button').should('have.attr', 'aria-disabled', 'false');

      cy.get('input#promoCode').type('save10{enter}');
      cy.wait('@quote').its('request.body.promoCode').should('eq', 'SAVE10');
      cy.contains('igx-hint', 'Promo code applied').should('be.visible');
      cy.get('dl.totals').should('contain', 'Discount').and('contain', '-€5.40');
      cy.get('dd.grand-total').should('have.text', '€53.60');
      cy.window().then(win => expect(savedCart(win).promoCode).to.eq('SAVE10'));

      cy.get('button[aria-label="Clear promo code"]').click();
      cy.wait('@quote').its('request.body.promoCode').should('be.null');
      cy.get('input#promoCode').should('have.value', '').type('bogus{enter}');
      cy.wait('@quote').its('request.body.promoCode').should('eq', 'BOGUS');
      cy.contains('igx-hint', 'This promo code is not valid.').should('be.visible');
      cy.contains('The promo code does not apply. Remove it to continue to checkout.').should('be.visible');
      cy.get('a.checkout-button').should('have.attr', 'aria-disabled', 'true');

      cy.get('button[aria-label="Clear promo code"]').click();
      cy.wait('@quote');
      cy.get('a.checkout-button').should('have.attr', 'aria-disabled', 'false').click();
      cy.location('pathname').should('match', shopPath('/shop/checkout'));
    });

    it('Flags lines that are no longer available in the quantity asked for', () => {
      visitWithCart(`${EN}/shop/cart`, [cartItem(jersey, 5, 'v-female-s')]);
      cy.wait('@quote');
      cy.contains('li.cart-line', jersey.name).find('.line-problem').should('have.text', 'Only 3 left in stock.');
      cy.contains('Some items in your cart are no longer available in the selected quantity.').should('be.visible');
      cy.get('a.checkout-button').should('have.attr', 'aria-disabled', 'true');

      cy.contains('li.cart-line', jersey.name).find('button[title="Decrease quantity"]').click().click();
      cy.contains('li.cart-line', jersey.name).find('.quantity-value').should('have.text', '3');
      cy.wait('@quote').its('request.body.lines.0.quantity').should('eq', 3);
      cy.get('.line-problem').should('not.exist');
      cy.get('a.checkout-button').should('have.attr', 'aria-disabled', 'false');
    });

    it('Offers to try again when the cart cannot be priced', () => {
      // Answered before the fake API's handler, which takes over once this one stops replying.
      let failures = 1;
      cy.intercept({ method: 'POST', url: shopApi.quote }, req => {
        if (failures > 0) {
          failures--;
          req.reply({ statusCode: 500, body: 'Server error' });
        }
      });

      visitWithCart(`${EN}/shop/cart`, [cartItem(umbrella, 1)]);
      cy.contains('We could not calculate the price of your cart. Please try again.').should('be.visible');
      cy.get('a.checkout-button').should('have.attr', 'aria-disabled', 'true');

      cy.contains('button', 'Try again').click();
      cy.get('dd.grand-total').should('have.text', '€23.00');
      cy.get('a.checkout-button').should('have.attr', 'aria-disabled', 'false');
    });
  });

  describe('Checkout', () => {
    const lines = [{ productId: umbrella.id, quantity: 1 }, { productId: jersey.id, variantId: 'v-male-m', quantity: 1 }];
    const created = (orderId: string, checkoutUrl: string | null) => ({
      orderId,
      orderNumber: 'BG-1001',
      total: 68,
      currency: 'EUR',
      checkoutUrl,
      paymentToken: null,
      expiresOn: '2026-11-09T11:00:00Z'
    });

    beforeEach(() => {
      visitWithCart(`${EN}/shop/checkout`, [cartItem(umbrella, 1), cartItem(jersey, 1, 'v-male-m')]);
      cy.wait('@quote');
      cy.get('.order-summary').within(() => {
        cy.contains('li', umbrella.name).should('contain', '1 ×').and('contain', '€18.00');
        cy.contains('li', jersey.name).should('contain', '(Male / M)').and('contain', '€50.00');
        cy.get('dd.grand-total').should('have.text', '€68.00');
      });
    });

    it('Asks for the missing details before placing the order', () => {
      cy.intercept({ method: 'POST', url: shopApi.orders }, { statusCode: 500 }).as('createOrder');

      cy.get('button.pay-button').should('contain', 'Pay €68.00 with Revolut').and('be.enabled').click();

      for (const hint of [
        'First name is required',
        'Last name is required',
        'A valid email is required for your receipt',
        'A phone number is required for the courier',
        'City is required',
        'Street address is required'
      ]) {
        cy.contains('igx-hint', hint).should('be.visible');
      }
      cy.contains('Please accept the terms of sale to continue').should('be.visible');

      cy.get('input#email').type('not-an-email');
      cy.contains('igx-hint', 'A valid email is required for your receipt').should('be.visible');
      cy.get('input#email').clear().type(customer.email);
      cy.contains('igx-hint', 'A valid email is required for your receipt').should('not.exist');

      cy.get('@createOrder.all').should('have.length', 0);
      cy.location('pathname').should('match', shopPath('/shop/checkout'));
    });

    it('Places a cash on delivery order', () => {
      cy.intercept({ method: 'POST', url: shopApi.orders }, { body: created('order-cod', null) }).as('createOrder');
      cy.intercept({ method: 'GET', url: shopApi.order }, {
        body: orderView('order-cod', OrderStatus.Confirmed, lines, { paymentMethod: PaymentMethod.CashOnDelivery })
      }).as('order');

      fillCheckoutForm();
      cy.contains('igx-radio', 'Cash on delivery').click();
      cy.contains('You pay the courier when your order arrives.').should('be.visible');
      cy.get('button.pay-button').should('contain', 'Place order for €68.00').click();

      cy.wait('@createOrder').its('request.body').should(body => {
        expect(body).to.deep.include({
          lines,
          promoCode: null,
          deliveryMethod: 0,
          paymentMethod: PaymentMethod.CashOnDelivery,
          ...customer,
          customerNote: '',
          acceptedTerms: true,
          country: 'BG',
          language: 'en',
          replacesOrderId: null
        });
      });

      cy.wait('@order');
      cy.location('pathname').should('match', shopPath('/shop/order/order-cod'));
      cy.contains('.order-number', 'Order BG-1001').should('be.visible');
      cy.contains('h2', 'Confirmed').should('be.visible');
      cy.contains(`Thank you! Your order was received and a confirmation was sent to ${customer.email}.`).should('be.visible');
      cy.contains('You will pay €68.00 to the courier on delivery.').should('be.visible');
      cy.get('.order-details').should('contain', 'Cash on delivery').and('contain', 'Ivan Petrov').and('contain', '1 Vitosha Blvd');

      // Nothing is left to pay, so the cart is emptied.
      cy.get('bg-cart-badge igx-badge').should('not.exist');
      cy.window().then(win => expect(savedCart(win)).to.be.null);
    });

    it('Sends the customer to pay online and confirms the order once paid', () => {
      // The payment provider's checkout is replaced by the page it returns the customer to.
      const returnUrl = `${Cypress.config('baseUrl')}${EN}/shop/order/order-card`;
      cy.intercept({ method: 'POST', url: shopApi.orders }, { body: created('order-card', returnUrl) }).as('createOrder');

      // The provider's confirmation arrives only when the test says so.
      let paid = false;
      cy.intercept({ method: 'GET', url: shopApi.order }, req => {
        req.reply({
          body: paid
            ? orderView('order-card', OrderStatus.Paid, lines, { paymentStatus: PaymentStatus.Completed, paidOn: '2026-11-09T10:01:00Z' })
            : orderView('order-card', OrderStatus.AwaitingPayment, lines, {
              paymentStatus: PaymentStatus.Pending,
              checkoutUrl: 'https://checkout.revolut.com/payment-link/fake'
            })
        });
      }).as('order');

      fillCheckoutForm();
      cy.contains('You will be redirected to Revolut').should('be.visible');
      cy.get('button.pay-button').click();

      cy.wait('@createOrder').its('request.body').should('deep.include', { paymentMethod: PaymentMethod.Revolut, ...customer });

      cy.location('pathname').should('match', shopPath('/shop/order/order-card'));
      cy.contains('h2', 'Awaiting payment').should('be.visible');
      cy.contains('We are waiting for the payment confirmation from Revolut.').should('be.visible');
      cy.contains('button', 'Complete payment').should('be.visible');

      // Until the payment is confirmed the cart is kept, in case the customer backs out of it.
      cy.get('bg-cart-badge igx-badge').should('contain', '2');
      cy.window().then(win => expect(savedCart(win).pendingOrder.id).to.eq('order-card'));

      cy.then(() => {
        paid = true;
      });
      // The page polls every few seconds while the payment is pending.
      cy.contains('h2', 'Paid', { timeout: 10000 }).should('be.visible');
      cy.contains(`Thank you! Your payment was received and a confirmation was sent to ${customer.email}.`).should('be.visible');
      cy.get('.order-details').should('contain', 'Pay online by card');
      cy.get('bg-cart-badge igx-badge').should('not.exist');
      cy.window().then(win => expect(savedCart(win)).to.be.null);
    });

    it('Shows why the order could not be placed', () => {
      cy.intercept({ method: 'POST', url: shopApi.orders }, {
        statusCode: 409,
        body: { problems: [`Only 0 left of ${umbrella.name}.`] }
      }).as('createOrder');

      fillCheckoutForm();
      cy.get('button.pay-button').click();
      cy.wait('@createOrder');

      cy.get('ul.problems').should('contain', `Only 0 left of ${umbrella.name}.`);
      // The cart is priced again so it shows what changed.
      cy.wait('@quote');
      cy.location('pathname').should('match', shopPath('/shop/checkout'));
      cy.get('button.pay-button').should('be.enabled');
      cy.get('bg-cart-badge igx-badge').should('contain', '2');
    });

    it('Asks to try again later when payments are unavailable', () => {
      cy.intercept({ method: 'POST', url: shopApi.orders }, { statusCode: 503, body: 'Service unavailable' }).as('createOrder');

      fillCheckoutForm();
      cy.get('button.pay-button').click();
      cy.wait('@createOrder');

      cy.get('ul.problems').should('contain', 'Payments are temporarily unavailable. Please try again in a few minutes.');
      cy.location('pathname').should('match', shopPath('/shop/checkout'));
    });

    it('Goes back to the cart', () => {
      cy.contains('a', 'Back to cart').click();
      cy.location('pathname').should('match', shopPath('/shop/cart'));
      cy.get('li.cart-line').should('have.length', 2);
    });
  });

  describe('Order status', () => {
    it('Shows a shipped cash on delivery order with its tracking number', () => {
      cy.intercept({ method: 'GET', url: shopApi.order }, {
        body: orderView('order-shipped', OrderStatus.Shipped, [{ productId: umbrella.id, quantity: 1 }], {
          paymentMethod: PaymentMethod.CashOnDelivery,
          trackingNumber: 'TRK-123456'
        })
      }).as('order');

      cy.visit(`${EN}/shop/order/order-shipped`);
      cy.wait('@order');
      cy.contains('h2', 'Shipped').should('be.visible');
      cy.contains('Your order is on its way.').should('be.visible');
      cy.contains('Please have €23.00 ready for the courier.').should('be.visible');
      cy.contains('.highlight', 'TRK-123456').should('be.visible');
    });

    it('Offers to pay again for an order whose payment failed', () => {
      cy.intercept({ method: 'GET', url: shopApi.order }, {
        body: orderView('order-failed', OrderStatus.AwaitingPayment, [{ productId: umbrella.id, quantity: 1 }], {
          paymentStatus: PaymentStatus.Failed,
          canRetryPayment: true
        })
      }).as('order');
      cy.intercept({ method: 'POST', url: /\/api\/shop\/orders\/order-failed\/retry-payment$/ }, { statusCode: 500 }).as('retry');

      cy.visit(`${EN}/shop/order/order-failed`);
      cy.wait('@order');
      cy.contains('The payment did not go through.').should('be.visible');

      cy.contains('button', 'Try paying again').click();
      cy.wait('@retry');
      cy.contains('We could not start a new payment. Please try again in a moment.').should('be.visible');
      cy.contains('button', 'Try paying again').should('be.enabled');
    });

    it('Says when an order cannot be found', () => {
      cy.intercept({ method: 'GET', url: shopApi.order }, { statusCode: 404, body: 'Not found' }).as('order');

      cy.visit(`${EN}/shop/order/missing-order`);
      cy.wait('@order');
      cy.contains('We could not find this order.').should('be.visible');
      cy.contains('a', 'Back to the shop').click();
      cy.location('pathname').should('match', shopPath('/shop'));
    });
  });
});
