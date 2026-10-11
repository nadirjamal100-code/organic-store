import { popularSearches } from '../data/content.js';

export default function PopularSearches() {
  return (
    <section className="container section tags" aria-labelledby="tags-title">
      <h2 id="tags-title" className="section-title">People are also looking for</h2>
      <ul className="tags__list">
        {popularSearches.map((t) => (
          <li key={t}>
            <a href="#freshly-arrived" className="tag">{t}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
