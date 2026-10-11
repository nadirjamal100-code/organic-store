import Icon from './Icon.jsx';

const money = (amount) => `$${amount.toFixed(2)}`;

export default function CartPage({ products, cart, onQuantityChange, onContinueShopping, onProductOpen, onCheckout }) {
  const items = products.filter((product) => cart[product.id] > 0);
  const itemCount = items.reduce((count, product) => count + cart[product.id], 0);
  const subtotal = items.reduce((sum, product) => sum + product.price * cart[product.id], 0);

  return (
    <div className="cart-page container">
      <nav className="cart-page__breadcrumb" aria-label="Breadcrumb">
        <a href="#top" onClick={(event) => { event.preventDefault(); onContinueShopping(); }}>Home</a>
        <span aria-hidden="true">/</span>
        <span>Shopping cart</span>
      </nav>
      <div className="cart-page__heading">
        <div>
          <p className="cart-page__eyebrow">Your basket</p>
          <h1>Shopping cart</h1>
        </div>
        {items.length > 0 && <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>}
      </div>

      {items.length === 0 ? (
        <section className="cart-page__empty" aria-live="polite">
          <Icon name="solar_cart-3-linear" size={52} />
          <h2>Your cart is empty</h2>
          <p>Explore our products and add something fresh to your basket.</p>
          <button type="button" className="cart-page__continue" onClick={onContinueShopping}>Continue shopping</button>
        </section>
      ) : (
        <>
          <div className="cart-page__layout">
            <section className="cart-page__items" aria-label="Cart items">
              <div className="cart-page__columns" aria-hidden="true">
                <span>Product</span><span>Price</span><span>Quantity</span><span>Total</span>
              </div>
              {items.map((product) => {
                const quantity = cart[product.id];
                return (
                  <article className="cart-item" key={product.id}>
                    <button type="button" className="cart-item__product" onClick={() => onProductOpen(product.id)}>
                      <span className="cart-item__image"><img src={product.image} alt="" /></span>
                      <span className="cart-item__name">{product.name}</span>
                    </button>
                    <span className="cart-item__price">{money(product.price)}</span>
                    <div className="cart-item__quantity" role="group" aria-label={`${product.name} quantity`}>
                      <button
                        type="button"
                        aria-label={`Decrease ${product.name} quantity`}
                        onClick={() => onQuantityChange(product.id, quantity - 1)}
                      >−</button>
                      <output aria-live="polite">{quantity}</output>
                      <button
                        type="button"
                        aria-label={`Increase ${product.name} quantity`}
                        onClick={() => onQuantityChange(product.id, quantity + 1)}
                      >+</button>
                    </div>
                    <strong className="cart-item__total">{money(product.price * quantity)}</strong>
                    <button
                      type="button"
                      className="cart-item__remove"
                      aria-label={`Remove ${product.name} from cart`}
                      onClick={() => onQuantityChange(product.id, 0)}
                    >Remove</button>
                  </article>
                );
              })}
              <button type="button" className="cart-page__continue-link" onClick={onContinueShopping}>
                <span aria-hidden="true">←</span> Continue shopping
              </button>
            </section>

            <aside className="cart-summary" aria-labelledby="cart-summary-title">
              <h2 id="cart-summary-title">Order summary</h2>
              <div className="cart-summary__line"><span>Subtotal ({itemCount} items)</span><strong>{money(subtotal)}</strong></div>
              <p>Shipping and taxes are calculated at checkout.</p>
              <div className="cart-summary__total"><span>Estimated total</span><strong>{money(subtotal)}</strong></div>
              <button type="button" className="cart-page__checkout" onClick={onCheckout}>Proceed to checkout</button>
              <button type="button" className="cart-page__continue-link" onClick={onContinueShopping}>Continue shopping</button>
            </aside>
          </div>
          <p className="cart-page__note">Prices are shown in USD. Your cart is saved on this device.</p>
        </>
      )}
    </div>
  );
}
