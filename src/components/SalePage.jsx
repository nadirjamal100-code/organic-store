import { useState } from 'react';
import ProductCard from './ProductCard.jsx';

export default function SalePage({ products, shop, onProductOpen }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="sale-page container">
      <nav className="sale-page__breadcrumb" aria-label="Breadcrumb">
        <a href="#top">Home</a>
        <span aria-hidden="true">/</span>
        <span>Sale</span>
      </nav>
      <header className="sale-page__hero">
        <span className="sale-page__tag">Special offers</span>
        <h1>Shop products on sale</h1>
        <p>Discover current offers on selected groceries and add your favorites to your basket.</p>
      </header>
      <section className="sale-page__products" aria-labelledby="sale-products-title">
        <div className="sale-page__section-heading">
          <div>
            <h2 id="sale-products-title">Current deals</h2>
            <p>{products.length} products on offer</p>
          </div>
        </div>
        {products.length ? (
          <div
            className="sale-page__grid"
            onMouseLeave={() => setOpenId(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setOpenId(null);
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                open={openId === product.id}
                onOpen={() => setOpenId(product.id)}
                shop={shop}
                onProductOpen={onProductOpen}
              />
            ))}
          </div>
        ) : (
          <p className="sale-page__empty">There are no sale items available right now. Please check back soon.</p>
        )}
      </section>
    </div>
  );
}
