import Icon from './Icon.jsx';

export function ArrowButtons({ onPrev, onNext, label }) {
  return (
    <div className="arrows">
      <button type="button" className="arrow-btn arrow-btn--light" aria-label={`Previous ${label}`} onClick={onPrev}>
        <Icon name="chevron-left-dark" size={25} />
      </button>
      <button type="button" className="arrow-btn arrow-btn--green" aria-label={`Next ${label}`} onClick={onNext}>
        <Icon name="chevron-right-white" size={25} />
      </button>
    </div>
  );
}

export default function SectionHeader({ id, title, children }) {
  return (
    <div className="section-header">
      <h2 id={id} className="section-title">{title}</h2>
      {children}
    </div>
  );
}
