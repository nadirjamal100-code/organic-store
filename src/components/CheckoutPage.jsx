import { useState } from 'react';

const CARD_METHODS = [
  { id: 'visa', label: 'Visa', mark: 'VISA' },
  { id: 'mastercard', label: 'Mastercard', mark: 'Mastercard' },
  { id: 'amex', label: 'American Express', mark: 'AMEX' },
];

const money = (amount) => `$${amount.toFixed(2)}`;

export default function CheckoutPage({ products, cart, onBackToCart, onPlaceOrder }) {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const items = products.filter((product) => cart[product.id] > 0);
  const itemCount = items.reduce((count, product) => count + cart[product.id], 0);
  const subtotal = items.reduce((sum, product) => sum + product.price * cart[product.id], 0);

  const submitOrder = async (event) => {
    event.preventDefault();
    if (!items.length) return;
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    setSubmitting(true);
    setError('');
    try {
      await onPlaceOrder({
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
      }, paymentMethod);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="checkout-page container">
        <section className="checkout-page__empty">
          <h1>Your cart is empty</h1>
          <p>Add products to your cart before checkout.</p>
          <button type="button" className="checkout-page__primary" onClick={onBackToCart}>Back to cart</button>
        </section>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <nav className="checkout-page__breadcrumb" aria-label="Breadcrumb">
        <button type="button" onClick={onBackToCart}>Shopping cart</button>
        <span aria-hidden="true">/</span>
        <span>Checkout</span>
      </nav>
      <div className="checkout-page__heading">
        <p className="checkout-page__eyebrow">Almost there</p>
        <h1>Checkout</h1>
      </div>

      <form className="checkout-page__layout" onSubmit={submitOrder}>
        <div className="checkout-page__form">
          <section className="checkout-card" aria-labelledby="delivery-title">
            <div className="checkout-card__heading">
              <span>1</span>
              <h2 id="delivery-title">Contact and delivery</h2>
            </div>
            <div className="checkout-fields">
              <label>
                Full name
                <input name="name" type="text" autoComplete="name" required />
              </label>
              <label>
                Email address
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                Phone number
                <input name="phone" type="tel" autoComplete="tel" required />
              </label>
              <label className="checkout-fields__wide">
                Street address
                <input name="address" type="text" autoComplete="street-address" required />
              </label>
              <label>
                City
                <input name="city" type="text" autoComplete="address-level2" required />
              </label>
              <label>
                ZIP / postal code
                <input name="postalCode" type="text" autoComplete="postal-code" required />
              </label>
            </div>
          </section>

          <section className="checkout-card" aria-labelledby="payment-title">
            <div className="checkout-card__heading">
              <span>2</span>
              <h2 id="payment-title">Payment method</h2>
            </div>
            <div className="payment-options">
              <label className={`payment-option${paymentMethod === 'cod' ? ' is-selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span className="payment-option__radio" aria-hidden="true" />
                <span className="payment-option__copy">
                  <strong>Cash on Delivery</strong>
                  <small>Pay when your order arrives.</small>
                </span>
                <span className="payment-option__cod" aria-hidden="true">$</span>
              </label>
              {CARD_METHODS.map((method) => (
                <label className={`payment-option${paymentMethod === method.id ? ' is-selected' : ''}`} key={method.id}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                  />
                  <span className="payment-option__radio" aria-hidden="true" />
                  <span className="payment-option__copy">
                    <strong>{method.label}</strong>
                    <small>Credit or debit card</small>
                  </span>
                  <span className={`payment-option__brand payment-option__brand--${method.id}`} aria-label={method.label}>{method.mark}</span>
                </label>
              ))}
            </div>
            <p className="checkout-page__demo-note">
              Demo checkout only: card payments are not processed and no card details are requested or stored.
            </p>
          </section>
          <button type="button" className="checkout-page__back" onClick={onBackToCart}>← Back to cart</button>
        </div>

        <aside className="checkout-summary" aria-labelledby="checkout-summary-title">
          <h2 id="checkout-summary-title">Your order</h2>
          <ul className="checkout-summary__items">
            {items.map((product) => (
              <li key={product.id}>
                <span className="checkout-summary__item-name">
                  {product.name} <small>× {cart[product.id]}</small>
                </span>
                <strong>{money(product.price * cart[product.id])}</strong>
              </li>
            ))}
          </ul>
          <div className="checkout-summary__line"><span>Subtotal ({itemCount} items)</span><strong>{money(subtotal)}</strong></div>
          <div className="checkout-summary__line"><span>Delivery</span><strong>Free</strong></div>
          <div className="checkout-summary__total"><span>Total</span><strong>{money(subtotal)}</strong></div>
          <button type="submit" className="checkout-page__primary" disabled={submitting}>
            {submitting ? 'Placing order…' : paymentMethod === 'cod' ? 'Place order · Cash on Delivery' : 'Place order'}
          </button>
          {error && <p className="checkout-summary__secure" role="alert">{error}</p>}
          <p className="checkout-summary__secure">Card payment options are for display only; no card details are collected or charged.</p>
        </aside>
      </form>
    </div>
  );
}
