import { useRef } from 'react';
import SectionHeader, { ArrowButtons } from './SectionHeader.jsx';
import Icon from './Icon.jsx';
import { categories } from '../data/categories.js';

export default function CategorySection({ onCategoryOpen }) {
  const listRef = useRef(null);
  const scroll = (dir) => {
    const el = listRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="container section categories" id="categories" aria-labelledby="categories-title">
      <SectionHeader id="categories-title" title="Popular  categories">
        <div className="categories__tools">
          <a
            href="?category=all"
            className="categories__all"
            onClick={(event) => {
              event.preventDefault();
              onCategoryOpen?.('all');
            }}
          >
            View All Categories <Icon name="view-all-arrow" size={14} />
          </a>
          <ArrowButtons label="categories" onPrev={() => scroll(-1)} onNext={() => scroll(1)} />
        </div>
      </SectionHeader>
      <ul className="categories__list" ref={listRef}>
        {categories.map((c, i) => (
          <li key={c.id}>
            <a
              href={`?category=${c.slug}`}
              className="category"
              onClick={(event) => {
                event.preventDefault();
                onCategoryOpen?.(c.slug);
              }}
            >
              <span className="category__thumb">
                <img src={c.image} alt="" width="160" height="160" loading={i < 6 ? 'eager' : 'lazy'} />
              </span>
              <span className="category__name">{c.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
