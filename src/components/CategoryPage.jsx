import { useState } from 'react';
import ProductCard from './ProductCard.jsx';
import { categories } from '../data/categories.js';

export default function CategoryPage({ categoryId, products, shop, onBack, onCategoryOpen, onProductOpen }) {
  const [openId, setOpenId] = useState(null);
  const category = categories.find((item) => item.slug === categoryId);
  const categoryProducts = category
    ? category.productIds.map((id) => products.find((product) => product.id === id)).filter(Boolean)
    : [];

  if (categoryId === 'all') {
    return (
      <div className="category-page container">
        <nav className="category-page__breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={onBack}>Home</button>
          <span aria-hidden="true">/</span>
          <span>All categories</span>
        </nav>
        <header className="category-page__heading">
          <p className="category-page__eyebrow">Explore the store</p>
          <h1>All categories</h1>
          <p>Browse our departments and discover something fresh.</p>
        </header>
        <div className="category-page__directory">
          {categories.map((item) => (
            <button type="button" className="category-page__directory-card" key={item.slug} onClick={() => onCategoryOpen(item.slug)}>
              <img src={item.image} alt="" />
              <span>{item.name}</span>
              <small>{item.productIds.length} {item.productIds.length === 1 ? 'product' : 'products'}</small>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-page container">
        <section className="category-page__empty">
          <h1>Category not found</h1>
          <p>Choose a category to explore the products in our store.</p>
          <button type="button" className="category-page__back" onClick={onBack}>Back to shop</button>
        </section>
      </div>
    );
  }

  return (
    <div className="category-page container">
      <nav className="category-page__breadcrumb" aria-label="Breadcrumb">
        <button type="button" onClick={onBack}>Home</button>
        <span aria-hidden="true">/</span>
        <button type="button" onClick={() => onCategoryOpen('all')}>All categories</button>
        <span aria-hidden="true">/</span>
        <span>{category.name}</span>
      </nav>
      <header className="category-page__hero">
        <img src={category.image} alt="" />
        <div>
          <p className="category-page__eyebrow">Shop by category</p>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
          {categoryProducts.length > 0 && (
            <span>{categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}</span>
          )}
        </div>
      </header>

      <section className="category-page__products" aria-labelledby="category-products-title">
        <h2 id="category-products-title">{category.name} products</h2>
        {categoryProducts.length > 0 ? (
          <div
            className="category-page__product-grid"
            onMouseLeave={() => setOpenId(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setOpenId(null);
            }}
          >
            {categoryProducts.map((product) => (
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
          <div className="category-page__empty">
            <h3>We’re stocking this category soon</h3>
            <p>There are no products listed here yet. Check back soon or explore another category.</p>
            <button type="button" className="category-page__back" onClick={() => onCategoryOpen('all')}>Browse all categories</button>
          </div>
        )}
      </section>

      <nav className="category-page__more" aria-label="Other categories">
        <h2>Explore other categories</h2>
        <div>
          {categories.filter((item) => item.slug !== category.slug).map((item) => (
            <button type="button" key={item.slug} onClick={() => onCategoryOpen(item.slug)}>{item.name}</button>
          ))}
        </div>
      </nav>
    </div>
  );
}
