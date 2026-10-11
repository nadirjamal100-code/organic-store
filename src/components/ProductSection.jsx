import { useRef, useState } from 'react';
import ProductCard from './ProductCard.jsx';
import SectionHeader, { ArrowButtons } from './SectionHeader.jsx';

export default function ProductSection({ id, title, products, variant, viewAllHref, defaultOpenId, shop, onProductOpen }) {
  const [openId, setOpenId] = useState(defaultOpenId ?? null);
  const gridRef = useRef(null);
  const scroll = (dir) => {
    const el = gridRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className={`container section product-section product-section--${variant}`} id={id} aria-labelledby={`${id}-title`}>
      <SectionHeader id={`${id}-title`} title={title}>
        {variant === 'arrived' ? (
          <a href={viewAllHref} className="btn btn--green btn--square btn--spaced">view all</a>
        ) : (
          <ArrowButtons label={title} onPrev={() => scroll(-1)} onNext={() => scroll(1)} />
        )}
      </SectionHeader>
      <div className="product-grid" ref={gridRef} onMouseLeave={() => setOpenId(defaultOpenId ?? null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOpenId(defaultOpenId ?? null);
        }}>
        {products.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            open={openId === p.id}
            onOpen={() => setOpenId(p.id)}
            shop={shop}
            onProductOpen={onProductOpen}
            lazy={variant !== 'arrived' || i > 5}
          />
        ))}
      </div>
    </section>
  );
}
