import { useState } from 'react';
import Icon from './Icon.jsx';

const money = (n) => `$${n.toFixed(2)}`;

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="stars" role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: full }, (_, i) => (
        <Icon key={i} name="ic_round-star-rate" size={20} />
      ))}
      {half && <Icon name="ic_round-star-half" size={20} />}
    </span>
  );
}

export default function ProductCard({ product, open, onOpen, shop, onProductOpen, lazy }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const wished = shop.wishlist.has(product.id);
  const stock = Number.isInteger(product.stock) ? product.stock : Infinity;

  const add = () => {
    if (stock < 1) return;
    shop.addToCart(product.id, Math.min(qty, stock));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };
  const buttonLabel = stock < 1 ? 'Out of stock' : added ? 'Added to cart' : 'Add to cart';
  const compactButtonLabel = stock < 1 ? 'Unavailable' : added ? 'Added' : 'Add';

  return (
    <article
      className={`product-card${open ? ' is-open' : ''}`}
      onMouseEnter={onOpen}
      onFocus={onOpen}
    >
      <div className="product-card__surface" aria-hidden="true" />
      <div className="product-card__body">
        <a
          className="product-card__detail-link"
          href={`?product=${product.id}`}
          aria-label={`View ${product.name} details`}
          onClick={(event) => {
            event.preventDefault();
            onProductOpen(product.id);
          }}
        >
          <div className="product-card__media" style={{ width: product.imgW, height: product.imgH }}>
            <img
              src={product.image}
              alt={product.name}
              width={product.imgW}
              height={product.imgH}
              loading={lazy ? 'lazy' : 'eager'}
              style={{ objectFit: product.fit }}
            />
          </div>
          <h3 className="product-card__name">{product.name}</h3>
        </a>
        <p className="product-card__price">
          <del>{money(product.oldPrice)}</del>
          <ins>{money(product.price)}</ins>
          <span className="product-card__discount">{product.discount}</span>
        </p>
        <p className="product-card__reviews">
          <Stars rating={product.rating} />
          <span>({product.reviews})</span>
        </p>
      </div>

      <div className="product-card__actions">
        <div className="qty" role="group" aria-label="Quantity">
          <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
            <svg width="8" height="2" viewBox="0 0 8 2" aria-hidden="true"><rect width="8" height="2" fill="#222" /></svg>
          </button>
          <output aria-live="polite">{qty}</output>
          <button type="button" aria-label="Increase quantity" disabled={qty >= stock} onClick={() => setQty((q) => Math.min(stock, q + 1))}>
            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true"><path d="M3 0h2v3h3v2H5v3H3V5H0V3h3z" fill="#222" /></svg>
          </button>
        </div>
        <div className="product-card__buttons">
          <button type="button" className="add-btn" onClick={add} disabled={stock < 1} aria-label={buttonLabel}>
            <Icon name="tdesign_cart-add" size={17} />
            <span className="add-btn__label--full">{stock < 1 ? 'Out of stock' : added ? 'Added ✓' : 'Add to cart'}</span>
            <span className="add-btn__label--compact" aria-hidden="true">{compactButtonLabel}</span>
          </button>
          <button
            type="button"
            className={`wish-btn${wished ? ' is-active' : ''}`}
            aria-pressed={wished}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => shop.toggleWishlist(product.id)}
          >
            <Icon name="bx_heart" width={19} height={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
