export default function PaymentPage({ onCheckout, onContact, onShop }) {
  return (
    <div className="payment-page container">
      <nav className="payment-page__breadcrumb" aria-label="Breadcrumb">
        <button type="button" onClick={onShop}>Home</button>
        <span aria-hidden="true">/</span>
        <span>Payments</span>
      </nav>

      <header className="payment-page__heading">
        <p className="payment-page__eyebrow">Simple and convenient</p>
        <h1>Payment options</h1>
        <p>Choose how you would like to pay when you place your grocery order.</p>
      </header>

      <section className="payment-page__methods" aria-label="Available payment options">
        <article className="payment-page__method">
          <span className="payment-page__method-icon" aria-hidden="true">$</span>
          <div>
            <h2>Cash on Delivery</h2>
            <p>Pay for your order when it arrives at your door. Select Cash on Delivery during checkout.</p>
          </div>
          <span className="payment-page__badge">Available</span>
        </article>

        <article className="payment-page__method">
          <span className="payment-page__method-icon payment-page__method-icon--card" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 10h18m-14 5h3" />
            </svg>
          </span>
          <div>
            <h2>Credit or debit card</h2>
            <p>Visa, Mastercard, and American Express are shown as demo options at checkout.</p>
          </div>
          <span className="payment-page__badge payment-page__badge--demo">Demo only</span>
        </article>
      </section>

      <aside className="payment-page__notice" aria-label="Payment information">
        <span aria-hidden="true">i</span>
        <p>
          This storefront does not process card payments. Card options are for demonstration only;
          no card details are requested, stored, or charged. For a real payment experience, a payment
          provider must be configured.
        </p>
      </aside>

      <div className="payment-page__actions">
        <button type="button" className="payment-page__primary" onClick={onCheckout}>Continue to checkout</button>
        <button type="button" className="payment-page__secondary" onClick={onContact}>Questions about payments?</button>
      </div>
    </div>
  );
}
