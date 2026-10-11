import Icon from './Icon.jsx';

export default function ArticleDetails({ article, onBack }) {
  if (!article) return null;

  return (
    <article className="article-details container">
      <nav className="article-details__breadcrumb" aria-label="Breadcrumb">
        <button type="button" onClick={onBack}>Home</button>
        <span aria-hidden="true">/</span>
        <a href="#articles" onClick={(event) => { event.preventDefault(); onBack(); }}>Articles</a>
        <span aria-hidden="true">/</span>
        <span>{article.category}</span>
      </nav>
      <header className="article-details__header">
        <div className="article-details__meta">
          <span><Icon name="uil_calender" size={21} />{article.date}</span>
          <span><Icon name="uil_folder" size={21} />{article.category}</span>
        </div>
        <h1>{article.title}</h1>
        <p className="article-details__intro">{article.intro}</p>
      </header>
      <figure className="article-details__hero">
        <img src={article.image} alt="" />
      </figure>
      <div className="article-details__body">
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
          </section>
        ))}
        <p className="article-details__disclaimer">
          This article is for general information. Adapt food choices and preparation to your needs, and follow current food-safety guidance.
        </p>
      </div>
      <button type="button" className="article-details__back" onClick={onBack}>
        <span aria-hidden="true">←</span> Back to the shop
      </button>
    </article>
  );
}
