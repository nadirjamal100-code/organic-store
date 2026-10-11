import { promos } from '../data/content.js';

export default function PromoBanners() {
  return (
    <section className="container promos" aria-label="Promotions">
      {promos.map((p) => (
        <div key={p.id} className={`promo promo--${p.size} promo--${p.id}`} style={p.bg ? { background: p.bg } : undefined}>
          <img src={p.image} alt="" loading="lazy" className="promo__img" />
          <div className="promo__text">
            <h2>{p.title}</h2>
            <p>{p.text}</p>
            <a href={p.href} className="link-underline">shop now</a>
          </div>
        </div>
      ))}
    </section>
  );
}
