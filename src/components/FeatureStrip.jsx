import { features, featureText } from '../data/content.js';

export default function FeatureStrip() {
  return (
    <section className="container section features" id="features" aria-label="Our services">
      <ul className="features__list">
        {features.map((f) => (
          <li key={f.id} className="feature">
            <img src={f.icon} width="48" height="48" alt="" loading="lazy" />
            <h3>{f.title}</h3>
            <p>{featureText}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
