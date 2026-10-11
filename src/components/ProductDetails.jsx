import { useState } from 'react';
import Icon from './Icon.jsx';

const money = (amount) => `$${amount.toFixed(2)}`;

function Rating({ rating, reviews }) {
  return (
    <div className="product-details__rating">
      <span className="stars" role="img" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: Math.floor(rating) }, (_, index) => (
          <Icon key={index} name="ic_round-star-rate" size={20} />
        ))}
        {rating % 1 >= 0.5 && <Icon name="ic_round-star-half" size={20} />}
      </span>
      <span>{rating.toFixed(1)} ({reviews} reviews)</span>
    </div>
  );
}

export default function ProductDetails({ product, products, shop, onBack, onProductOpen }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const stock = Number.isInteger(product.stock) ? product.stock : Infinity;
  const wished = shop.wishlist.has(product.id);
  const relatedProducts = products.filter((item) => item.id !== product.id).slice(0, 4);

  const addToCart = () => {
    if (stock < 1) return;
    shop.addToCart(product.id, Math.min(quantity, stock));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="product-details container">
      <nav className="product-details__breadcrumb" aria-label="Breadcrumb">
        <a href="#top" onClick={(event) => { event.preventDefault(); onBack(); }}>Home</a>
        <span aria-hidden="true">/</span>
        <span>{product.name}</span>
      </nav>

      <section className="product-details__main" aria-labelledby="product-details-title">
        <div className="product-details__image-wrap">
          <img className="product-details__image" src={product.image} alt={product.name} />
        </div>
        <div className="product-details__info">
          <p className="product-details__eyebrow">Fresh from Organic</p>
          <h1 id="product-details-title">{product.name}</h1>
          <Rating rating={product.rating} reviews={product.reviews} />
          <div className="product-details__price">
            <span>{money(product.price)}</span>
            <del>{money(product.oldPrice)}</del>
            <span className="product-details__discount">{product.discount}</span>
          </div>
          <p className="product-details__description">
            {product.name} is ready to add to your basket. Check the product packaging for ingredients, storage, and serving information.
          </p>
          <p className="product-details__availability"><span aria-hidden="true" /> {stock > 0 ? `${stock} available to order` : 'Currently out of stock'}</p>
          <div className="product-details__purchase">
            <div className="product-details__quantity" role="group" aria-label="Product quantity">
              <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
              <output aria-live="polite">{quantity}</output>
              <button type="button" aria-label="Increase quantity" disabled={quantity >= stock} onClick={() => setQuantity((value) => Math.min(stock, value + 1))}>+</button>
            </div>
            <button type="button" className="product-details__add" onClick={addToCart} disabled={stock < 1}>
              <Icon name="tdesign_cart-add" size={19} />
              {stock < 1 ? 'Out of stock' : added ? 'Added to cart' : 'Add to cart'}
            </button>
            <button
              type="button"
              className={`product-details__wish${wished ? ' is-active' : ''}`}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={wished}
              onClick={() => shop.toggleWishlist(product.id)}
            >
              <Icon name="bx_heart" size={22} />
            </button>
          </div>
          <dl className="product-details__meta">
            <div><dt>Product</dt><dd>{product.name}</dd></div>
            <div><dt>Item number</dt><dd>{String(product.id).padStart(3, '0')}</dd></div>
          </dl>
        </div>
      </section>

      <section className="product-details__related" aria-labelledby="related-products-title">
        <h2 id="related-products-title">You may also like</h2>
        <div className="product-details__related-grid">
          {relatedProducts.map((item) => (
            <button type="button" className="product-details__related-card" key={item.id} onClick={() => onProductOpen(item.id)}>
              <img src={item.image} alt="" loading="lazy" />
              <span>{item.name}</span>
              <strong>{money(item.price)}</strong>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
