import SectionHeader from './SectionHeader.jsx';
import Icon from './Icon.jsx';
import { articles, articleExcerpt } from '../data/content.js';

export default function ArticlesSection({ onArticleOpen }) {
  return (
    <section className="container section articles" id="articles" aria-labelledby="articles-title">
      <SectionHeader id="articles-title" title="our latest articles">
        <a href="#articles" className="btn btn--green btn--square btn--spaced">view all</a>
      </SectionHeader>
      <div className="articles__grid">
        {articles.map((a) => (
          <article key={a.id} className="article-card">
            <img src={a.image} alt="" width="499" height="240" loading="lazy" className="article-card__img" />
            <div className="article-card__content">
              <ul className="article-card__meta">
                <li><Icon name="uil_calender" size={24} /> <span>{a.date}</span></li>
                <li><Icon name="uil_folder" size={24} /> <span>{a.category}</span></li>
              </ul>
              <h3 className="article-card__title">
                <button type="button" onClick={() => onArticleOpen?.(a.id)}>{a.title}</button>
              </h3>
              <p className="article-card__excerpt">{articleExcerpt}</p>
              <button type="button" className="link-underline link-underline--dark article-card__read-more" onClick={() => onArticleOpen?.(a.id)}>Read more</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
